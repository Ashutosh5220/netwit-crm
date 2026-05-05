import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

interface Client {
    id: number;
    name: string;
}

interface Props {
    show: boolean;
    onClose: () => void;
}

export default function LeadFormModal({ show, onClose }: Props) {
    const emptyForm = {
        client_id: '', title: '', value: '', stage: 'new', 
        source: '', expected_close_date: '', description: '',
    };

    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [clients, setClients] = useState<Client[]>([]);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (show) {
            setForm(emptyForm);
            setErrors({});

            fetch('/api/clients', {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
            }).then(res => res.json()).then(data => setClients(data));
        }
    }, [show]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        setProcessing(true);

        
        router.post('/leads', form, {
            preserveScroll: true,
            onSuccess: () => onClose(),
            onError: (e) => setErrors(e as Record<string, string>),
            onFinish: () => setProcessing(false),
        });
    };

    if (!show) return null;

    const inputClass = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-lg mx-4 p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Create New Lead</h2>
                
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
                            <input type="text" value={form.source} onChange={e => setForm({...form, source: e.target.value})} placeholder="Website, Referral..." className={inputClass} />
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
                    
                    <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-300 transition">Cancel</button>
                        <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
                            {processing ? 'Creating...' : 'Create Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}