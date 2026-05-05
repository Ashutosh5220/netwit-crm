<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'email',
        'phone',
        'company',
        'website',
        'status',
        'address',
    ];

    // Client belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Client has many leads
    public function leads()
    {
        return $this->hasMany(Lead::class);
    }

    // Client has many notes
    public function notes()
    {
        return $this->hasMany(Note::class);
    }
}