
'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase-client';
import { useRouter, useParams } from 'next/navigation';
import type { Database } from '@/types/supabase';
import {Json} from "@/types/supabase";

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
        widget_settings: null,
        business_hours: null,
        contact_phone: null,
        contact_email: null,
        contact_address: null,
        emergency_contact: null,
        general_faqs: null,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [warningMessage, setWarningMessage] = useState<string | null>(null);

    // Allowed domains state
    const [allowedDomains, setAllowedDomains] = useState<string[]>(['']);

    useEffect(() => {
        // Prevent multiple fetches
        if (hasFetchedRef.current || !clientId) return;
        hasFetchedRef.current = true;

        loadInstructions();
    }, ); // Empty dependency array - only run once

    const handleInputChange = (field: string, value: any) => {
        setInstructions(prev => {
            if (!prev) return prev;

            // Handle widget_settings specially to ensure valid Json
            if (field === 'widget_settings') {
                const validValue = value ?? {};
                return {
                    ...prev,
                    widget_settings: validValue as Json
                };
            }

            // Handle widget_settings nested fields
            if (field.startsWith('widget_settings.')) {
                const subField = field.replace('widget_settings.', '');
                const currentSettings = prev.widget_settings
                    ? (prev.widget_settings as any)
                    : {};

                return {
                    ...prev,
                    widget_settings: {
                        ...currentSettings,
                        [subField]: value
                    } as Json
                };
            }

            // Handle direct fields
            return {
                ...prev,
                [field]: value
            };
        });
    };

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

            // Load allowed domains from clients table
            const { data: clientData, error: clientError } = await supabase
                .from('clients')
                .select('allowed_domains')
                .eq('client_id', clientId)
                .single();

            if (clientError) {
                console.error('Error fetching allowed domains:', clientError);
            } else if (clientData) {
                const domains = clientData.allowed_domains || [];
                setAllowedDomains(domains.length > 0 ? domains : ['']);
            }
        } catch (err) {
            console.error('Unexpected error:', err);
            setError(err instanceof Error ? err.message : 'Failed to load instructions');
        } finally {
            setLoading(false);
        }
    }

    async function saveInstructions() {
        if (!instructions.business_name) {
            setError('Business name is required');
            return;
        }

        setSaving(true);
        setError(null);

        try {

            // Clean up the data to save, ensure widget_settings has defaults
            const updateData: any = {
                ...instructions,
                client_id: clientId,
                widget_settings: instructions.widget_settings || {
                    primaryColor: '#000000',
                    welcomeMessage: ''
                },
                updated_at: new Date().toISOString()
            };

            const { data: savedData, error: saveError } = await supabase
                .from('client_instructions')
                .upsert(updateData)
                .eq('client_id', clientId)
                .select()
                .single();

            if (saveError) {
                console.error('Save error:', saveError);
                throw saveError;
            }

            // Save allowed domains to clients table (filter out empty strings)
            const validDomains = allowedDomains.filter(d => d.trim() !== '');
            const { error: domainsError } = await supabase
                .from('clients')
                .update({ allowed_domains: validDomains })
                .eq('client_id', clientId);

            if (domainsError) {
                console.error('Error saving domains:', domainsError);
                // Don't throw - this is non-critical
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
                const requestBody = {
                    clientId,
                    forceUpdate: true,
                    updateType: 'agent-config'
                };
                console.log('Request body being sent:', requestBody);

                const response = await fetch('/api/admin/setup-client-pinecone', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
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

    // Domain management functions
    const addDomainField = () => {
        if (allowedDomains.length < 3) {
            setAllowedDomains([...allowedDomains, '']);
        }
    };

    const removeDomainField = (index: number) => {
        const newDomains = allowedDomains.filter((_, i) => i !== index);
        setAllowedDomains(newDomains.length > 0 ? newDomains : ['']);
    };

    const updateDomain = (index: number, value: string) => {
        const newDomains = [...allowedDomains];
        newDomains[index] = value;
        setAllowedDomains(newDomains);
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
                    {/* Business Information Section */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Business Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                            {/* Business Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Name * (as you want the agent to refer to it)
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

                                    <optgroup label="Legal & Financial">
                                        <option value="law_firm">Law Firm</option>
                                        <option value="accounting_firm">Accounting Firm</option>
                                        <option value="tax_preparation">Tax Preparation Service</option>
                                        <option value="financial_advisor">Financial Advisory</option>
                                        <option value="insurance_agency">Insurance Agency</option>
                                    </optgroup>

                                    <optgroup label="Medical & Healthcare">
                                        <option value="medical_practice">Medical Practice</option>
                                        <option value="dental_practice">Dental Practice</option>
                                        <option value="optometry">Optometry Clinic</option>
                                        <option value="veterinary">Veterinary Clinic</option>
                                        <option value="mental_health">Mental Health Practice</option>
                                        <option value="physical_therapy">Physical Therapy</option>
                                        <option value="chiropractic">Chiropractic Clinic</option>
                                    </optgroup>

                                    <optgroup label="Real Estate & Property">
                                        <option value="real_estate">Real Estate Agency</option>
                                        <option value="property_management">Property Management</option>
                                        <option value="mortgage_broker">Mortgage Broker</option>
                                    </optgroup>

                                    <optgroup label="Home Services">
                                        <option value="hvac">HVAC Services</option>
                                        <option value="plumbing">Plumbing Services</option>
                                        <option value="electrical">Electrical Services</option>
                                        <option value="roofing">Roofing Contractor</option>
                                        <option value="general_contractor">General Contractor</option>
                                        <option value="cleaning_service">Cleaning Service</option>
                                    </optgroup>

                                    <optgroup label="Beauty & Wellness">
                                        <option value="beauty_salon">Beauty Salon</option>
                                        <option value="barbershop">Barbershop</option>
                                        <option value="spa">Spa & Wellness Center</option>
                                        <option value="fitness_center">Fitness Center/Gym</option>
                                    </optgroup>

                                    <optgroup label="Automotive">
                                        <option value="auto_repair">Auto Repair Shop</option>
                                        <option value="auto_dealership">Auto Dealership</option>
                                        <option value="auto_detailing">Auto Detailing</option>
                                    </optgroup>

                                    <optgroup label="Education & Consulting">
                                        <option value="tutoring">Tutoring Service</option>
                                        <option value="consulting">Business Consulting</option>
                                        <option value="marketing_agency">Marketing Agency</option>
                                    </optgroup>

                                    <option value="other">Other Professional Service</option>
                                </select>
                            </div>

                            {/* Business Hours */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Hours
                                </label>
                                <textarea
                                    value={instructions.business_hours || ''}
                                    onChange={(e) => handleInputChange('business_hours', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Example:
Regular Hours:
Monday-Friday: 9:00 AM - 6:00 PM
Saturday: 10:00 AM - 4:00 PM
Sunday: Closed

Holidays:
Closed: New Year's Day, Memorial Day, July 4th, Labor Day, Thanksgiving, Christmas
Modified Hours: Christmas Eve (9 AM - 1 PM), New Year's Eve (9 AM - 3 PM)
Open Regular Hours: Martin Luther King Jr. Day, Presidents' Day, Columbus Day, Veterans Day

Note: Emergency services available 24/7 at (555) 999-1234`}
                                    rows={12}
                                />
                            </div>

                            {/* Contact Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Primary Contact Phone Number <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                                </label>
                                <label className="block text-sm font-normal text-gray-700 mb-1">
                                    This number will be provided if the prospect requests it.
                                </label>
                                <input
                                    type="tel"
                                    value={instructions.contact_phone || ''}
                                    onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="(555) 123-4567"
                                />
                            </div>

                            {/* Contact Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Primary Contact Email Address <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                                </label>
                                <label className="block text-sm font-normal text-gray-700 mb-1">
                                    This email will be provided if the prospect requests it.
                                </label>
                                <input
                                    type="email"
                                    value={instructions.contact_email || ''}
                                    onChange={(e) => handleInputChange('contact_email', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="support@business.com"
                                />
                            </div>

                            {/* Business Address */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Business Address <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                                </label>
                                <textarea
                                    value={instructions.contact_address || ''}
                                    onChange={(e) => handleInputChange('contact_address', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="123 Main Street, Suite 100
Palm Beach Gardens, FL 33410"
                                    rows={2}
                                />
                            </div>

                            {/* Emergency/After-Hours Contact */}
                            <div className="md:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Emergency/After-Hours Contact
                                    <span className="text-xs text-gray-500 ml-2">(Optional)</span>
                                </label>
                                <input
                                    type="text"
                                    value={instructions.emergency_contact || ''}
                                    onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Call (555) 999-1234 or email emergency@business.com`}
                                />
                            </div>

                            <label className="block text-sm font-normal text-gray-700 mb-1 md:col-span-2">
                                <span><b>Note:</b> </span> If no contact information is provided the agent will capture the lead and let the user know someone will get back to them.
                            </label>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Communication Style
                        </h3>

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
                    </div>

                    {/* Add General FAQs Section - Place this after Special Instructions or wherever you prefer */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-4 text-gray-800">
                            Business Context
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Business FAQs
                                <span className="text-xm text-gray-500 ml-2">(General questions about your business)</span>
                            </label>
                            <label className="block text-sm font-normal text-gray-700 mb-1">
                                These FAQs will help the agent answer common questions about your business. Each Q&A pair should be on separate lines.
                            </label>
                            <textarea
                                value={instructions.general_faqs || ''}
                                onChange={(e) => handleInputChange('general_faqs', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font text-xm"
                                placeholder={`Question: What are your business hours?
Answer: We're open Monday through Friday from 9 AM to 6 PM, and Saturday from 10 AM to 4 PM. We're closed on Sundays and major holidays.

Question: What areas do you serve?
Answer: We serve the entire Palm Beach County area, including West Palm Beach, Boca Raton, and Jupiter. Virtual consultations are available statewide.

Question: What forms of payment do you accept?
Answer: We accept cash, check, and all major credit cards. Payment plans are available for qualifying services.`}
                                rows={12}
                            />
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
                    </div>

                    {/* Widget Appearance */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Widget Appearance</h2>

                        <div className="space-y-4">
                            {/* Primary Color */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Primary Color
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="color"
                                        value={(instructions.widget_settings as any)?.primaryColor || '#000000'}
                                        onChange={(e) => handleInputChange('widget_settings.primaryColor', e.target.value)}
                                        className="h-10 w-20"
                                    />
                                    <input
                                        type="text"
                                        value={(instructions.widget_settings as any)?.primaryColor || '#000000'}
                                        onChange={(e) => handleInputChange('widget_settings.primaryColor', e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="#2563EB"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    This color will be used for your chat agent widget header and buttons.
                                </p>
                            </div>

                            {/* Welcome Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Welcome Message
                                </label>
                                <textarea
                                    value={(instructions.widget_settings as any)?.welcomeMessage || ''}
                                    onChange={(e) => handleInputChange('widget_settings.welcomeMessage', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Hi! Welcome to ${instructions.business_name || '[Your Business]'}. How can I help you today?`}
                                    rows={3}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    The greeting message that appears when customers open the chat widget. Leave empty to use default.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Allowed Domains */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold mb-4">Allowed Domains</h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Specify which websites can use your AI widget. Only requests from these domains will be accepted.
                        </p>

                        <div className="space-y-3">
                            {allowedDomains.map((domain, index) => (
                                <div key={index} className="flex gap-2 items-center">
                                    <input
                                        type="text"
                                        value={domain}
                                        onChange={(e) => updateDomain(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="https://example.com"
                                    />
                                    {allowedDomains.length > 1 && (
                                        <button
                                            onClick={() => removeDomainField(index)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Remove domain"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}
                                    {index === allowedDomains.length - 1 && allowedDomains.length < 3 && (
                                        <button
                                            onClick={addDomainField}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Add another domain"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-xs text-yellow-800">
                                <strong>Note:</strong> Enter full URLs including https:// (e.g., https://www.example.com). You can add up to 3 domains.
                            </p>
                        </div>
                    </div>

                    {/* Embed Code - Only shown after first save */}
                    {instructions.id && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-lg font-semibold mb-4">Install Your AI Assistant</h2>
                            <p className="text-sm text-gray-600 mb-4">
                                Copy and paste this code into your website&apos;s HTML, just before the closing &lt;/body&gt; tag:
                            </p>

                            <div className="relative">
            <pre className="border border-gray-300 bg-gray-200 p-4 rounded-lg overflow-x-auto text-sm">
                <code>{`<script src="${window.location.origin}/embed.js" data-client="${clientId}"></script>`}</code>
            </pre>

                                <button
                                    onClick={() => {
                                        const embedCode = `<script src="${window.location.origin}/embed.js" data-client="${clientId}"></script>`;
                                        navigator.clipboard.writeText(embedCode);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    className="absolute top-2 right-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                                >
                                    {copied ? '✓ Copied!' : 'Copy'}
                                </button>
                            </div>

                            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-900">
                                    <strong>That&apos;s it!</strong> The AI assistant will automatically appear on your website and configure itself. No additional setup required.
                                </p>
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

                    {/* Support Contact Message */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-sm text-blue-900">
                                    <strong>Need Help?</strong> To get in contact with our support team, please send an email to{' '}
                                    <a href="mailto:support@aiwidgetwise.com" className="underline hover:text-blue-700">
                                        support@aiwidgetwise.com
                                    </a>
                                    {' '}and someone will contact you back as soon as possible.
                                </p>
                            </div>
                        </div>
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

                        {/*{instructions.id && (*/}
                        {/*    <span className="ml-auto text-sm text-gray-500 self-center">*/}
                        {/*        Last updated: {instructions.updated_at ? new Date(instructions.updated_at).toLocaleDateString() : 'Never'}*/}
                        {/*    </span>*/}
                        {/*)}*/}
                    </div>
                </div>
            </div>
        </div>
    );
}