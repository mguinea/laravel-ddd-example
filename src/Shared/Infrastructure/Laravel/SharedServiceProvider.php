<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Laravel;

use App\Shared\Domain\Bus\Command\CommandBus;
use App\Shared\Domain\Bus\Query\QueryBus;
use App\Shared\Infrastructure\Bus\Laravel\CommandBus as LaravelCommandBus;
use App\Shared\Infrastructure\Bus\Laravel\QueryBus as LaravelQueryBus;
use Illuminate\Support\ServiceProvider;

final class SharedServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->dependencyInjection();
    }

    private function dependencyInjection(): void
    {
        $this->app->bind(
            CommandBus::class,
            LaravelCommandBus::class
        );

        $this->app->bind(
            QueryBus::class,
            LaravelQueryBus::class
        );
    }
}
