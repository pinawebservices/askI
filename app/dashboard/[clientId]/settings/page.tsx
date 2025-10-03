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