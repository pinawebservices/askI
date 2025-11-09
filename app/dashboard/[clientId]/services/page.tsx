// app/dashboard/[clientId]/services/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AutoExpandTextarea } from '@/app/dashboard/components/auto-expand-textarea';

// Predefined dental service categories
const PREDEFINED_CATEGORIES = [
    'General Dentistry',
    'Cosmetic Dentistry',
    'Orthodontics',
    'Oral Surgery',
    'Pediatric Dentistry',
    'Periodontics',
    'Endodontics',
    'Prosthodontics',
];

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

    // Service FAQs state
    const [serviceFaqs, setServiceFaqs] = useState<Array<{ question: string; answer: string }>>([
        { question: '', answer: '' }
    ]);

    // Category selection state
    const [isOtherCategory, setIsOtherCategory] = useState(false);

    // Track expanded service descriptions
    const [expandedDescriptions, setExpandedDescriptions] = useState<Set<string>>(new Set());

    const toggleDescription = (serviceId: string) => {
        const newExpanded = new Set(expandedDescriptions);
        if (newExpanded.has(serviceId)) {
            newExpanded.delete(serviceId);
        } else {
            newExpanded.add(serviceId);
        }
        setExpandedDescriptions(newExpanded);
    };

    // Get all available categories (predefined + custom from existing services)
    const getAvailableCategories = (): string[] => {
        // Extract custom categories from existing services
        const customCategories = services
            .map(s => s.category)
            .filter((cat): cat is string => !!cat && !PREDEFINED_CATEGORIES.includes(cat))
            .filter((cat, index, self) => self.indexOf(cat) === index); // unique

        return [...PREDEFINED_CATEGORIES, ...customCategories];
    };

    const loadServices = useCallback(async () => {
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
    }, [clientId]);

    useEffect(() => {
        loadServices();
    }, [loadServices]);

    async function saveService() {
        try {
            setSaving(true);
            setError(null);

            if (!formData.service_name) {
                setError('Service name is required');
                return;
            }

            // Format FAQs array back to text for database storage
            const formattedFaqText = formatFaqsToText(serviceFaqs);

            const method = editingService?.id ? 'PUT' : 'POST';
            const body = editingService?.id
                ? { ...formData, service_faqs: formattedFaqText || null, id: editingService.id }
                : { ...formData, service_faqs: formattedFaqText || null };

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

    // FAQ management functions
    const parseFaqText = (faqText: string): Array<{ question: string; answer: string }> => {
        if (!faqText) return [{ question: '', answer: '' }];

        const faqs: Array<{ question: string; answer: string }> = [];
        const lines = faqText.split('\n');
        let currentQuestion = '';
        let currentAnswer = '';

        for (const line of lines) {
            const trimmedLine = line.trim();
            const lowerLine = trimmedLine.toLowerCase();

            if (lowerLine.startsWith('question:') || lowerLine.startsWith('q:')) {
                // Save previous FAQ if exists
                if (currentQuestion && currentAnswer) {
                    faqs.push({ question: currentQuestion, answer: currentAnswer });
                }
                // Start new question
                currentQuestion = trimmedLine.replace(/^questions?:\s*/i, '').trim();
                currentAnswer = '';
            } else if (lowerLine.startsWith('answer:') || lowerLine.startsWith('a:')) {
                currentAnswer = trimmedLine.replace(/^answers?:\s*/i, '').trim();
            } else if (currentAnswer && trimmedLine) {
                // Continue multi-line answer
                currentAnswer += ' ' + trimmedLine;
            } else if (currentQuestion && !currentAnswer && trimmedLine) {
                // Continue multi-line question
                currentQuestion += ' ' + trimmedLine;
            }
        }

        // Save last FAQ
        if (currentQuestion && currentAnswer) {
            faqs.push({ question: currentQuestion, answer: currentAnswer });
        }

        return faqs.length > 0 ? faqs : [{ question: '', answer: '' }];
    };

    const formatFaqsToText = (faqs: Array<{ question: string; answer: string }>): string => {
        return faqs
            .filter(faq => faq.question.trim() || faq.answer.trim())
            .map(faq => `Question: ${faq.question}\nAnswer: ${faq.answer}`)
            .join('\n\n');
    };

    const addServiceFaqField = () => {
        setServiceFaqs([...serviceFaqs, { question: '', answer: '' }]);
    };

    const removeServiceFaqField = (index: number) => {
        const newFaqs = serviceFaqs.filter((_, i) => i !== index);
        setServiceFaqs(newFaqs.length > 0 ? newFaqs : [{ question: '', answer: '' }]);
    };

    const updateServiceFaqQuestion = (index: number, value: string) => {
        const newFaqs = [...serviceFaqs];
        newFaqs[index].question = value;
        setServiceFaqs(newFaqs);
    };

    const updateServiceFaqAnswer = (index: number, value: string) => {
        const newFaqs = [...serviceFaqs];
        newFaqs[index].answer = value;
        setServiceFaqs(newFaqs);
    };

    // Category change handler
    const handleCategoryChange = (value: string) => {
        if (value === 'other') {
            setIsOtherCategory(true);
            setFormData({ ...formData, category: '' });
        } else {
            setIsOtherCategory(false);
            setFormData({ ...formData, category: value });
        }
    };

    function editService(service: ClientService) {
        setEditingService(service);
        setFormData(service);

        // Check if service has a custom category (not in predefined list)
        const availableCategories = getAvailableCategories();
        if (service.category && !availableCategories.includes(service.category)) {
            setIsOtherCategory(true);
        } else {
            setIsOtherCategory(false);
        }

        // Parse service FAQs if they exist
        if (service.service_faqs) {
            const parsed = parseFaqText(service.service_faqs);
            setServiceFaqs(parsed);
        } else {
            setServiceFaqs([{ question: '', answer: '' }]);
        }

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
        setServiceFaqs([{ question: '', answer: '' }]);
        setIsOtherCategory(false);
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
                            {!isOtherCategory ? (
                                <select
                                    value={formData.category || ''}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a category...</option>
                                    {getAvailableCategories().map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                    <option value="other">Other (Custom Category)</option>
                                </select>
                            ) : (
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={formData.category || ''}
                                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                                        className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter custom category..."
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsOtherCategory(false);
                                            setFormData({...formData, category: ''});
                                        }}
                                        className="px-3 py-2 text-gray-600 hover:text-gray-800 border rounded hover:bg-gray-50"
                                        title="Back to dropdown"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                    </button>
                                </div>
                            )}
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
                            <AutoExpandTextarea
                                value={formData.service_description || ''}
                                onChange={(e) => setFormData({...formData, service_description: e.target.value})}
                                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Describe what this service includes..."
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">
                                Service FAQs
                                <span className="text-sm text-gray-500 ml-2">(Questions specific to this service)</span>
                            </label>
                            <label className="block text-sm font-normal text-gray-600 mb-4">
                                Add frequently asked questions specific to this service.
                            </label>

                            <div className="space-y-4">
                                {serviceFaqs.map((faq, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="space-y-3">
                                            {/* Question Input */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Question {index + 1}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={faq.question}
                                                    onChange={(e) => updateServiceFaqQuestion(index, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., What should I prepare beforehand?"
                                                />
                                            </div>

                                            {/* Answer Input */}
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                                    Answer {index + 1}
                                                </label>
                                                <AutoExpandTextarea
                                                    value={faq.answer}
                                                    onChange={(e) => updateServiceFaqAnswer(index, e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    placeholder="e.g., You should prepare any relevant medical history..."
                                                    rows={3}
                                                />
                                            </div>

                                            {/* Remove Button */}
                                            {serviceFaqs.length > 1 && (
                                                <div className="flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => removeServiceFaqField(index)}
                                                        className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-1 rounded transition-colors flex items-center gap-1"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Remove FAQ
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Add FAQ Button */}
                                <button
                                    type="button"
                                    onClick={addServiceFaqField}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    Add Another FAQ
                                </button>
                            </div>
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
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-600">
                                                                {service.service_description.length > 150 && !expandedDescriptions.has(service.id!)
                                                                    ? `${service.service_description.substring(0, 150)}...`
                                                                    : service.service_description}
                                                            </p>
                                                            {service.service_description.length > 150 && (
                                                                <button
                                                                    onClick={() => toggleDescription(service.id!)}
                                                                    className="text-xs text-blue-600 hover:text-blue-800 mt-1 font-medium"
                                                                >
                                                                    {expandedDescriptions.has(service.id!) ? 'Show less' : 'Show more'}
                                                                </button>
                                                            )}
                                                        </div>
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