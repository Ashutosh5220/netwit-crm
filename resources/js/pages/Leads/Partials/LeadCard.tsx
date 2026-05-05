import React, { useMemo } from 'react';
import { router } from '@inertiajs/react';
import type { Lead } from '@/types/lead';

interface Props {
    lead: Lead;
    onDragStart: (e: React.DragEvent) => void;
    onDragEnd: (e: React.DragEvent) => void;
}

export default function LeadCard({ lead, onDragStart, onDragEnd }: Props) {
    const fmt = (v: string | null) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(Number(v || 0));

    const daysLeft = useMemo(() => {
        if (!lead.expected_close_date) return null;
        return Math.ceil((new Date(lead.expected_close_date).getTime() - Date.now()) / 86400000);
    }, [lead.expected_close_date]);

    const isOverdue = daysLeft !== null && daysLeft < 0;
    const isDueSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

    const edit = () => router.get(`/leads/${lead.id}/edit`);
    
    const del = () => {
        if (confirm('Are you sure you want to delete this lead?')) {
            router.delete(`/leads/${lead.id}`, { preserveScroll: true });
        }
    };

    return (
        <div
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-all duration-150 hover:-translate-y-0.5"
        >
            <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate" title={lead.title}>
                {lead.title}
            </h4>
            {lead.client && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                    {lead.client.name}
                </p>
            )}
            {lead.value && (
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-1.5">
                    {fmt(lead.value)}
                </p>
            )}
            {lead.source && (
                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs rounded px-2 py-0.5 mt-1.5">
                    {lead.source}
                </span>
            )}

            {lead.expected_close_date && (
                <div className="flex items-center gap-1.5 text-xs mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    <svg className={`w-3.5 h-3.5 flex-shrink-0 ${isOverdue ? 'text-red-500' : isDueSoon ? 'text-amber-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <span className={isOverdue ? 'text-red-500 font-medium' : isDueSoon ? 'text-amber-500' : 'text-gray-500 dark:text-gray-400'}>
                        {new Date(lead.expected_close_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {isOverdue && ' (overdue)'}
                        {isDueSoon && ` (${daysLeft}d left)`}
                    </span>
                </div>
            )}

            <div className="flex gap-3 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                <button onClick={(e) => { e.stopPropagation(); edit(); }} className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 font-medium">Edit</button>
                <button onClick={(e) => { e.stopPropagation(); del(); }} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
            </div>
        </div>
    );
}