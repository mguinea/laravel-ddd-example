<?php

namespace Apps\KanbanApi\Providers;

use App\Shared\Domain\Bus\Command\CommandBusInterface;
use App\Shared\Domain\Bus\Event\DomainEventSubscriberInterface;
use App\Shared\Domain\Bus\Event\EventBusInterface;
use App\Shared\Domain\Bus\Query\QueryBusInterface;
use App\Shared\Domain\UuidGeneratorInterface;
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
            EventBusInterface::class,
            function ($app) {
                return new MessengerEventBus($app->tagged('domain_event_subscriber'));
            }
        );

        $this->app->bind(
            QueryBusInterface::class,
            function ($app) {
                return new MessengerQueryBus($app->tagged('query_handler'));
            }
        );

        $this->app->bind(
            CommandBusInterface::class,
            function ($app) {
                return new MessengerCommandBus($app->tagged('command_handler'));
            }
        );

        $this->app->bind(
            UuidGeneratorInterface::class,
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
