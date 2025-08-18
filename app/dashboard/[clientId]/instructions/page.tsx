// app/dashboard/[clientId]/instructions/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

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
    const params = useParams();
    const clientId = params.clientId as string;
    const router = useRouter();

    // Use a ref to prevent multiple fetches
    const hasFetchedRef = useRef(false);

    const [instructions, setInstructions] = useState<ClientInstructions>({
        client_id: clientId,
        business_name: '',
        business_type: '',
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

    useEffect(() => {
        // Prevent multiple fetches
        if (hasFetchedRef.current || !clientId) return;
        hasFetchedRef.current = true;

        loadInstructions();
    }, []); // Empty dependency array - only run once

    async function loadInstructions() {
        try {
            console.log('Loading instructions for:', clientId);

            const { data, error: fetchError } = await supabase
                .from('client_instructions')
                .select('*')
                .eq('client_id', clientId)
                .maybeSingle();

            if (fetchError && fetchError.code !== 'PGRST116') {
                console.error('Error fetching instructions:', fetchError);
                setError(fetchError.message);
            } else if (data) {
                console.log('Found existing instructions:', data);
                setInstructions(data);
            } else {
                console.log('No existing instructions, using defaults for:', clientId);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load instructions');
        } finally {
            setLoading(false);
        }
    }

    async function saveInstructions() {
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

            console.log('Saving instructions:', dataToSave);

            const { data, error: saveError } = await supabase
                .from('client_instructions')
                .upsert(dataToSave, {
                    onConflict: 'client_id'
                })
                .select()
                .single();

            if (saveError) {
                console.error('Save error:', saveError);
                throw saveError;
            }

            console.log('Saved successfully:', data);
            if (data) {
                setInstructions(data);
            }

            alert('Instructions saved successfully!');
        } catch (err) {
            console.error('Error saving:', err);
            setError(err instanceof Error ? err.message : 'Failed to save instructions');
        } finally {
            setSaving(false);
        }
    }

    const handleInputChange = (field: keyof ClientInstructions, value: string) => {
        setInstructions(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Show loading state with the spinner
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-lg">Loading instructions for {clientId}...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error && !instructions.business_name) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <h2 className="font-bold mb-2">Error Loading Instructions</h2>
                    <p>{error}</p>
                    <button
                        onClick={loadInstructions}
                        className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Main form
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">
                    Chatbot Instructions
                </h1>
                <p className="text-gray-600">
                    Configure how your chatbot responds to customers for <strong>{clientId}</strong>
                </p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Business Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Name *
                        </label>
                        <input
                            type="text"
                            value={instructions.business_name || ''}
                            onChange={(e) => handleInputChange('business_name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your business name"
                            required
                        />
                    </div>

                    {/* Business Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Business Type
                        </label>
                        <select
                            value={instructions.business_type || ''}
                            onChange={(e) => handleInputChange('business_type', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Select business type...</option>
                            <option value="wellness_spa">Wellness Spa</option>
                            <option value="chiropractor">Chiropractor</option>
                            <option value="physical_therapy">Physical Therapy</option>
                            <option value="massage_therapy">Massage Therapy</option>
                            <option value="acupuncture">Acupuncture</option>
                            <option value="cryotherapy">Cryotherapy Center</option>
                            <option value="meditation">Meditation Studio</option>
                            <option value="yoga">Yoga Studio</option>
                            <option value="functional_medicine">Functional Medicine</option>
                            <option value="other">Other Wellness Business</option>
                        </select>
                    </div>

                    {/* Two Column Layout for Style Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Tone Style */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tone Style
                            </label>
                            <select
                                value={instructions.tone_style || 'friendly'}
                                onChange={(e) => handleInputChange('tone_style', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="friendly">Friendly</option>
                                <option value="professional">Professional</option>
                                <option value="casual">Casual</option>
                                <option value="formal">Formal</option>
                                <option value="warm and calming">Warm & Calming</option>
                                <option value="enthusiastic">Enthusiastic</option>
                            </select>
                        </div>

                        {/* Communication Style */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Communication Style
                            </label>
                            <select
                                value={instructions.communication_style || 'conversational'}
                                onChange={(e) => handleInputChange('communication_style', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="conversational">Conversational</option>
                                <option value="concise">Concise</option>
                                <option value="detailed">Detailed</option>
                                <option value="supportive">Supportive</option>
                                <option value="educational">Educational</option>
                            </select>
                        </div>

                        {/* Formality Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Formality Level
                            </label>
                            <select
                                value={instructions.formality_level || 'professional'}
                                onChange={(e) => handleInputChange('formality_level', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="very formal">Very Formal</option>
                                <option value="professional">Professional</option>
                                <option value="semi-formal">Semi-Formal</option>
                                <option value="casual">Casual</option>
                                <option value="very_casual">Very Casual</option>
                            </select>
                        </div>

                        {/* Response Time */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expected Response Time
                            </label>
                            <select
                                value={instructions.response_time || '2 hours'}
                                onChange={(e) => handleInputChange('response_time', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="15 minutes">15 minutes</option>
                                <option value="30 minutes">30 minutes</option>
                                <option value="1 hour">1 hour</option>
                                <option value="2 hours">2 hours</option>
                                <option value="4 hours">4 hours</option>
                                <option value="same day">Same day</option>
                                <option value="24 hours">24 hours</option>
                            </select>
                        </div>
                    </div>

                    {/* Special Instructions */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Special Instructions
                            <span className="text-sm text-gray-500 ml-2">
                                (Always mention, emphasize, or avoid)
                            </span>
                        </label>
                        <textarea
                            value={instructions.special_instructions || ''}
                            onChange={(e) => handleInputChange('special_instructions', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Example: Always mention our new client discount of 20%. Emphasize our holistic approach to wellness. Never discuss specific medical diagnoses."
                            rows={4}
                        />
                    </div>

                    {/* Formatting Rules */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Response Formatting Rules
                        </label>
                        <textarea
                            value={instructions.formatting_rules || ''}
                            onChange={(e) => handleInputChange('formatting_rules', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Example: Keep initial responses to 2-3 sentences. Use bullet points for service lists. Include emojis sparingly for friendliness."
                            rows={3}
                        />
                    </div>

                    {/* Lead Capture Process */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Lead Capture Process
                        </label>
                        <textarea
                            value={instructions.lead_capture_process || ''}
                            onChange={(e) => handleInputChange('lead_capture_process', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Example: After answering their initial question, ask if they'd like to schedule a consultation. Collect name, email, and phone number. Mention that someone will reach out within 2 hours."
                            rows={3}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t">
                        <button
                            onClick={saveInstructions}
                            disabled={saving || !instructions.business_name}
                            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {saving ? 'Saving...' : 'Save Instructions'}
                        </button>

                        <button
                            onClick={() => router.push(`/dashboard/${clientId}`)}
                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>

                        {instructions.id && (
                            <span className="ml-auto text-sm text-gray-500 self-center">
                                Last updated: {instructions.updated_at ? new Date(instructions.updated_at).toLocaleDateString() : 'Never'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}