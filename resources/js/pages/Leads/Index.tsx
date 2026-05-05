import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';

interface Lead {
    id: number;
    title: string;
    value: number;
    stage: string;
    source: string;
    expected_close_date: string;
    client: {
        id: number;
        name: string;
        company: string;
    };
}

interface Props {
    leads: {
        data: Lead[];
        links: any[];
    };
}

const stageColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    proposal: 'bg-purple-100 text-purple-800',
    negotiation: 'bg-orange-100 text-orange-800',
    closed_won: 'bg-green-100 text-green-800',
    closed_lost: 'bg-red-100 text-red-800',
};

export default function Index({ leads }: Props) {
    const deleteLead = (id: number) => {
        if (confirm('Delete this lead?')) {
            router.delete(`/leads/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Leads" />
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Leads</h1>
                    <Link href="/leads/create">
                        <Button>+ Add Lead</Button>
                    </Link>
                </div>

                {/* Pipeline Summary */}
                <div className="grid grid-cols-6 gap-3 mb-6">
                    {Object.keys(stageColors).map((stage) => (
                        <div key={stage} className="bg-white rounded-lg shadow p-3 text-center">
                            <p className="text-xs text-gray-500 capitalize">{stage.replace('_', ' ')}</p>
                            <p className="text-xl font-bold mt-1">
                                {leads.data.filter(l => l.stage === stage).length}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Leads Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Close Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leads.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                        No leads yet. <Link href="/leads/create" className="text-blue-500 underline">Add your first lead</Link>
                                    </td>
                                </tr>
                            ) : (
                                leads.data.map((lead) => (
                                    <tr key={lead.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{lead.title}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            <Link href={`/clients/${lead.client.id}`} className="hover:text-blue-600">
                                                {lead.client.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">
                                            ${Number(lead.value).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageColors[lead.stage]}`}>
                                                {lead.stage.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {lead.expected_close_date || '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => deleteLead(lead.id)}
                                            >
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}