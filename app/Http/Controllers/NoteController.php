<?php

namespace App\Http\Controllers;

use App\Models\Note;
use App\Models\Client;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoteController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'title'     => 'required|string|max:255',
            'content'   => 'required|string',
            'type'      => 'required|in:note,call,email,meeting',
        ]);

        $validated['user_id'] = auth()->id();

        Note::create($validated);

        return back()->with('success', 'Note added successfully!');
    }

    public function destroy(Note $note)
    {
        $this->authorize('delete', $note);
        $note->delete();

        return back()->with('success', 'Note deleted successfully!');
    }
}