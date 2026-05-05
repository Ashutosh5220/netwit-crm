<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LeadController;
use App\Http\Controllers\NoteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public route
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

// Protected routes (must be logged in)
Route::middleware(['auth'])->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Clients
    Route::resource('clients', ClientController::class);

    // Leads - Kanban Board (Primary View)
    Route::get('/leads', [LeadController::class, 'kanban'])->name('leads.kanban');
    
    // Leads - List View (Alternative)
    Route::get('/leads/list', [LeadController::class, 'index'])->name('leads.index');
    
    // Leads - Create Form
    Route::get('/leads/create', [LeadController::class, 'create'])->name('leads.create');
    
    // Leads - Store New
    Route::post('/leads', [LeadController::class, 'store'])->name('leads.store');
    
    // Leads - Edit Form
    Route::get('/leads/{lead}/edit', [LeadController::class, 'edit'])->name('leads.edit');
    
    // Leads - Update
    Route::put('/leads/{lead}', [LeadController::class, 'update'])->name('leads.update');
    
    // Leads - Delete
    Route::delete('/leads/{lead}', [LeadController::class, 'destroy'])->name('leads.destroy');
    
    // Leads - Drag & Drop: Move Stage
    Route::patch('/leads/{lead}/stage', [LeadController::class, 'updateStage'])->name('leads.stage.update');
    
    // Leads - Drag & Drop: Reorder within stage
    Route::post('/leads/reorder', [LeadController::class, 'reorder'])->name('leads.reorder');
    
    // API: Get clients for dropdown (used in modals)
    Route::get('/api/clients', [ClientController::class, 'list'])->name('api.clients');

    // Notes
    Route::post('/notes', [NoteController::class, 'store'])->name('notes.store');
    Route::delete('/notes/{note}', [NoteController::class, 'destroy'])->name('notes.destroy');

});

// Auth routes (login, register, etc) - handled by Fortify
require __DIR__.'/settings.php';