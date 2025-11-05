'use client';

import { useState } from 'react';
import { Database } from '@/types/supabase';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ArrowUpDown,
    Mail,
    Phone,
    MoreVertical,
    Eye,
    MessageSquare,
} from 'lucide-react';
import { LeadDetailModal } from './lead-detail-modal';
import { formatDistanceToNow, format } from 'date-fns';

type Lead = Database['public']['Tables']['captured_leads']['Row'];

interface LeadsTableProps {
    leads: Lead[];
    clientId: string;
}

type SortField = 'captured_at' | 'name' | 'lead_score' | 'status' | 'last_contacted_at';
type SortDirection = 'asc' | 'desc';

export function LeadsTable({ leads, clientId }: LeadsTableProps) {
    const [sortField, setSortField] = useState<SortField>('captured_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    // Sort leads
    const sortedLeads = [...leads].sort((a, b) => {
        let aVal: any = a[sortField];
        let bVal: any = b[sortField];

        // Handle null values
        if (aVal === null) return 1;
        if (bVal === null) return -1;

        // Handle different types
        if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = (bVal as string).toLowerCase();
        }

        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });

    const toggleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('desc');
        }
    };

    return (
        <>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => toggleSort('captured_at')}
                                    className="flex items-center gap-2"
                                >
                                    Date Captured
                                    <ArrowUpDown className="h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Lead Age</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => toggleSort('name')}
                                    className="flex items-center gap-2"
                                >
                                    Name
                                    <ArrowUpDown className="h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Contact Info</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => toggleSort('lead_score')}
                                    className="flex items-center gap-2"
                                >
                                    Score
                                    <ArrowUpDown className="h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => toggleSort('status')}
                                    className="flex items-center gap-2"
                                >
                                    Status
                                    <ArrowUpDown className="h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => toggleSort('last_contacted_at')}
                                    className="flex items-center gap-2"
                                >
                                    Last Contacted
                                    <ArrowUpDown className="h-4 w-4" />
                                </Button>
                            </TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedLeads.map((lead) => (
                            <TableRow key={lead.id} className="hover:bg-gray-50">
                                <TableCell className="font-medium">
                                    {lead.captured_at
                                        ? format(new Date(lead.captured_at), 'MM/dd/yy h:mma')
                                        : 'N/A'}
                                </TableCell>
                                <TableCell className="text-sm text-gray-600">
                                    {lead.captured_at
                                        ? formatDistanceToNow(new Date(lead.captured_at), {
                                              addSuffix: true,
                                          })
                                        : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <div>
                                        <div className="font-medium">
                                            {lead.name || 'Anonymous'}
                                        </div>
                                        {lead.company && (
                                            <div className="text-sm text-gray-500">
                                                {lead.company}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        {lead.email && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Mail className="h-3 w-3 text-gray-400" />
                                                <a
                                                    href={`mailto:${lead.email}`}
                                                    className="hover:underline text-blue-600"
                                                >
                                                    {lead.email}
                                                </a>
                                            </div>
                                        )}
                                        {lead.phone && (
                                            <div className="flex items-center gap-2 text-sm">
                                                <Phone className="h-3 w-3 text-gray-400" />
                                                <a
                                                    href={`tel:${lead.phone}`}
                                                    className="hover:underline text-blue-600"
                                                >
                                                    {lead.phone}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {lead.lead_score !== null && lead.lead_score !== undefined ? (
                                        <LeadScoreBadge score={lead.lead_score} />
                                    ) : (
                                        <span className="text-gray-400">N/A</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <LeadStatusBadge status={lead.status || 'new'} />
                                </TableCell>
                                <TableCell>
                                    {lead.last_contacted_at ? (
                                        <span className="text-sm">
                                            {formatDistanceToNow(new Date(lead.last_contacted_at), {
                                                addSuffix: true,
                                            })}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-sm">Never</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setSelectedLead(lead)}
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            View
                                        </Button>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => setSelectedLead(lead)}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </DropdownMenuItem>
                                                {lead.email && (
                                                    <DropdownMenuItem asChild>
                                                        <a href={`mailto:${lead.email}`}>
                                                            <Mail className="h-4 w-4 mr-2" />
                                                            Send Email
                                                        </a>
                                                    </DropdownMenuItem>
                                                )}
                                                {lead.phone && (
                                                    <DropdownMenuItem asChild>
                                                        <a href={`tel:${lead.phone}`}>
                                                            <Phone className="h-4 w-4 mr-2" />
                                                            Call
                                                        </a>
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Lead Detail Modal */}
            {selectedLead && (
                <LeadDetailModal
                    lead={selectedLead}
                    clientId={clientId}
                    onClose={() => setSelectedLead(null)}
                />
            )}
        </>
    );
}

function LeadScoreBadge({ score }: { score: number }) {
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
        if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        return 'bg-red-100 text-red-800 border-red-200';
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'High';
        if (score >= 50) return 'Medium';
        return 'Low';
    };

    return (
        <Badge variant="outline" className={getScoreColor(score)}>
            {getScoreLabel(score)} ({score})
        </Badge>
    );
}

function LeadStatusBadge({ status }: { status: string }) {
    const statusConfig = {
        new: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'New' },
        contacted: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Contacted' },
        qualified: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Qualified' },
        won: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Won' },
        lost: { color: 'bg-gray-100 text-gray-800 border-gray-200', label: 'Lost' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;

    return (
        <Badge variant="outline" className={config.color}>
            {config.label}
        </Badge>
    );
}