import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import LeadCard from './Partials/LeadCard';
import LeadFormModal from './Partials/LeadFormModal';
import type { StageColumn, PipelineStats } from '@/types/lead';

interface Props {
    stages: Record<string, StageColumn>;
    stats: PipelineStats;
}

export default function Kanban({ stages, stats }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [dragState, setDragState] = useState<{ id: number | null; stage: string | null }>({ id: null, stage: null });
    const [search, setSearch] = useState('');

    const colors: Record<string, { bg: string; header: string }> = {
        new: { bg: 'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700', header: 'bg-slate-600' },
        contacted: { bg: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800', header: 'bg-blue-600' },
        proposal: { bg: 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800', header: 'bg-amber-600' },
        negotiation: { bg: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800', header: 'bg-purple-600' },
        closed_won: { bg: 'bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800', header: 'bg-emerald-600' },
        closed_lost: { bg: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800', header: 'bg-red-600' },
    };

    const fmt = (v: string | number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(v));

    // Filter leads based on search input
    const filteredStages = Object.fromEntries(
        Object.entries(stages).map(([key, col]) => [
            key,
            {
                ...col,
                leads: col.leads.filter(
                    (lead) =>
                        lead.title.toLowerCase().includes(search.toLowerCase()) ||
                        (lead.client?.name || '').toLowerCase().includes(search.toLowerCase())
                ),
                count: col.leads.filter(
                    (lead) =>
                        lead.title.toLowerCase().includes(search.toLowerCase()) ||
                        (lead.client?.name || '').toLowerCase().includes(search.toLowerCase())
                ).length,
            }
        ])
    );

    const clearHighlights = () => {
        document.querySelectorAll('.kanban-col').forEach(el => {
            el.classList.remove('ring-2', 'ring-blue-500');
        });
    };

    const onDragStart = (e: React.DragEvent, id: number, stage: string) => {
        setDragState({ id, stage });
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(id));
        (e.target as HTMLElement).style.opacity = '0.5';
    };

    const onDragEnd = (e: React.DragEvent) => {
        (e.target as HTMLElement).style.opacity = '1';
        clearHighlights();
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        const col = (e.currentTarget as HTMLElement).closest('.kanban-col');
        col?.classList.add('ring-2', 'ring-blue-500');
    };

    const onDragLeave = (e: React.DragEvent) => {
        const col = (e.currentTarget as HTMLElement).closest('.kanban-col');
        if (!col?.contains(e.relatedTarget as HTMLElement)) {
            col?.classList.remove('ring-2', 'ring-blue-500');
        }
    };

    const onDrop = (e: React.DragEvent, toStage: string) => {
        e.preventDefault();
        clearHighlights();

        if (dragState.id && dragState.stage !== toStage) {
            router.patch(`/leads/${dragState.id}/stage`, 
                { stage: toStage }, 
                { preserveScroll: true, preserveState: true }
            );
        }
        setDragState({ id: null, stage: null });
    };

    return (
        <AppLayout>
            <Head title="Lead Pipeline" />
            
            {/* ✅ FIX 1: Added Search Bar Here */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search leads by title or client..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Lead Pipeline</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Drag and drop to update stages</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden lg:flex gap-3 text-sm">
                        <div className="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                            <span className="block font-bold text-blue-600 dark:text-blue-400">{fmt(stats.pipeline_value)}</span>
                            <span className="text-xs text-gray-500">Pipeline</span>
                        </div>
                        <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                            <span className="block font-bold text-emerald-600 dark:text-emerald-400">{fmt(stats.won_value)}</span>
                            <span className="text-xs text-gray-500">Won</span>
                        </div>
                        <div className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                            <span className="block font-bold text-gray-600 dark:text-gray-300">{stats.active_count}</span>
                            <span className="text-xs text-gray-500">Active</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                    >
                        + New Lead
                    </button>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-280px)]">
                {/* ✅ FIX 2: Changed stages to filteredStages here */}
                {Object.entries(filteredStages).map(([key, col]) => (
                    <div
                        key={key}
                        className={`kanban-col flex-shrink-0 w-72 flex flex-col rounded-xl border-2 transition-all ${colors[key]?.bg || ''}`}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e, key)}
                    >
                        <div className={`p-3 rounded-t-[10px] flex justify-between items-center ${colors[key]?.header}`}>
                            <h3 className="font-semibold text-sm text-white">{col.label}</h3>
                            <span className="bg-white/20 text-white text-xs rounded-full px-2 py-0.5">{col.count}</span>
                        </div>

                        {col.value > 0 && (
                            <div className={`px-3 py-1.5 text-xs font-medium border-b dark:border-gray-700 ${colors[key]?.bg}`}>
                                {fmt(col.value)}
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[100px]" onDragOver={(e) => e.preventDefault()}>
                            {col.leads.length > 0 ? (
                                col.leads.map((lead) => (
                                    <LeadCard
                                        key={lead.id}
                                        lead={lead}
                                        onDragStart={(e) => onDragStart(e, lead.id, key)}
                                        onDragEnd={onDragEnd}
                                    />
                                ))
                            ) : (
                                <div className="border-2 border-dashed rounded-lg p-8 text-center text-xs text-gray-400 dark:text-gray-600">
                                    Drop leads here
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <LeadFormModal show={showModal} onClose={() => setShowModal(false)} />
        </AppLayout>
    );
}