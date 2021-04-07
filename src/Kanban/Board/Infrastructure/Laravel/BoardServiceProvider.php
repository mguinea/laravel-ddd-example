<?php

declare(strict_types=1);

namespace App\Kanban\Board\Infrastructure\Laravel;

use App\Kanban\Board\Domain\BoardRepository;
use App\Kanban\Board\Infrastructure\Persistence\Eloquent\BoardRepository as EloquentBoardRepository;
use Illuminate\Support\ServiceProvider;

class BoardServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->dependencyInjection();
    }

    private function dependencyInjection(): void
    {
        $this->app->bind(
            BoardRepository::class,
            EloquentBoardRepository::class
        );
    }
}
