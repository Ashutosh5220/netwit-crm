import { usePage, Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// --- Color Palette for Pie Chart ---
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#6366f1'];

// --- Reusable Stat Card Component ---
function StatCard({ title, value, bgColor, textColor }: { title: string; value: number | string; bgColor: string; textColor: string }) {
    return (
        <div className={`${bgColor} p-4 rounded-lg shadow-sm border border-gray-100`}>
            <p className="text-sm text-gray-600">{title}</p>
            <p className={`text-2xl font-bold mt-1 ${textColor}`}>{value}</p>
        </div>
    );
}

export default function Dashboard() {
    // ✅ FIX: Use 'any' to avoid strict TypeScript errors with Inertia props
    const props = usePage().props as any;

    const stats = props.stats || {};
    const pieChartData = props.pieChartData || [];
    const lineChartData = props.lineChartData || [];
    const recent_clients = props.recent_clients || [];
    const recent_leads = props.recent_leads || [];

    const formatCurrency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount || 0);

    const stageColors: Record<string, string> = {
        new: 'bg-blue-100 text-blue-800',
        contacted: 'bg-yellow-100 text-yellow-800',
        proposal: 'bg-purple-100 text-purple-800',
        negotiation: 'bg-orange-100 text-orange-800',
        closed_won: 'bg-green-100 text-green-800',
        closed_lost: 'bg-red-100 text-red-800',
    };

    return (
        <AppLayout> {/* ✅ FIX: Added Layout back so sidebar shows */}
            <Head title="Dashboard" />
            
            <div className="p-8">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

                {/* --- TOP STATS CARDS --- */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <StatCard title="Total Clients" value={stats.total_clients ?? 0} bgColor="bg-blue-50" textColor="text-blue-700" />
                    <StatCard title="Active Clients" value={stats.active_clients ?? 0} bgColor="bg-green-50" textColor="text-green-700" />
                    <StatCard title="Total Leads" value={stats.total_leads ?? 0} bgColor="bg-purple-50" textColor="text-purple-700" />
                    <StatCard title="Won Leads" value={stats.won_leads ?? 0} bgColor="bg-emerald-50" textColor="text-emerald-700" />
                    <StatCard title="Total Notes" value={stats.total_notes ?? 0} bgColor="bg-yellow-50" textColor="text-yellow-700" />
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <p className="text-sm text-gray-500">Pipeline Value</p>
                        <p className="text-xl font-bold text-gray-900 mt-1">{formatCurrency(stats.pipeline_value)}</p>
                    </div>
                </div>

                {/* --- CHARTS SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    
                    {/* Line Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Client Growth (Last 6 Months)</h3>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                    <XAxis dataKey="month" stroke="#9ca3af" fontSize={12} />
                                    <YAxis stroke="#9ca3af" fontSize={12} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="clients" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Leads by Stage</h3>
                        <div className="h-64 flex items-center justify-center">
                            {pieChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieChartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} (${(percent ?? 100).toFixed(0)}%)`}
                                        >
                                            {pieChartData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-gray-400">No lead data available yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- RECENT ACTIVITY TABLES --- */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Clients */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">Recent Clients</h3>
                            <Link href="/clients" className="text-sm text-blue-600 hover:underline">View all →</Link>
                        </div>
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Company</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_clients.map((client: any) => (
                                    <tr key={client.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{client.name}</td>
                                        <td className="px-6 py-4">{client.company || '—'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                {client.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Recent Leads */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-800">Recent Leads</h3>
                            <Link href="/leads" className="text-sm text-blue-600 hover:underline">View all →</Link>
                        </div>
                        <table className="w-full text-sm text-left text-gray-500">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3">Lead Title</th>
                                    <th className="px-6 py-3">Client</th>
                                    <th className="px-6 py-3">Stage</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent_leads.map((lead: any) => (
                                    <tr key={lead.id} className="bg-white border-b hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{lead.title}</td>
                                        <td className="px-6 py-4">{lead.client?.name || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${stageColors[lead.stage] || 'bg-gray-100 text-gray-700'}`}>
                                                {lead.stage.replace('_', ' ')}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}