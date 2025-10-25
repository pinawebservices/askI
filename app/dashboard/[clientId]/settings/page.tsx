// app/dashboard/[clientId]/settings/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/app/contexts/subscription-context';
import { createClient } from '@/lib/supabase-client';
import {Json} from "@/types/supabase";

interface SettingsPageProps {
    params: Promise<{
        clientId: string;
    }>;
}

interface ClientSettings {
    client_id: string;
    organization_id: string | null;
    widget_settings?: {
        primaryColor?: string;
        position?: 'bottom-right' | 'bottom-left';
        autoOpen?: boolean;
        welcomeMessage?: string;
    };
    api_key?: string | null;
    notification_email?: string | null;
    notification_phone?: string | null;
    notification_preferences: Json| null;
    enable_sms_notifications?: boolean | null;
}

export default function SettingsPage({ params }: SettingsPageProps) {
    const router = useRouter();
    const supabase = createClient();
    const { planType, isActive } = useSubscription();

    const [clientId, setClientId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<ClientSettings | null>(null);
    const [embedCode, setEmbedCode] = useState('');
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Resolve the promise for params
    useEffect(() => {
        params.then(p => setClientId(p.clientId));
    }, [params]);

    const loadSettings = useCallback(async () => {
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .eq('client_id', clientId)
                .single();

            if (error) throw error;

            // Transform data to match interface
            const transformedData: ClientSettings = {
                ...data,
                organization_id: data.organization_id || '', // Provide default value
            };

            setSettings(transformedData);

            generateEmbedCode(data);
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    }, [clientId, supabase]);

    // Load settings when clientId is available
    useEffect(() => {
        if (clientId) {
            loadSettings();
        }
    }, [clientId, loadSettings]);

    const generateEmbedCode = (clientData: any) => {
        const baseUrl = window.location.origin;
        const code = `<!-- AI Chatbot Widget -->
<script>
  window.aiChatbotConfig = {
    apiUrl: '${baseUrl}',
    clientId: '${clientData.client_id}',
    theme: {
      primaryColor: '${clientData.widget_settings?.primaryColor || '#2563EB'}',
      position: '${clientData.widget_settings?.position || 'bottom-right'}'
    }
  };
</script>
<script src="${baseUrl}/embed.js"></script>`;
        setEmbedCode(code);
    };

    const handleSettingChange = (field: string, value: any) => {
        setSettings(prev => {
            if (!prev) return null;

            // Handle notification_preferences specially to ensure valid Json
            if (field === 'notification_preferences') {
                // Ensure value is never undefined, use empty object as fallback
                const validValue = value ?? {};
                return {
                    ...prev,
                    notification_preferences: validValue as Json
                };
            }

            // Handle notification_preferences nested fields
            if (field.startsWith('notification_preferences.')) {
                const subField = field.replace('notification_preferences.', '');
                const currentPrefs = prev.notification_preferences
                    ? (prev.notification_preferences as any)
                    : {};

                return {
                    ...prev,
                    notification_preferences: {
                        ...currentPrefs,
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

    // const saveSettings = async () => {
    //     if (!settings) return;
    //
    //     setSaving(true);
    //     try {
    //         const { error } = await supabase
    //             .from('clients')
    //             .update({
    //                 widget_settings: settings.widget_settings,
    //                 webhook_url: settings.webhook_url,
    //                 notification_email: settings.notification_email,
    //                 notification_phone: settings.notification_phone,
    //                 enable_sms_notifications: settings.enable_sms_notifications
    //             })
    //             .eq('client_id', clientId);
    //
    //         if (error) throw error;
    //
    //         alert('Settings saved successfully!');
    //         generateEmbedCode(settings);
    //     } catch (error) {
    //         console.error('Error saving settings:', error);
    //         alert('Failed to save settings. Please try again.');
    //     } finally {
    //         setSaving(false);
    //     }
    // };

    const saveSettings = async () => {
        if (!settings) return;

        setSaving(true);
        setSuccessMessage(null);
        setErrorMessage(null);

        try {
            const updateData: any = {
                notification_email: settings.notification_email,
                notification_phone: settings.notification_phone,
                notification_preferences: settings.notification_preferences
            };

            const { error } = await supabase
                .from('clients')
                .update(updateData)
                .eq('client_id', clientId);

            if (error) throw error;

            // Show success message
            setSuccessMessage('Notification settings saved successfully!');

            // Regenerate embed code with new settings
            generateEmbedCode(settings);
        } catch (error) {
            console.error('Error saving settings:', error);
            setErrorMessage('Failed to save settings. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-800">{successMessage}</p>
                </div>
            )}

            {/* Error Message */}
            {errorMessage && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                    <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-red-800">{errorMessage}</p>
                </div>
            )}

            <div className="grid gap-6">

                {/* Notifications */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Notifications</h2>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Notifications
                            </label>
                            <input
                                type="email"
                                value={settings?.notification_email || ''}
                                onChange={(e) => handleSettingChange('notification_email', e.target.value)}
                                placeholder="notifications@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Email address where new lead notifications will be sent (leave empty to use account email)
                            </p>

                            {/* Email deliverability tip */}
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <div className="text-xs text-blue-800">
                                        <p className="font-medium mb-1">To ensure reliable delivery:</p>
                                        <p>Add <span className="font-mono bg-blue-100 px-1 rounded">notifications@notifications.aiwidgetwise.com</span> to your email contacts or safe sender list to prevent notifications from going to spam.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Show current notification status */}
                        {settings?.notification_email && (
                            <div className={`p-3 rounded-md ${
                                (settings.notification_preferences as any)?.email_enabled !== false
                                    ? 'bg-green-50'
                                    : 'bg-gray-50'
                            }`}>
                                <p className={`text-sm ${
                                    (settings.notification_preferences as any)?.email_enabled !== false
                                        ? 'text-green-800'
                                        : 'text-gray-600'
                                }`}>
                                    {(settings.notification_preferences as any)?.email_enabled !== false ? (
                                        <>✓ Email notifications active - Sending to: {settings.notification_email}</>
                                    ) : (
                                        <>⏸ Email notifications paused - Email saved: {settings.notification_email}</>
                                    )}
                                </p>
                            </div>
                        )}

                        {/* SMS Notifications - Coming Soon */}
                        <div className="opacity-50">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                SMS Notifications (Coming Soon - Pro Tier)
                            </label>
                            <input
                                type="tel"
                                value={settings?.notification_phone || ''}
                                onChange={(e) => handleSettingChange('notification_phone', e.target.value)}
                                placeholder="+1 (555) 123-4567"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-not-allowed"
                                disabled
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                SMS notifications will be available in the Pro tier
                            </p>
                        </div>

                        {/* Additional Preferences (if needed) */}
                        <div className="border-t pt-4">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                Notification Preferences
                            </h3>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={
                                        settings?.notification_preferences
                                            ? (settings.notification_preferences as any).email_enabled !== false
                                            : true  // default checked
                                    }
                                    onChange={(e) => {
                                        const current = settings?.notification_preferences as any || {};
                                        setSettings(prev => {
                                            if (!prev) return null;
                                            return {
                                                ...prev,
                                                notification_preferences: {
                                                    ...current,
                                                    email_enabled: e.target.checked
                                                }
                                            };
                                        });
                                    }}
                                    className="rounded border-gray-300"
                                />
                                <span className="text-sm text-gray-600">
                    Enable email notifications for new leads
                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        onClick={saveSettings}
                        disabled={saving || !settings}
                        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                    <button
                        onClick={() => router.push(`/dashboard/${clientId}`)}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}