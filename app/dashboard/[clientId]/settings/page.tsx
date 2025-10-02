// app/dashboard/[clientId]/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSubscription } from '@/app/contexts/subscription-context';
import { createClient } from '@/lib/supabase-client';

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
    webhook_url?: string | null;
    notification_email?: string | null;
    notification_phone?: string | null;
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
    const [showApiKey, setShowApiKey] = useState(false);
    const [regeneratingKey, setRegeneratingKey] = useState(false);

    // Resolve the promise for params
    useEffect(() => {
        params.then(p => setClientId(p.clientId));
    }, [params]);

    // Load settings when clientId is available
    useEffect(() => {
        if (clientId) {
            loadSettings();
        }
    }, [clientId]);

    const loadSettings = async () => {
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
    };

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

            if (field.startsWith('widget_settings.')) {
                const subField = field.replace('widget_settings.', '');
                return {
                    ...prev,
                    widget_settings: {
                        ...prev.widget_settings,
                        [subField]: value
                    }
                };
            }

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

    // const regenerateApiKey = async () => {
    //     setRegeneratingKey(true);
    //     try {
    //         // Generate new API key
    //         const newApiKey = `sk-${Math.random().toString(36).substring(2)}${Date.now().toString(36)}`;
    //
    //         const { error } = await supabase
    //             .from('clients')
    //             .update({ api_key: newApiKey })
    //             .eq('client_id', clientId);
    //
    //         if (error) throw error;
    //
    //         setSettings(prev => prev ? { ...prev, api_key: newApiKey } : null);
    //         alert('API key regenerated successfully!');
    //     } catch (error) {
    //         console.error('Error regenerating API key:', error);
    //         alert('Failed to regenerate API key.');
    //     } finally {
    //         setRegeneratingKey(false);
    //     }
    // };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        alert(`${label} copied to clipboard!`);
    };

    const openStripePortal = async () => {
        try {
            const response = await fetch('/api/stripe/portal', {
                method: 'POST',
            });
            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error opening billing portal:', error);
            alert('Failed to open billing portal.');
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
                <p className="text-gray-600 mt-1">Configure your chatbot and account settings</p>
            </div>

            <div className="grid gap-6">
                {/* Widget Configuration */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Widget Configuration</h2>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Primary Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={settings?.widget_settings?.primaryColor || '#2563EB'}
                                    onChange={(e) => handleSettingChange('widget_settings.primaryColor', e.target.value)}
                                    className="h-10 w-20"
                                />
                                <input
                                    type="text"
                                    value={settings?.widget_settings?.primaryColor || '#2563EB'}
                                    onChange={(e) => handleSettingChange('widget_settings.primaryColor', e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Widget Position
                            </label>
                            <select
                                value={settings?.widget_settings?.position || 'bottom-right'}
                                onChange={(e) => handleSettingChange('widget_settings.position', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            >
                                <option value="bottom-right">Bottom Right</option>
                                <option value="bottom-left">Bottom Left</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={settings?.widget_settings?.autoOpen || false}
                                    onChange={(e) => handleSettingChange('widget_settings.autoOpen', e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm font-medium text-gray-700">
                                    Auto-open widget on page load
                                </span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Embed Code */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Widget Embed Code</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Copy this code and paste it before the closing &lt;/body&gt; tag on your website.
                    </p>
                    <div className="relative">
                        <pre className="bg-gray-100 p-4 rounded-md text-xs overflow-x-auto">
                            {embedCode}
                        </pre>
                        <button
                            onClick={() => copyToClipboard(embedCode, 'Embed code')}
                            className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                        >
                            Copy
                        </button>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Notification Settings</h2>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notification Email
                            </label>
                            <input
                                type="email"
                                value={settings?.notification_email || ''}
                                onChange={(e) => handleSettingChange('notification_email', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="admin@example.com"
                            />
                        </div>

                        {(planType as string) !== 'basic' && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notification Phone {planType === 'basic' && '(Pro+ Required)'}
                                    </label>
                                    <input
                                        type="tel"
                                        value={settings?.notification_phone || ''}
                                        onChange={(e) => handleSettingChange('notification_phone', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                        placeholder="+1 (555) 123-4567"
                                        disabled={planType === 'basic'}
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={settings?.enable_sms_notifications || false}
                                            onChange={(e) => handleSettingChange('enable_sms_notifications', e.target.checked)}
                                            className="mr-2"
                                            disabled={planType === 'basic'}
                                        />
                                        <span className="text-sm font-medium text-gray-700">
                                            Enable SMS notifications {planType === 'basic' && '(Pro+ Required)'}
                                        </span>
                                    </label>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* API Configuration */}
                {/*<div className="bg-white rounded-lg shadow p-6">*/}
                {/*    <h2 className="text-lg font-semibold mb-4">API Configuration</h2>*/}

                {/*    <div className="grid gap-4">*/}
                {/*        <div>*/}
                {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                {/*                API Key*/}
                {/*            </label>*/}
                {/*            <div className="flex gap-2">*/}
                {/*                <input*/}
                {/*                    type={showApiKey ? 'text' : 'password'}*/}
                {/*                    value={settings?.api_key || 'No API key generated'}*/}
                {/*                    readOnly*/}
                {/*                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"*/}
                {/*                />*/}
                {/*                <button*/}
                {/*                    onClick={() => setShowApiKey(!showApiKey)}*/}
                {/*                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"*/}
                {/*                >*/}
                {/*                    {showApiKey ? 'Hide' : 'Show'}*/}
                {/*                </button>*/}
                {/*                <button*/}
                {/*                    onClick={regenerateApiKey}*/}
                {/*                    disabled={regeneratingKey}*/}
                {/*                    className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50"*/}
                {/*                >*/}
                {/*                    {regeneratingKey ? 'Regenerating...' : 'Regenerate'}*/}
                {/*                </button>*/}
                {/*            </div>*/}
                {/*        </div>*/}

                {/*        <div>*/}
                {/*            <label className="block text-sm font-medium text-gray-700 mb-2">*/}
                {/*                Webhook URL (Optional)*/}
                {/*            </label>*/}
                {/*            <input*/}
                {/*                type="url"*/}
                {/*                value={settings?.webhook_url || ''}*/}
                {/*                onChange={(e) => handleSettingChange('webhook_url', e.target.value)}*/}
                {/*                className="w-full px-3 py-2 border border-gray-300 rounded-md"*/}
                {/*                placeholder="https://your-server.com/webhook"*/}
                {/*            />*/}
                {/*            <p className="text-xs text-gray-500 mt-1">*/}
                {/*                Receive POST requests when new leads are captured*/}
                {/*            </p>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/* Billing Settings */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Billing & Subscription</h2>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-600">
                                Current Plan: <span className="font-semibold capitalize">{planType || 'None'}</span>
                            </p>
                            <p className="text-sm text-gray-600">
                                Status: <span className="font-semibold">{isActive ? '✅ Active' : '❌ Inactive'}</span>
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={openStripePortal}
                                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                Manage Billing
                            </button>
                            <button
                                onClick={() => router.push(`/dashboard/${clientId}/subscription`)}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Change Plan
                            </button>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                    <button
                        // onClick={saveSettings}
                        disabled={saving}
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