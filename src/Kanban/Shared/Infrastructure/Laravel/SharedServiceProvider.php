<?php

declare(strict_types=1);

namespace App\Kanban\Shared\Infrastructure\Laravel;

use Illuminate\Support\ServiceProvider;

final class SharedServiceProvider extends ServiceProvider
{
    public function boot()
    {
        $this->loadMigrationsFrom(__DIR__ . '/database/migrations');
    }
}
