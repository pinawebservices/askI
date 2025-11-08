'use client';

import { useMemo } from 'react';
import type { ChatConversation, CapturedLead } from '@/types/database';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { AnalyticsFilters } from './analytics-filters';

interface AnalyticsDashboardProps {
    conversations: ChatConversation[];
    leads: CapturedLead[];
    clientId: string;
    businessName: string;
    dateFrom: string;
    dateTo: string;
}

export function AnalyticsDashboard({
    conversations,
    leads,
    businessName,
    dateFrom,
    dateTo
}: AnalyticsDashboardProps) {
    // Calculate metrics
    const metrics = useMemo(() => {
        const totalMessages = conversations.length;
        const totalLeads = leads.length;
        const uniqueConversations = new Set(conversations.map(c => c.conversation_id)).size;

        // Lead capture rate = (leads / unique conversations) * 100
        const leadCaptureRate = uniqueConversations > 0
            ? ((totalLeads / uniqueConversations) * 100).toFixed(1)
            : '0.0';

        // Average response time
        const avgResponseTime = conversations.length > 0
            ? Math.round(
                conversations
                    .filter(c => c.response_time_ms)
                    .reduce((sum, c) => sum + (c.response_time_ms || 0), 0) /
                conversations.filter(c => c.response_time_ms).length
            )
            : 0;

        return {
            totalMessages,
            totalLeads,
            leadCaptureRate,
            avgResponseTime,
            uniqueConversations
        };
    }, [conversations, leads]);

    // Conversation volume over time (by day) - counting unique conversations
    const conversationVolumeData = useMemo(() => {
        const dateConversationsMap = new Map<string, Set<string>>();

        conversations.forEach(conv => {
            const date = format(parseISO(conv.created_at), 'MMM dd');
            if (!dateConversationsMap.has(date)) {
                dateConversationsMap.set(date, new Set());
            }
            dateConversationsMap.get(date)?.add(conv.conversation_id);
        });

        return Array.from(dateConversationsMap.entries())
            .map(([date, conversationSet]) => ({ date, conversations: conversationSet.size }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [conversations]);

    // Peak usage times (by hour of day) - counting unique conversations with business hours focus
    const peakUsageData = useMemo(() => {
        // Define time buckets
        const buckets = [
            { label: 'Late Night\n12-5 AM', hours: [0, 1, 2, 3, 4, 5], order: 0 },
            { label: 'Early Morning\n6-8 AM', hours: [6, 7, 8], order: 1 },
            { label: '9 AM', hours: [9], order: 2 },
            { label: '10 AM', hours: [10], order: 3 },
            { label: '11 AM', hours: [11], order: 4 },
            { label: '12 PM', hours: [12], order: 5 },
            { label: '1 PM', hours: [13], order: 6 },
            { label: '2 PM', hours: [14], order: 7 },
            { label: '3 PM', hours: [15], order: 8 },
            { label: '4 PM', hours: [16], order: 9 },
            { label: '5 PM', hours: [17], order: 10 },
            { label: 'Evening\n6-11 PM', hours: [18, 19, 20, 21, 22, 23], order: 11 },
        ];

        // Map each bucket to its unique conversation IDs
        const bucketData = buckets.map(bucket => {
            const conversationSet = new Set<string>();

            conversations.forEach(conv => {
                const hour = parseISO(conv.created_at).getHours();
                if (bucket.hours.includes(hour)) {
                    conversationSet.add(conv.conversation_id);
                }
            });

            return {
                label: bucket.label,
                order: bucket.order,
                conversations: conversationSet.size
            };
        });

        return bucketData.sort((a, b) => a.order - b.order);
    }, [conversations]);

    // Common questions - filtered and clustered by keywords
    const commonQuestions = useMemo(() => {
        const uniqueConversations = new Set(conversations.map(c => c.conversation_id)).size;

        // Question indicators
        const questionWords = ['what', 'how', 'when', 'why', 'where', 'who', 'which', 'can', 'could', 'would', 'should', 'will', 'is', 'are', 'do', 'does', 'did', 'have', 'has', 'tell', 'show'];
        const blacklist = ['yes', 'no', 'ok', 'okay', 'sure', 'thanks', 'thank you', 'hello', 'hi', 'hey', 'bye', 'goodbye'];
        const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'your', 'you', 'me', 'i', 'my', 'we', 'us', 'our', 'am', 'be', 'been', 'being', 'get', 'got'];

        // Helper: Check if message is a question
        const isQuestion = (message: string) => {
            const trimmed = message.trim().toLowerCase();
            const words = trimmed.split(/\s+/);

            if (words.length < 3) return false; // Too short
            if (blacklist.includes(trimmed)) return false; // Blacklisted phrase
            if (message.includes('?')) return true; // Has question mark

            // Check if starts with question word
            return questionWords.some(qw => trimmed.startsWith(qw + ' '));
        };

        // Helper: Basic stemming
        const stem = (word: string) => {
            return word
                .replace(/ing$/, '')
                .replace(/s$/, '')
                .replace(/ed$/, '')
                .replace(/ly$/, '');
        };

        // Helper: Extract keywords from question
        const extractKeywords = (question: string) => {
            const words = question
                .toLowerCase()
                .replace(/[?!.,;:]/g, '')
                .split(/\s+/)
                .filter(w =>
                    w.length > 2 &&
                    !questionWords.includes(w) &&
                    !stopWords.includes(w)
                )
                .map(stem);

            return words;
        };

        // Step 1: Filter for actual questions
        const actualQuestions = conversations
            .map(conv => conv.user_message.trim())
            .filter(msg => msg.length > 0 && isQuestion(msg));

        if (actualQuestions.length === 0) return [];

        // Step 2: Extract all keywords and count frequency
        const keywordFrequency = new Map<string, number>();
        actualQuestions.forEach(question => {
            const keywords = extractKeywords(question);
            keywords.forEach(keyword => {
                keywordFrequency.set(keyword, (keywordFrequency.get(keyword) || 0) + 1);
            });
        });

        // Step 3: Dynamic threshold based on volume
        const keywordThreshold =
            uniqueConversations < 50 ? 2 :
            uniqueConversations < 200 ? 3 :
            5;

        // Find significant keywords (appear above threshold)
        const significantKeywords = Array.from(keywordFrequency.entries())
            .filter(([_, count]) => count >= keywordThreshold)
            .map(([keyword]) => keyword);

        if (significantKeywords.length === 0) {
            // Fallback: show top questions without clustering
            const questionCounts = new Map<string, number>();
            actualQuestions.forEach(q => {
                questionCounts.set(q, (questionCounts.get(q) || 0) + 1);
            });

            return Array.from(questionCounts.entries())
                .map(([question, count]) => ({ question, count }))
                .filter(item => item.count >= 2)
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);
        }

        // Step 4: Group questions by their primary keyword
        const keywordGroups = new Map<string, string[]>();
        significantKeywords.forEach(keyword => keywordGroups.set(keyword, []));

        actualQuestions.forEach(question => {
            const keywords = extractKeywords(question);
            const matchedKeyword = keywords.find(k => significantKeywords.includes(k));

            if (matchedKeyword) {
                keywordGroups.get(matchedKeyword)?.push(question);
            }
        });

        // Step 5: Create summary with representative question
        const questionThreshold =
            uniqueConversations < 50 ? 2 :
            uniqueConversations < 200 ? 3 :
            5;

        return Array.from(keywordGroups.entries())
            .map(([keyword, questions]) => {
                // Get most common question in this group
                const questionCounts = new Map<string, number>();
                questions.forEach(q => {
                    questionCounts.set(q, (questionCounts.get(q) || 0) + 1);
                });

                const topQuestion = Array.from(questionCounts.entries())
                    .sort((a, b) => b[1] - a[1])[0];

                return {
                    keyword,
                    question: topQuestion ? topQuestion[0] : questions[0],
                    count: questions.length
                };
            })
            .filter(item => item.count >= questionThreshold)
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }, [conversations]);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-1">
                    View performance metrics and insights for {businessName}
                </p>
            </div>

            {/* Stats Cards - Matching Leads page design */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Messages" value={metrics.totalMessages.toLocaleString()} color="white" />
                <StatCard label="Leads Captured" value={metrics.totalLeads.toLocaleString()} color="blue" />
                <StatCard label="Lead Capture Rate" value={`${metrics.leadCaptureRate}%`} color="green" />
                <StatCard
                    label="Avg Response Time"
                    value={metrics.avgResponseTime > 0 ? `${(metrics.avgResponseTime / 1000).toFixed(2)}s` : 'N/A'}
                    color="purple"
                />
            </div>

            {/* Filters - Matching Leads page design */}
            <AnalyticsFilters
                currentFilters={{ dateFrom, dateTo }}
            />

            {/* Conversation Volume Chart */}
            <div className="bg-white rounded-lg shadow mb-4">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-1">Conversation Volume Over Time</h2>
                    <p className="text-sm text-gray-600 mb-4">Daily unique conversations for the selected period</p>

                    {conversationVolumeData.length > 0 ? (
                        <ChartContainer
                            config={{
                                conversations: {
                                    label: 'Conversations',
                                    color: 'hsl(142, 71%, 45%)',
                                },
                            }}
                            className="h-[400px] w-full aspect-auto"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={conversationVolumeData}
                                    margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                                >
                                    <defs>
                                        <linearGradient id="colorVolumeBar" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.9}/>
                                            <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.6}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e5e7eb"
                                        vertical={false}
                                        strokeOpacity={0.5}
                                    />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#6b7280', fontSize: 11 }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{
                                            value: 'Conversations',
                                            angle: -90,
                                            position: 'insideLeft',
                                            style: { fill: '#6b7280', fontSize: 12 }
                                        }}
                                    />
                                    <ChartTooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const count = payload[0].value as number;
                                                return (
                                                    <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-lg">
                                                        <p className="text-sm font-semibold text-gray-900">{payload[0].payload.date}</p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            <span className="font-medium text-green-600">{count}</span> {count === 1 ? 'conversation' : 'conversations'}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                        cursor={{ fill: 'rgba(34, 197, 94, 0.05)' }}
                                    />
                                    <Bar
                                        dataKey="conversations"
                                        fill="url(#colorVolumeBar)"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={60}
                                        animationDuration={1000}
                                        animationEasing="ease-out"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    ) : (
                        <div className="h-[400px] flex items-center justify-center text-gray-500">
                            No conversation data available for this period
                        </div>
                    )}
                </div>
            </div>

            {/* Peak Usage Times Chart */}
            <div className="bg-white rounded-lg shadow mb-4">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-1">Peak Conversation Times</h2>
                    <p className="text-sm text-gray-600 mb-4">Unique conversations by hour of day</p>

                    {peakUsageData.some(d => d.conversations > 0) ? (
                        <ChartContainer
                            config={{
                                conversations: {
                                    label: 'Conversations',
                                    color: 'hsl(217, 91%, 60%)',
                                },
                            }}
                            className="h-[400px] w-full aspect-auto"
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={peakUsageData}
                                    margin={{ top: 20, right: 20, left: 10, bottom: 60 }}
                                >
                                    <defs>
                                        <linearGradient id="colorConversations" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.9}/>
                                            <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.6}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#e5e7eb"
                                        vertical={false}
                                        strokeOpacity={0.5}
                                    />
                                    <XAxis
                                        dataKey="label"
                                        tick={{ fill: '#6b7280', fontSize: 11 }}
                                        tickLine={false}
                                        axisLine={{ stroke: '#e5e7eb' }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={80}
                                    />
                                    <YAxis
                                        tick={{ fill: '#6b7280', fontSize: 12 }}
                                        tickLine={false}
                                        axisLine={false}
                                        label={{
                                            value: 'Conversations',
                                            angle: -90,
                                            position: 'insideLeft',
                                            style: { fill: '#6b7280', fontSize: 12 }
                                        }}
                                    />
                                    <ChartTooltip
                                        content={({ active, payload }) => {
                                            if (active && payload && payload.length) {
                                                const count = payload[0].value as number;
                                                return (
                                                    <div className="bg-white px-4 py-3 border border-gray-200 rounded-lg shadow-lg">
                                                        <p className="text-sm font-semibold text-gray-900">{payload[0].payload.label.replace('\n', ' ')}</p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            <span className="font-medium text-blue-600">{count}</span> {count === 1 ? 'conversation' : 'conversations'}
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }}
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                    />
                                    <Bar
                                        dataKey="conversations"
                                        fill="url(#colorConversations)"
                                        radius={[6, 6, 0, 0]}
                                        maxBarSize={60}
                                        animationDuration={1000}
                                        animationEasing="ease-out"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    ) : (
                        <div className="h-[400px] flex items-center justify-center text-gray-500">
                            No usage data available for this period
                        </div>
                    )}
                </div>
            </div>

            {/* Common Questions */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-1">Most Common Questions</h2>
                    <p className="text-sm text-gray-600 mb-4">Top 10 frequently asked questions</p>

                    {commonQuestions.length > 0 ? (
                        <div className="space-y-2">
                            {commonQuestions.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-semibold text-sm">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-900 break-words">
                                            {item.question}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 ml-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                            {item.count} {item.count === 1 ? 'time' : 'times'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-12 text-center text-gray-500">
                            No questions available for this period
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

interface StatCardProps {
    label: string;
    value: string | number;
    color: 'white' | 'blue' | 'yellow' | 'purple' | 'green';
}

function StatCard({ label, value, color }: StatCardProps) {
    const colorClasses = {
        white: 'bg-white text-gray-900 border border-gray-200',
        blue: 'bg-blue-50 text-blue-900 border border-blue-200',
        yellow: 'bg-yellow-50 text-yellow-900 border border-yellow-200',
        purple: 'bg-purple-50 text-purple-900 border border-purple-200',
        green: 'bg-green-50 text-green-900 border border-green-200',
    };

    return (
        <div className={`p-4 rounded-lg shadow-sm ${colorClasses[color]}`}>
            <h3 className="text-sm font-medium opacity-75">{label}</h3>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
}