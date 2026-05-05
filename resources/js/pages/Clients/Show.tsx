import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

interface Note {
    id: number;
    title: string;
    content: string;
    type: 'note' | 'call' | 'email' | 'meeting';
    created_at: string;
}

interface Lead {
    id: number;
    title: string;
    value: number;
    stage: string;
    source: string;
    expected_close_date: string;
}

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    website: string;
    status: string;
    address: string;
    leads: Lead[];
    notes: Note[];
}

const stageColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    proposal: 'bg-purple-100 text-purple-800',
    negotiation: 'bg-orange-100 text-orange-800',
    closed_won: 'bg-green-100 text-green-800',
    closed_lost: 'bg-red-100 text-red-800',
};

const noteTypeIcons: Record<string, string> = {
    note: '📝',
    call: '📞',
    email: '📧',
    meeting: '🤝',
};

export default function Show({ client }: { client: Client }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        client_id: client.id,
        title: '',
        content: '',
        type: 'note',
    });

    const submitNote = (e: React.FormEvent) => {
        e.preventDefault();
        post('/notes', {
            onSuccess: () => reset('title', 'content'),
        });
    };

    return (
        <AppLayout>
            <Head title={client.name} />
            <div className="p-6 max-w-5xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">{client.name}</h1>
                        <p className="text-gray-500">{client.company}</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/clients/${client.id}/edit`}>
                            <Button variant="outline">Edit</Button>
                        </Link>
                        <Link href="/clients">
                            <Button variant="outline">← Back</Button>
                        </Link>
                    </div>
                </div>

                {/* Client Info */}
                <div className="bg-white rounded-lg shadow p-6 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium">{client.email || '—'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium">{client.phone || '—'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Website</p>
                        <p className="font-medium">{client.website || '—'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium">{client.address || '—'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            client.status === 'active' ? 'bg-green-100 text-green-800' :
                            client.status === 'inactive' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                        }`}>
                            {client.status}
                        </span>
                    </div>
                </div>

                {/* Leads */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Leads</h2>
                        <Link href="/leads/create">
                            <Button size="sm">+ Add Lead</Button>
                        </Link>
                    </div>
                    {client.leads.length === 0 ? (
                        <p className="text-gray-400 text-sm">No leads yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {client.leads.map((lead) => (
                                <div key={lead.id} className="flex items-center justify-between border rounded-lg p-3">
                                    <div>
                                        <p className="font-medium">{lead.title}</p>
                                        <p className="text-sm text-gray-500">
                                            ${Number(lead.value).toLocaleString()} · {lead.source || 'No source'}
                                        </p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageColors[lead.stage]}`}>
                                        {lead.stage.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Notes */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Notes & Activity</h2>

                    {/* Add Note Form */}
                    <form onSubmit={submitNote} className="mb-6 space-y-3 border-b pb-6">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    placeholder="Note title..."
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                            </div>
                            <div>
                                <select
                                    value={data.type}
                                    onChange={e => setData('type', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="note">📝 Note</option>
                                    <option value="call">📞 Call</option>
                                    <option value="email">📧 Email</option>
                                    <option value="meeting">🤝 Meeting</option>
                                </select>
                            </div>
                        </div>
                        <textarea
                            value={data.content}
                            onChange={e => setData('content', e.target.value)}
                            placeholder="Write your note here..."
                            rows={3}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
                        <Button type="submit" size="sm" disabled={processing}>
                            {processing ? 'Adding...' : 'Add Note'}
                        </Button>
                    </form>

                    {/* Notes List */}
                    {client.notes.length === 0 ? (
                        <p className="text-gray-400 text-sm">No notes yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {client.notes.map((note) => (
                                <div key={note.id} className="flex gap-3 border rounded-lg p-3">
                                    <span className="text-xl">{noteTypeIcons[note.type]}</span>
                                    <div className="flex-1">
                                        <p className="font-medium text-sm">{note.title}</p>
                                        <p className="text-gray-600 text-sm mt-1">{note.content}</p>
                                        <p className="text-gray-400 text-xs mt-1">{note.created_at}</p>
                                    </div>
                                    <Link
                                        href={`/notes/${note.id}`}
                                        method="delete"
                                        as="button"
                                        className="text-red-400 hover:text-red-600 text-sm"
                                    >
                                        Delete
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </AppLayout>
    );
}