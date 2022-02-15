<?php

namespace Apps\KanbanApi\Providers;

use App\Shared\Domain\Bus\Command\CommandBus;
use App\Shared\Domain\Bus\Event\EventBus;
use App\Shared\Domain\Bus\Query\QueryBus;
use App\Shared\Domain\UuidGenerator;
use App\Shared\Infrastructure\Bus\Messenger\MessengerCommandBus;
use App\Shared\Infrastructure\Bus\Messenger\MessengerEventBus;
use App\Shared\Infrastructure\Bus\Messenger\MessengerQueryBus;
use App\Shared\Infrastructure\RamseyUuidGenerator;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(
            EventBus::class,
            function ($app) {
                return new MessengerEventBus($app->tagged('domain_event_subscriber'));
            }
        );

        $this->app->bind(
            QueryBus::class,
            function ($app) {
                return new MessengerQueryBus($app->tagged('query_handler'));
            }
        );

        $this->app->bind(
            CommandBus::class,
            function ($app) {
                return new MessengerCommandBus($app->tagged('command_handler'));
            }
        );


        $this->app->bind(
            UuidGenerator::class,
            RamseyUuidGenerator::class
        );
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->loadMigrationsFrom(__DIR__ . '/../../database/migrations');
    }
}
