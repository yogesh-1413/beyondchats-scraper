<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    protected $fillable = ['title', 'url', 'content', 'updated_content', 'reference_links', 'is_updated','ref_content_1', 'ref_content_2', 'created_at', 'updated_at'];
    protected $casts = [
    'reference_links' => 'array'
];
}
