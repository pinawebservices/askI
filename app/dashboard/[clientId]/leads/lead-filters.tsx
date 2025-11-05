'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, X, Calendar } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface LeadFiltersProps {
    currentFilters: {
        status?: string;
        source?: string;
        dateFrom?: string;
        dateTo?: string;
        search?: string;
    };
    sources: string[];
}

export function LeadFilters({ currentFilters, sources }: LeadFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const clearFilters = () => {
        router.push(pathname);
    };

    const hasActiveFilters = Object.values(currentFilters).some(v => v);

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                {/* Search */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search by name, email, phone..."
                        defaultValue={currentFilters.search || ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            // Debounce search
                            setTimeout(() => updateFilter('search', value), 500);
                        }}
                        className="pl-10 h-10"
                    />
                </div>

                {/* Status Filter */}
                <Select
                    defaultValue={currentFilters.status || 'all'}
                    onValueChange={(value) => updateFilter('status', value)}
                >
                    <SelectTrigger className="w-full md:w-[160px] h-10">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="won">Won</SelectItem>
                        <SelectItem value="lost">Lost</SelectItem>
                    </SelectContent>
                </Select>

                {/* Source Filter */}
                {sources.length > 0 && (
                    <Select
                        defaultValue={currentFilters.source || 'all'}
                        onValueChange={(value) => updateFilter('source', value)}
                    >
                        <SelectTrigger className="w-full md:w-[160px] h-10">
                            <SelectValue placeholder="Filter by source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Sources</SelectItem>
                            {sources.map((source) => (
                                <SelectItem key={source} value={source}>
                                    {source}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )}

                {/* Date Range */}
                <div className="flex items-center gap-2 bg-gray-50 px-3 rounded-md border h-10">
                    <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <div className="flex items-center gap-1.5">
                        <Label htmlFor="dateFrom" className="text-xs text-gray-600 whitespace-nowrap">
                            From:
                        </Label>
                        <Input
                            key={`dateFrom-${currentFilters.dateFrom || 'empty'}`}
                            id="dateFrom"
                            type="date"
                            defaultValue={currentFilters.dateFrom || ''}
                            onBlur={(e) => updateFilter('dateFrom', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    updateFilter('dateFrom', e.currentTarget.value);
                                }
                            }}
                            className="w-[120px] h-7 text-sm border-0 bg-white"
                        />
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Label htmlFor="dateTo" className="text-xs text-gray-600 whitespace-nowrap">
                            To:
                        </Label>
                        <Input
                            key={`dateTo-${currentFilters.dateTo || 'empty'}`}
                            id="dateTo"
                            type="date"
                            defaultValue={currentFilters.dateTo || ''}
                            onBlur={(e) => updateFilter('dateTo', e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    updateFilter('dateTo', e.currentTarget.value);
                                }
                            }}
                            className="w-[120px] h-7 text-sm border-0 bg-white"
                        />
                    </div>
                </div>

                {/* Clear Filters */}
                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        onClick={clearFilters}
                        className="whitespace-nowrap h-10"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Clear
                    </Button>
                )}
            </div>
        </div>
    );
}