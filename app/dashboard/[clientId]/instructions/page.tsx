// app/dashboard/[clientId]/instructions/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// Add a global counter to track renders
let renderCount = 0;
let effectRunCount = 0;
let queryCount = 0;

interface ClientInstructions {
    id?: string;
    client_id: string;
    business_name: string;
    business_type?: string;
    tone_style: string;
    communication_style: string;
    formality_level: string;
    special_instructions?: string;
    formatting_rules?: string;
    lead_capture_process?: string;
    response_time: string;
    created_at?: string;
    updated_at?: string;
}

export default function InstructionsPage() {
    // Track renders
    renderCount++;
    console.log(`🔄 RENDER #${renderCount} at ${new Date().toISOString()}`);

    const params = useParams();
    const clientId = params.clientId as string;
    const router = useRouter();

    // Use a ref to absolutely prevent multiple fetches
    const hasFetchedRef = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    console.log(`📋 Component state: clientId=${clientId}, hasFetched=${hasFetchedRef.current}`);

    const [instructions, setInstructions] = useState<ClientInstructions>({
        client_id: clientId,
        business_name: '',
        tone_style: 'friendly',
        communication_style: 'conversational',
        formality_level: 'professional',
        special_instructions: '',
        formatting_rules: '',
        lead_capture_process: '',
        response_time: '2 hours'
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Debug state changes
    useEffect(() => {
        console.log('📊 State changed:', {
            loading,
            error,
            hasInstructions: !!instructions.id,
            businessName: instructions.business_name
        });
    }, [loading, error, instructions]);

    useEffect(() => {
        effectRunCount++;
        console.log(`🎯 EFFECT RUN #${effectRunCount} - hasFetched: ${hasFetchedRef.current}, clientId: ${clientId}`);

        // Absolute guard against multiple fetches
        if (hasFetchedRef.current) {
            console.log('❌ Skipping fetch - already fetched');
            return;
        }

        if (!clientId) {
            console.log('❌ Skipping fetch - no clientId');
            setLoading(false);
            return;
        }

        // Cancel any in-flight requests
        if (abortControllerRef.current) {
            console.log('🛑 Aborting previous request');
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        // Mark as fetched IMMEDIATELY
        hasFetchedRef.current = true;
        console.log('✅ Marking as fetched and starting query');

        const loadInstructions = async () => {
            queryCount++;
            const queryId = queryCount;
            console.log(`🔍 QUERY #${queryId} START at ${new Date().toISOString()}`);

            try {
                const { data, error: fetchError } = await supabase
                    .from('client_instructions')
                    .select('*')
                    .eq('client_id', clientId)
                    .maybeSingle();

                console.log(`📦 QUERY #${queryId} RESULT:`, {
                    hasData: !!data,
                    hasError: !!fetchError,
                    errorCode: fetchError?.code
                });

                // Check if this request was aborted
                if (abortControllerRef.current?.signal.aborted) {
                    console.log(`⚠️ QUERY #${queryId} was aborted, ignoring results`);
                    return;
                }

                if (fetchError && fetchError.code !== 'PGRST116') {
                    console.error(`❌ QUERY #${queryId} ERROR:`, fetchError);
                    setError(fetchError.message);
                }

                if (data) {
                    console.log(`✅ QUERY #${queryId} SUCCESS - Setting data`);
                    setInstructions(data);
                } else {
                    console.log(`ℹ️ QUERY #${queryId} - No existing data, using defaults`);
                }
            } catch (err: any) {
                console.error(`💥 QUERY #${queryId} EXCEPTION:`, err);
                if (!abortControllerRef.current?.signal.aborted) {
                    setError(err?.message || 'Failed to load instructions');
                }
            } finally {
                console.log(`🏁 QUERY #${queryId} COMPLETE`);
                setLoading(false);
            }
        };

        loadInstructions();

        // Cleanup function
        return () => {
            console.log('🧹 Cleanup: Effect unmounting');
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
                abortControllerRef.current = null;
            }
        };
    }, []); // EMPTY DEPENDENCIES - only run once

    const saveInstructions = async () => {
        console.log('💾 Save clicked');
        try {
            setSaving(true);
            setError(null);

            if (!instructions.business_name) {
                setError('Business name is required');
                setSaving(false);
                return;
            }

            const dataToSave = {
                ...instructions,
                client_id: clientId,
                updated_at: new Date().toISOString()
            };

            console.log('📤 Saving data:', dataToSave);

            const { data, error } = await supabase
                .from('client_instructions')
                .upsert(dataToSave, {
                    onConflict: 'client_id'
                })
                .select()
                .single();

            if (error) throw error;

            console.log('✅ Save successful:', data);
            if (data) {
                setInstructions(data);
            }

            alert('Instructions saved successfully!');

        } catch (err: any) {
            console.error('❌ Save error:', err);
            setError(err?.message || 'Failed to save');
        } finally {
            setSaving(false);
        }
    };

    const handleInputChange = (field: keyof ClientInstructions, value: string) => {
        console.log(`✏️ Input change: ${field} = ${value}`);
        setInstructions(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Show debug info in UI
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg mb-4">Loading instructions for {clientId}...</p>

                    {/* Debug Info Panel */}
                    <div className="mt-8 p-4 bg-gray-100 rounded-lg text-left max-w-md">
                        <h3 className="font-bold mb-2">Debug Info:</h3>
                        <div className="text-sm space-y-1">
                            <p>Render Count: {renderCount}</p>
                            <p>Effect Run Count: {effectRunCount}</p>
                            <p>Query Count: {queryCount}</p>
                            <p>Has Fetched: {hasFetchedRef.current ? 'Yes' : 'No'}</p>
                            <p>Client ID: {clientId}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main form (simplified for debugging)
    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Debug Banner */}
            <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 rounded">
                <p className="text-sm font-mono">
                    Debug: Renders={renderCount} | Effects={effectRunCount} | Queries={queryCount} | ClientID={clientId}
                </p>
            </div>

            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <Link
                    href={`/dashboard/${clientId}`}
                    className="text-blue-500 hover:text-blue-700"
                >
                    ← Back to Dashboard
                </Link>
                <span className="text-sm text-gray-500">Client ID: {clientId}</span>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold mb-6">Chatbot Instructions</h1>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {/* Just show essential fields for debugging */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name *
                        </label>
                        <input
                            type="text"
                            value={instructions.business_name || ''}
                            onChange={(e) => handleInputChange('business_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="Enter your business name"
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            onClick={saveInstructions}
                            disabled={saving || !instructions.business_name}
                            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Instructions'}
                        </button>

                        <button
                            onClick={() => router.push(`/dashboard/${clientId}`)}
                            className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}