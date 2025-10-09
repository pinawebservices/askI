// app/dashboard/[clientId]/services/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface ClientService {
    id?: string;
    client_id: string;
    service_name: string;
    service_description?: string | null;
    pricing?: string | null;
    pricing_type?: 'fixed' | 'hourly' | 'range' | 'custom' | null;
    price_amount?: number | null;
    duration?: string | null;
    category?: string | null;
    service_faqs?: string | null;
    is_active?: boolean;
    display_order?: number;
}

export default function ServicesPage() {
    const params = useParams();
    const clientId = params.clientId as string;
    const router = useRouter();

    const [services, setServices] = useState<ClientService[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingService, setEditingService] = useState<ClientService | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<ClientService>>({
        service_name: '',
        service_description: '',
        pricing: '',
        pricing_type: 'fixed',
        duration: '',
        category: '',
        service_faqs: '',
        is_active: true
    });

    useEffect(() => {
        loadServices();
    }, [clientId]);

    async function loadServices() {
        try {
            const response = await fetch(`/api/services/${clientId}`);
            if (!response.ok) throw new Error('Failed to fetch services');

            const data = await response.json();
            setServices(data.services || []);
        } catch (err) {
            console.error('Error loading services:', err);
            setError('Failed to load services');
        } finally {
            setLoading(false);
        }
    }

    async function saveService() {
        try {
            setSaving(true);
            setError(null);

            if (!formData.service_name) {
                setError('Service name is required');
                return;
            }

            const method = editingService?.id ? 'PUT' : 'POST';
            const body = editingService?.id
                ? { ...formData, id: editingService.id }
                : formData;

            const response = await fetch(`/api/services/${clientId}`, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error('Failed to save service');

            setSuccessMessage(editingService ? 'Service updated successfully' : 'Service added successfully');
            resetForm();
            await loadServices();

        } catch (err) {
            console.error('Error saving service:', err);
            setError('Failed to save service');
        } finally {
            setSaving(false);
        }
    }

    async function deleteService(id: string) {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            const response = await fetch(`/api/services/${clientId}?id=${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete service');

            setSuccessMessage('Service deleted successfully');
            await loadServices();
        } catch (err) {
            console.error('Error deleting service:', err);
            setError('Failed to delete service');
        }
    }

    function editService(service: ClientService) {
        setEditingService(service);
        setFormData(service);
        setIsAddingNew(false);
    }

    function resetForm() {
        setFormData({
            service_name: '',
            service_description: '',
            pricing: '',
            pricing_type: 'fixed',
            duration: '',
            category: '',
            service_faqs: '',
            is_active: true
        });
        setEditingService(null);
        setIsAddingNew(false);
    }

    // Group services by category
    const servicesByCategory = services.reduce((acc, service) => {
        const category = service.category || 'Uncategorized';
        if (!acc[category]) acc[category] = [];
        acc[category].push(service);
        return acc;
    }, {} as Record<string, ClientService[]>);

    if (loading) return <div className="p-8">Loading services...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">

                <h1 className="text-2xl font-bold">Services & Pricing</h1>
                <p className="text-gray-600 mt-2">
                    Configure your services and pricing. This information will be used by the AI agent to answer customer questions accurately.
                </p>
            </div>

            {/* Messages */}
            {successMessage && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    {successMessage}
                    <button
                        onClick={() => setSuccessMessage(null)}
                        className="float-right text-green-800 hover:text-green-900"
                    >
                        ✕
                    </button>
                </div>
            )}

            {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {error}
                    <button
                        onClick={() => setError(null)}
                        className="float-right text-red-800 hover:text-red-900"
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Add New Button */}
            {!isAddingNew && !editingService && (
                <div className="mb-6">
                    <button
                        onClick={() => setIsAddingNew(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        + Add New Service
                    </button>
                </div>
            )}

            {/* Service Form */}
            {(isAddingNew || editingService) && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingService ? 'Edit Service' : 'Add New Service'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Form fields */}
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Service Name *
                            </label>
                            <input
                                type="text"
                                value={formData.service_name || ''}
                                onChange={(e) => setFormData({...formData, service_name: e.target.value})}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Estate Planning Consultation"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Category
                            </label>
                            <input
                                type="text"
                                value={formData.category || ''}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., Legal Services"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Pricing
                            </label>
                            <input
                                type="text"
                                value={formData.pricing || ''}
                                onChange={(e) => setFormData({...formData, pricing: e.target.value})}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., $250/hour or Starting at $500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Duration
                            </label>
                            <input
                                type="text"
                                value={formData.duration || ''}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., 1 hour"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Service Description
                            </label>
                            <textarea
                                value={formData.service_description || ''}
                                onChange={(e) => setFormData({...formData, service_description: e.target.value})}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Describe what this service includes..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-1">
                                Service FAQs
                            </label>
                            <label className="block text-sm font-normal mb-1">
                                Add frequently asked questions specific to this service. Each Q&A pair should be on separate lines.
                            </label>
                            <textarea
                                value={formData.service_faqs || ''}
                                onChange={(e) => setFormData({...formData, service_faqs: e.target.value})}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={12}
                                placeholder={`Question: What should I prepare beforehand?
Answer: You should prepare...

Question: Can this service be done remotely or is in-person required?
Answer: We offer both options. Remote consultations are conducted via secure video conferencing...

Question: Are there any health conditions that would prevent me from receiving this treatment?
Answer: Please inform us if you're pregnant, have high blood pressure, skin conditions, or recent surgeries. We'll adjust the treatment or recommend alternatives...`}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                        <button
                            onClick={saveService}
                            disabled={saving || !formData.service_name}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Service'}
                        </button>
                        <button
                            onClick={resetForm}
                            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Services List */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Current Services</h2>

                {services.length === 0 ? (
                    <p className="text-gray-500">No services configured yet. Add your first service above!</p>
                ) : (
                    Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                        <div key={category} className="mb-6">
                            <h3 className="text-lg font-medium text-gray-700 mb-3 border-b pb-2">
                                {category}
                            </h3>
                            <div className="space-y-3">
                                {categoryServices.map(service => (
                                    <div key={service.id} className="border rounded p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <h4 className="font-medium text-lg">
                                                    {service.service_name}
                                                </h4>
                                                <div className="mt-2 space-y-1">
                                                    {service.pricing && (
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Price:</span> {service.pricing}
                                                        </p>
                                                    )}
                                                    {service.duration && (
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">Duration:</span> {service.duration}
                                                        </p>
                                                    )}
                                                    {service.service_description && (
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            {service.service_description}
                                                        </p>
                                                    )}
                                                    {service.service_faqs && (
                                                        <div className="mt-2 text-xs text-gray-500">
                                                            <span className="font-medium">Has FAQs</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex gap-2 ml-4">
                                                <button
                                                    onClick={() => editService(service)}
                                                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteService(service.id!)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}