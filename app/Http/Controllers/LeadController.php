<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Lead;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeadController extends Controller
{
    /**
     * Kanban Board (Primary View)
     */
    public function kanban(): Response
    {
        $leads = Lead::forUser()
            ->with('client')
            ->ordered()
            ->get()
            ->groupBy('stage');

        $stages = collect(Lead::getStages())->mapWithKeys(function (string $label, string $key) use ($leads) {
            $stageLeads = $leads->get($key,collect());
            return [$key => [
                'key' => $key,
                'label' => $label,
                'leads' => $stageLeads,
                'value' => $stageLeads->sum(fn ($l) => (float) $l->value),
                'count' => $stageLeads->count(),
            ]];
        });

        return Inertia::render('Leads/Kanban', [
            'stages' => $stages,
            'stats' => [
                'pipeline_value' => Lead::forUser()->active()->sum('value'),
                'won_value' => Lead::forUser()->where('status', 'won')->sum('value'),
                'active_count' => Lead::forUser()->active()->count(),
            ],
        ]);
    }

    /**
     * List View (Alternative)
     */
    public function index(): Response
    {
        return Inertia::render('Leads/Index', [
            'leads' => Lead::forUser()->with('client')->latest()->paginate(10),
        ]);
    }

    /**
     * Create Form
     */
    public function create(): Response
    {
        return Inertia::render('Leads/Create', [
            'clients' => Client::where('user_id', auth()->id())->select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store New Lead
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id'           => 'required|exists:clients,id',
            'title'               => 'required|string|max:255',
            'value'               => 'nullable|numeric|min:0',
            'stage'               => 'required|in:' . implode(',', array_keys(Lead::getStages())),
            'source'              => 'nullable|string|max:255',
            'expected_close_date' => 'nullable|date',
            'description'         => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();
        $validated['status'] = Lead::deriveStatus($validated['stage']);
        $validated['sort_order'] = Lead::forUser()->where('stage', $validated['stage'])->max('sort_order') + 1;

        Lead::create($validated);

        return redirect()->route('leads.kanban')->with('success', 'Lead created!');
    }

    /**
     * Edit Form
     */
    public function edit(Lead $lead): Response
    {
        $this->checkOwnership($lead);

        return Inertia::render('Leads/Edit', [
            'lead' => $lead->load('client'),
            'clients' => Client::where('user_id', auth()->id())->select('id', 'name')->orderBy('name')->get(),
        ]);
    }

    /**
     * Update Lead
     */
    public function update(Request $request, Lead $lead)
    {
        $this->checkOwnership($lead);

        $validated = $request->validate([
            'client_id'           => 'required|exists:clients,id',
            'title'               => 'required|string|max:255',
            'value'               => 'nullable|numeric|min:0',
            'stage'               => 'required|in:' . implode(',', array_keys(Lead::getStages())),
            'source'              => 'nullable|string|max:255',
            'expected_close_date' => 'nullable|date',
            'description'         => 'nullable|string',
        ]);

        $validated['status'] = Lead::deriveStatus($validated['stage']);

        if ($lead->stage !== $validated['stage']) {
            $validated['sort_order'] = Lead::forUser()->where('stage', $validated['stage'])->max('sort_order') + 1;
        }

        $lead->update($validated);

        return redirect()->route('leads.kanban')->with('success', 'Lead updated!');
    }

    /**
     * Delete Lead
     */
    public function destroy(Lead $lead)
    {
        $this->checkOwnership($lead);
        $lead->delete();

        return redirect()->route('leads.kanban')->with('success', 'Lead deleted!');
    }

        /**
     * Drag & Drop: Move Stage
     */
    public function updateStage(Request $request, Lead $lead)
    {
        $this->checkOwnership($lead);

        $request->validate([
            'stage' => 'required|in:' . implode(',', array_keys(Lead::getStages())),
        ]);

        $lead->update([
            'stage' => $request->stage,
            'status' => Lead::deriveStatus($request->stage),
            'sort_order' => Lead::forUser()->where('stage', $request->stage)->max('sort_order') + 1,
        ]);

        return Inertia::location(url()->previous());
    }

    /**
     * Drag & Drop: Reorder within stage
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'stage' => 'required|in:' . implode(',', array_keys(Lead::getStages())),
            'lead_ids' => 'required|array',
            'lead_ids.*' => 'required|integer|exists:leads,id',
        ]);

        foreach ($request->lead_ids as $index => $leadId) {
            Lead::where('id', $leadId)->where('user_id', auth()->id())->update(['sort_order' => $index]);
        }

        return Inertia::location(url()->previous());
    }

    /**
     * Helper: Verify ownership
     */
    private function checkOwnership(Lead $lead): void
    {
        if ($lead->user_id !== auth()->id()) {
            abort(403);
        }
    }
}