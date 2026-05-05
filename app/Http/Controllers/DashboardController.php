<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Lead;
use App\Models\Note;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $user = auth()->id();

        // 1. Main Stats
        $stats = [
            'total_clients'   => Client::where('user_id', $user)->count(),
            'active_clients'  => Client::where('user_id', $user)->where('status', 'active')->count(),
            'total_leads'     => Lead::where('user_id', $user)->count(),
            'won_leads'       => Lead::where('user_id', $user)->where('stage', 'closed_won')->count(),
            'total_notes'     => Note::where('user_id', $user)->count(),
            'pipeline_value'  => Lead::where('user_id', $user)->whereNotIn('stage', ['closed_lost'])->sum('value'),
        ];

        // 2. Pie Chart Data (Leads by Stage)
        $leadStageData = Lead::where('user_id', $user)
            ->selectRaw('stage, count(*) as count')
            ->groupBy('stage')
            ->pluck('count', 'stage')
            ->toArray();

        $pieChartData = [];
        foreach ($leadStageData as $stage => $count) {
            $pieChartData[] = [
                'name' => ucfirst(str_replace('_', ' ', $stage)),
                'value' => $count
            ];
        }

        // 3. Line Chart Data (Client Growth last 6 months)
        $clientGrowthData = Client::where('user_id', $user)
            ->where('created_at', '>=', now()->subMonths(6))
            ->selectRaw("strftime('%Y-%m', created_at) as month, count(*) as count")
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month')
            ->toArray();

        $lineChartData = [];
        foreach ($clientGrowthData as $month => $count) {
            $lineChartData[] = [
                'month' => date('M Y', strtotime($month . '-01')),
                'clients' => $count
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'pieChartData' => $pieChartData,
            'lineChartData' => $lineChartData,
            'recent_clients' => Client::where('user_id', $user)->latest()->take(5)->get(),
            'recent_leads'   => Lead::where('user_id', $user)->with('client')->latest()->take(5)->get(),
        ]);
    }
}