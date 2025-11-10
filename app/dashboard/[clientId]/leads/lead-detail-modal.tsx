'use client';

import { useState, useEffect } from 'react';
import { Database } from '@/types/supabase';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
    Mail,
    Phone,
    Building,
    Calendar,
    MessageSquare,
    Save,
    X,
    Clock,
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type Lead = Database['public']['Tables']['captured_leads']['Row'];

interface LeadDetailModalProps {
    lead: Lead;
    clientId: string;
    onClose: () => void;
}

export function LeadDetailModal({ lead, clientId, onClose }: LeadDetailModalProps) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState(lead.status || 'new');
    const [notes, setNotes] = useState(lead.notes || '');

    // Parse conversation from conversation_summary
    const conversation = lead.conversation_summary as Array<{
        role: string;
        content: string;
    }> | null;

    const handleSave = async () => {
        setIsSaving(true);

        try {
            const response = await fetch(`/api/leads/${lead.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    notes,
                    last_contacted_at:
                        status === 'contacted' && !lead.last_contacted_at
                            ? new Date().toISOString()
                            : lead.last_contacted_at,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update lead');
            }

            toast.success('Lead updated successfully');
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error('Error updating lead:', error);
            toast.error('Failed to update lead. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleMarkAsContacted = async () => {
        setIsSaving(true);

        try {
            const response = await fetch(`/api/leads/${lead.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'contacted',
                    last_contacted_at: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to mark as contacted');
            }

            toast.success('Lead marked as contacted');
            router.refresh();
        } catch (error) {
            console.error('Error updating lead:', error);
            toast.error('Failed to update lead. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateLastContacted = async () => {
        setIsSaving(true);

        try {
            const response = await fetch(`/api/leads/${lead.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    last_contacted_at: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update last contacted');
            }

            toast.success('Last contacted time updated');
            router.refresh();
        } catch (error) {
            console.error('Error updating lead:', error);
            toast.error('Failed to update. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={true} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Lead Details</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Contact Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold mb-3">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <InfoItem
                                icon={<Mail className="h-4 w-4" />}
                                label="Name"
                                value={lead.name || 'N/A'}
                            />
                            <InfoItem
                                icon={<Mail className="h-4 w-4" />}
                                label="Email"
                                value={
                                    lead.email ? (
                                        <a
                                            href={`mailto:${lead.email}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {lead.email}
                                        </a>
                                    ) : (
                                        'N/A'
                                    )
                                }
                            />
                            <InfoItem
                                icon={<Phone className="h-4 w-4" />}
                                label="Phone"
                                value={
                                    lead.phone ? (
                                        <a
                                            href={`tel:${lead.phone}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {lead.phone}
                                        </a>
                                    ) : (
                                        'N/A'
                                    )
                                }
                            />
                            {(lead.has_insurance !== null && lead.has_insurance !== undefined) && (
                                <InfoItem
                                    icon={<Building className="h-4 w-4" />}
                                    label="Insurance"
                                    value={
                                        lead.has_insurance
                                            ? (lead.insurance_provider || 'Yes (provider not specified)')
                                            : 'No Insurance'
                                    }
                                />
                            )}
                            <InfoItem
                                icon={<Calendar className="h-4 w-4" />}
                                label="Captured"
                                value={
                                    lead.captured_at
                                        ? format(new Date(lead.captured_at), 'PPp')
                                        : 'N/A'
                                }
                            />
                            <InfoItem
                                icon={<Calendar className="h-4 w-4" />}
                                label="Last Contacted"
                                value={
                                    lead.last_contacted_at
                                        ? format(new Date(lead.last_contacted_at), 'PPp')
                                        : 'Never'
                                }
                            />
                        </div>
                    </div>

                    {/* Status and Notes */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Status & Notes</h3>
                            {!isEditing && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </Button>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="status">Status</Label>
                                {isEditing ? (
                                    <Select value={status} onValueChange={setStatus}>
                                        <SelectTrigger id="status" className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="contacted">Contacted</SelectItem>
                                            <SelectItem value="qualified">Qualified</SelectItem>
                                            <SelectItem value="won">Won</SelectItem>
                                            <SelectItem value="lost">Lost</SelectItem>
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    <div className="mt-1">
                                        <StatusBadge status={status} />
                                    </div>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                {isEditing ? (
                                    <Textarea
                                        id="notes"
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Add notes about this lead..."
                                        rows={4}
                                        className="mt-1"
                                    />
                                ) : (
                                    <p className="mt-1 text-sm text-gray-600">
                                        {notes || 'No notes added yet'}
                                    </p>
                                )}
                            </div>

                            {isEditing && (
                                <div className="flex gap-2">
                                    <Button onClick={handleSave} disabled={isSaving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Changes
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setStatus(lead.status || 'new');
                                            setNotes(lead.notes || '');
                                        }}
                                        disabled={isSaving}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    {!isEditing && (
                        <div className="flex flex-wrap gap-2">
                            {lead.status === 'new' ? (
                                <Button
                                    onClick={handleMarkAsContacted}
                                    disabled={isSaving}
                                    variant="default"
                                >
                                    Mark as Contacted
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleUpdateLastContacted}
                                    disabled={isSaving}
                                    variant="outline"
                                >
                                    <Clock className="h-4 w-4 mr-2" />
                                    Update Last Contacted
                                </Button>
                            )}
                            {lead.email && (
                                <Button variant="outline" asChild>
                                    <a href={`mailto:${lead.email}`}>
                                        <Mail className="h-4 w-4 mr-2" />
                                        Send Email
                                    </a>
                                </Button>
                            )}
                            {lead.phone && (
                                <Button variant="outline" asChild>
                                    <a href={`tel:${lead.phone}`}>
                                        <Phone className="h-4 w-4 mr-2" />
                                        Call
                                    </a>
                                </Button>
                            )}
                        </div>
                    )}

                    {/* AI Conversation Summary */}
                    {lead.ai_summary && (
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h3 className="font-semibold mb-3 flex items-center gap-2 text-blue-900">
                                <MessageSquare className="h-5 w-5" />
                                AI Conversation Summary
                            </h3>
                            <ul className="list-disc pl-5 space-y-1 text-sm text-blue-800">
                                {lead.ai_summary
                                    .replace(/<\/?ul>/g, '') // Remove <ul> and </ul> tags
                                    .split('</li>')
                                    .filter(item => item.includes('<li>'))
                                    .map((item, index) => (
                                        <li key={index}>
                                            {item.replace(/<\/?li>/g, '').trim()}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    )}

                    {/* Conversation History */}
                    {conversation && conversation.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <MessageSquare className="h-5 w-5" />
                                Full Conversation
                            </h3>
                            <div className="bg-white border rounded-lg p-4 max-h-96 overflow-y-auto">
                                <div className="space-y-4">
                                    {conversation.map((message, index) => (
                                        <div
                                            key={index}
                                            className={`flex ${
                                                message.role === 'user'
                                                    ? 'justify-end'
                                                    : 'justify-start'
                                            }`}
                                        >
                                            <div
                                                className={`max-w-[80%] rounded-lg p-3 ${
                                                    message.role === 'user'
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                }`}
                                            >
                                                <div className="text-xs font-semibold mb-1 opacity-75">
                                                    {message.role === 'user' ? 'User' : 'Assistant'}
                                                </div>
                                                <div className="text-sm whitespace-pre-wrap">
                                                    {message.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Inquiry Type and Source */}
                    {(lead.inquiry_type || lead.source) && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold mb-3">Additional Information</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {lead.inquiry_type && (
                                    <div>
                                        <Label>Inquiry Type</Label>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {lead.inquiry_type}
                                        </p>
                                    </div>
                                )}
                                {lead.source && (
                                    <div>
                                        <Label>Source</Label>
                                        <p className="text-sm text-gray-600 mt-1">{lead.source}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function InfoItem({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) {
    return (
        <div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                {icon}
                <span>{label}</span>
            </div>
            <div className="text-sm font-medium">{value}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const statusConfig = {
        new: { color: 'bg-blue-100 text-blue-800', label: 'New' },
        contacted: { color: 'bg-yellow-100 text-yellow-800', label: 'Contacted' },
        qualified: { color: 'bg-purple-100 text-purple-800', label: 'Qualified' },
        won: { color: 'bg-green-100 text-green-800', label: 'Won' },
        lost: { color: 'bg-gray-100 text-gray-800', label: 'Lost' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;

    return <Badge className={config.color}>{config.label}</Badge>;
}
