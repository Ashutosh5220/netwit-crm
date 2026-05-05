import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: 'active' | 'inactive' | 'prospect';
    leads_count: number;
    notes_count: number;
}

interface Props {
    clients: {
        data: Client[];
        links: any[];
    };
}

const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    prospect: 'bg-yellow-100 text-yellow-800',
};

export default function Index({ clients }: Props) {
    const deleteClient = (id: number) => {
        if (confirm('Are you sure you want to delete this client?')) {
            router.delete(`/clients/${id}`);
        }
    };

    return (
        <AppLayout>
            <Head title="Clients" />
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold">Clients</h1>
                    <Link href="/clients/create">
                        <Button>+ Add Client</Button>
                    </Link>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leads</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {clients.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                                        No clients yet. <Link href="/clients/create" className="text-blue-500 underline">Add your first client</Link>
                                    </td>
                                </tr>
                            ) : (
                                clients.data.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            <Link href={`/clients/${client.id}`} className="hover:text-blue-600">
                                                {client.name}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{client.company || '—'}</td>
                                        <td className="px-6 py-4 text-gray-500">{client.email || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[client.status]}`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{client.leads_count}</td>
                                        <td className="px-6 py-4 flex gap-2">
                                            <Link href={`/clients/${client.id}/edit`}>
                                                <Button variant="outline" size="sm">Edit</Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => deleteClient(client.id)}
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