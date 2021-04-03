<?php

declare(strict_types=1);

namespace App\Kanban\Board\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class BoardModel extends Model
{
    use HasFactory;

    protected $connection = 'mysql';
    protected $keyType = 'string';
    protected $primaryKey = 'id';
    protected $table = 'boards';
    public $incrementing = false;
    public $timestamps = false;
}
