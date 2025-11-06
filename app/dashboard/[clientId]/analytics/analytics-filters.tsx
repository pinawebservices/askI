'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar, X } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface AnalyticsFiltersProps {
    currentFilters: {
        dateFrom?: string;
        dateTo?: string;
    };
}

export function AnalyticsFilters({ currentFilters }: AnalyticsFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updateFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) {
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
                {/* Date Range */}
                <div className="flex items-center gap-2 bg-gray-50 px-3 rounded-md border h-10 flex-1">
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

                {/* Quick Date Presets */}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            const today = new Date().toISOString().split('T')[0];
                            const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                            params.set('dateFrom', last7Days);
                            params.set('dateTo', today);
                            router.push(`${pathname}?${params.toString()}`);
                        }}
                        className="whitespace-nowrap h-10 text-xs"
                    >
                        Last 7 Days
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => {
                            const params = new URLSearchParams(searchParams.toString());
                            const today = new Date().toISOString().split('T')[0];
                            const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                            params.set('dateFrom', last30Days);
                            params.set('dateTo', today);
                            router.push(`${pathname}?${params.toString()}`);
                        }}
                        className="whitespace-nowrap h-10 text-xs"
                    >
                        Last 30 Days
                    </Button>
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