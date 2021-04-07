<?php

declare(strict_types=1);

namespace App\Kanban\Board\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

final class BoardModel extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    protected $primaryKey = 'id';
    protected $table = 'boards';
    public $incrementing = false;
    public $timestamps = false;

    public function __construct(array $attributes = [])
    {
        if (app()->environment() === 'testing') {
            $this->setConnection('sqlite');
        } else {
            $this->setConnection('mysql');
        }

        parent::__construct($attributes);
    }

    protected static function newFactory()
    {
        return BoardModelFactory::new();
    }
}
