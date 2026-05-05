import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { Client } from '@/types/lead';

interface Lead {
    id: number;
    client_id: number;
    title: string;
    value: string | null;
    stage: string;
    source: string | null;
    expected_close_date: string | null;
    description: string | null;
    client?: Client;
}

interface Props {
    lead: Lead;
    clients: Client[];
}

export default function Edit({ lead, clients }: Props) {
    const [form, setForm] = useState({
        client_id: String(lead.client_id || ''),
        title: lead.title || '',
        value: lead.value || '',
        stage: lead.stage || 'new',
        source: lead.source || '',
        expected_close_date: lead.expected_close_date || '',
        description: lead.description || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        router.put(`/leads/${lead.id}`, form, {
            preserveScroll: true,
            onSuccess: () => router.get('/leads'),
            onError: (e) => setErrors(e as Record<string, string>),
            onFinish: () => setProcessing(false),
        });
    };

    const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

    return (
        <AppLayout>
            <Head title="Edit Lead" />
            
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Edit Lead</h1>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client</label>
                                <select value={form.client_id} onChange={e => setForm({...form, client_id: e.target.value})} className={inputClass}>
                                    <option value="">Select client...</option>
                                    {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                                {errors.client_id && <p className="mt-1 text-xs text-red-500">{errors.client_id}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className={inputClass} />
                                {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Value ($)</label>
                                <input type="number" step="0.01" value={form.value} onChange={e => setForm({...form, value: e.target.value})} className={inputClass} />
                                {errors.value && <p className="mt-1 text-xs text-red-500">{errors.value}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Stage</label>
                                <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})} className={inputClass}>
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="proposal">Proposal</option>
                                    <option value="negotiation">Negotiation</option>
                                    <option value="closed_won">Closed Won</option>
                                    <option value="closed_lost">Closed Lost</option>
                                </select>
                                {errors.stage && <p className="mt-1 text-xs text-red-500">{errors.stage}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
                                <input type="text" value={form.source} onChange={e => setForm({...form, source: e.target.value})} className={inputClass} />
                                {errors.source && <p className="mt-1 text-xs text-red-500">{errors.source}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expected Close</label>
                                <input type="date" value={form.expected_close_date} onChange={e => setForm({...form, expected_close_date: e.target.value})} className={inputClass} />
                                {errors.expected_close_date && <p className="mt-1 text-xs text-red-500">{errors.expected_close_date}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                            <textarea rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})} className={inputClass}></textarea>
                            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
                        </div>
                        
                        <div className="flex justify-between pt-4 border-t dark:border-gray-700">
                            <button type="button" onClick={() => router.get('/leads')} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-300 transition">
                                Cancel
                            </button>
                            <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                                {processing ? 'Saving...' : 'Update Lead'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}