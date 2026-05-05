<?php

namespace App\Http\Controllers;

use App\Models\Client;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::where('user_id', auth()->id())
            ->withCount(['leads', 'notes'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'nullable|email|max:255',
            'phone'   => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'status'  => 'required|in:active,inactive,prospect',
            'address' => 'nullable|string',
        ]);

        $validated['user_id'] = auth()->id();

        Client::create($validated);

        return redirect()->route('clients.index')
            ->with('success', 'Client created successfully!');
    }

    public function show(Client $client)
    {
        if ($client->user_id !== auth()->id()) {
            abort(403);
        }

        $client->load(['leads', 'notes']);

        return Inertia::render('Clients/Show', [
            'client' => $client,
        ]);
    }

    public function edit(Client $client)
    {
        if ($client->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    public function update(Request $request, Client $client)
    {
        if ($client->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'nullable|email|max:255',
            'phone'   => 'nullable|string|max:20',
            'company' => 'nullable|string|max:255',
            'website' => 'nullable|url|max:255',
            'status'  => 'required|in:active,inactive,prospect',
            'address' => 'nullable|string',
        ]);

        $client->update($validated);

        return redirect()->route('clients.index')
            ->with('success', 'Client updated successfully!');
    }

    public function destroy(Client $client)
    {
        if ($client->user_id !== auth()->id()) {
            abort(403);
        }

        $client->delete();

        return redirect()->route('clients.index')
            ->with('success', 'Client deleted successfully!');
    }

    // ─── API Endpoint for Kanban Modal Dropdown ─────────────────────

    public function list(): JsonResponse
    {
        return response()->json(
            Client::where('user_id', auth()->id())
                ->select('id', 'name')
                ->orderBy('name')
                ->get()
        );
    }
}