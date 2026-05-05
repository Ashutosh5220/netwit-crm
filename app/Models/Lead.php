<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'title',
        'value',
        'stage',
        'status',
        'sort_order',
        'source',
        'expected_close_date',
        'description',
    ];

    protected $casts = [
        'expected_close_date' => 'date',
        'value' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    // ─── Pipeline Stages (Kanban Columns) ───────────────────────────

    public static function getStages(): array
    {
        return [
            'new' => 'New',
            'contacted' => 'Contacted',
            'proposal' => 'Proposal',
            'negotiation' => 'Negotiation',
            'closed_won' => 'Closed Won',
            'closed_lost' => 'Closed Lost',
        ];
    }

    // ─── Status Options ─────────────────────────────────────────────

    public static function getStatuses(): array
    {
        return [
            'active' => 'Active',
            'won' => 'Won',
            'lost' => 'Lost',
        ];
    }

    // ─── Auto-derive status from stage ──────────────────────────────

    public static function deriveStatus(string $stage): string
    {
        return match ($stage) {
            'closed_won' => 'won',
            'closed_lost' => 'lost',
            default => 'active',
        };
    }

    // ─── Relationships ──────────────────────────────────────────────

    // Lead belongs to a user
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Lead belongs to a client
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    // Lead has many notes
    public function notes()
    {
        return $this->hasMany(Note::class);
    }

    // ─── Scopes ─────────────────────────────────────────────────────

    public function scopeForUser($query)
    {
        return $query->where('user_id', auth()->id());
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('sort_order')->orderByDesc('created_at');
    }
}