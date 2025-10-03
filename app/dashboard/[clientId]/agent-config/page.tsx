
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useRouter, useParams } from 'next/navigation';
import type { Database } from '@/types/supabase';

type ClientInstructions = Database['public']['Tables']['client_instructions']['Row'];

export default function AgentConfigPage() {
    const params = useParams();
    const clientId = params.clientId as string;
    const router = useRouter();

    const supabase = createClient();

    // Use a ref to prevent multiple fetches
    const hasFetchedRef = useRef(false);

    const [instructions, setInstructions] = useState<Partial<ClientInstructions>>({
        client_id: clientId,
        business_name: '',
        business_type: null,
        tone_style: 'friendly',
        communication_style: 'conversational',
        formality_level: 'professional',
        special_instructions: null,
        formatting_rules: null,
        lead_capture_process: null,
        response_time: '2 hours',
        widget_primary_color: '#000000',
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [warningMessage, setWarningMessage] = useState<string | null>(null);

    useEffect(() => {
        // Prevent multiple fetches
        if (hasFetchedRef.current || !clientId) return;
        hasFetchedRef.current = true;

        loadInstructions();
    }, ); // Empty dependency array - only run once

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

            const { data: savedData, error: saveError } = await supabase
                .from('client_instructions')
                .upsert(
                    {
                        client_id: clientId,
                        business_name: instructions.business_name,
                        business_type: instructions.business_type || null,
                        tone_style: instructions.tone_style || null,
                        communication_style: instructions.communication_style || null,
                        formality_level: instructions.formality_level || null,
                        special_instructions: instructions.special_instructions || null,
                        formatting_rules: instructions.formatting_rules || null,
                        lead_capture_process: instructions.lead_capture_process || null,
                        response_time: instructions.response_time || null,
                        widget_primary_color: instructions.widget_primary_color || '#000000'
                    } as any, { onConflict: 'client_id' })
                .select()
                .single();

            if (saveError) {
                console.error('Save error:', saveError);
                throw saveError;
            }

            // Check if Pinecone needs to be configured
            const { data: pineconeClientData, error: pineconeClientError } = await supabase
                .from('clients')
                .select('is_pinecone_configured')
                .eq('client_id', clientId)
                .single() as { data: { is_pinecone_configured: boolean | null } | null, error: any };

            if (pineconeClientError) {
                console.error('Error fetching Pinecone client data:', pineconeClientError);
                throw pineconeClientError;
            }
                console.log('Configuring Pinecone for the first time...');

                // Call the Pinecone setup API
                const response = await fetch('/api/admin/setup-client-pinecone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ clientId,
                        forceUpdate: pineconeClientData?.is_pinecone_configured || false }),
                });

            if (response.ok) {
                const result = await response.json();
                if (result.action === 'created') {
                    setSuccessMessage('Instructions saved and AI agent activated!');
                } else if (result.action === 'updated') {
                    setSuccessMessage('Instructions updated and AI knowledge refreshed!');
                } else {
                    setSuccessMessage('Instructions saved successfully!');
                }
            } else {
                setWarningMessage('Instructions saved, but AI update failed.');
            }


            console.log('Saved successfully:', savedData);
            if (savedData) {
                setInstructions(savedData);
            }

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

    async function retryPineconeSetup() {
        setWarningMessage(null);
        setSuccessMessage(null);

        try {
            const response = await fetch('/api/admin/setup-client-pinecone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ clientId }),
            });

            if (response.ok) {
                setSuccessMessage('AI agent activated successfully!');
            } else {
                setWarningMessage('AI agent setup failed again. Please contact support.');
            }
        } catch (err) {
            setWarningMessage('Failed to activate AI agent. Please try again.');
        }
    }

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
                    AI Agent Configuration
                </h1>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <p className="text-green-800">{successMessage}</p>
                    </div>
                )}

                {/* Warning Message */}
                {warningMessage && (
                    <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-yellow-800">{warningMessage}</p>
                        </div>
                        <button
                            onClick={retryPineconeSetup}
                            className="mt-2 ml-7 text-sm text-yellow-600 underline hover:text-yellow-800"
                        >
                            Retry AI Agent Setup
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-red-800">{error}</p>
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

                    {/* Widget Appearance */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Widget Appearance</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={instructions.widget_primary_color || '#000000'}
                                    onChange={(e) => handleInputChange('widget_primary_color', e.target.value)}
                                    className="h-10 w-20"
                                />
                                <input
                                    type="text"
                                    value={instructions.widget_primary_color || '#000000'}
                                    onChange={(e) => handleInputChange('widget_primary_color', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="#2563EB"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                This color will be used for your chat agent widget.
                            </p>
                        </div>
                    </div>

                    {/* Embed Code - Only shown after first save */}
                    {instructions.id && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Widget Embed Code</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Add this code to your website just before the closing &lt;/body&gt; tag
                            </p>

                            <div className="relative">
            <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-x-auto">
{`<!-- AI Agent Widget -->
<script>
window.aiChatbotConfig = {
    apiUrl: "${window.location.origin}",
    clientId: "${clientId}",
    businessName: "${instructions.business_name}",
    businessType: "${instructions.business_type || ''}",
    theme: {
        primaryColor: "${instructions.widget_primary_color || '#2563EB'}"
    }
};
</script>
<script src="${window.location.origin}/embed.js"></script>`}
            </pre>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(`<!-- AI Agent Widget -->
<script>
window.aiChatbotConfig = {
    apiUrl: "${window.location.origin}",
    clientId: "${clientId}",
    businessName: "${instructions.business_name}",
    businessType: "${instructions.business_type || ''}",
    theme: {
        primaryColor: "${instructions.widget_primary_color || '#2563EB'}"
    }
};
</script>
<script src="${window.location.origin}/embed.js"></script>`);
                                        alert('Embed code copied to clipboard!');
                                    }}
                                    className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    )}

                    {/*/!* Formatting Rules *!/*/}
                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*        Response Formatting Rules*/}
                    {/*    </label>*/}
                    {/*    <textarea*/}
                    {/*        value={instructions.formatting_rules || ''}*/}
                    {/*        onChange={(e) => handleInputChange('formatting_rules', e.target.value)}*/}
                    {/*        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
                    {/*        placeholder="Example: Keep initial responses to 2-3 sentences. Use bullet points for service lists. Include emojis sparingly for friendliness."*/}
                    {/*        rows={3}*/}
                    {/*    />*/}
                    {/*</div>*/}

                    {/*/!* Lead Capture Process *!/*/}
                    {/*<div>*/}
                    {/*    <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                    {/*        Lead Capture Process*/}
                    {/*    </label>*/}
                    {/*    <textarea*/}
                    {/*        value={instructions.lead_capture_process || ''}*/}
                    {/*        onChange={(e) => handleInputChange('lead_capture_process', e.target.value)}*/}
                    {/*        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"*/}
                    {/*        placeholder="Example: After answering their initial question, ask if they'd like to schedule a consultation. Collect name, email, and phone number. Mention that someone will reach out within 2 hours."*/}
                    {/*        rows={3}*/}
                    {/*    />*/}
                    {/*</div>*/}

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