<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Note extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'client_id',
        'title',
        'content',
        'type',
    ];

    // Note belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Note belongs to a client
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}