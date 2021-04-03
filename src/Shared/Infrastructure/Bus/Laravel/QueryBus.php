<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Bus\Laravel;

use App\Shared\Domain\Bus\Query\Query;
use App\Shared\Domain\Bus\Query\QueryBus as QueryBusInterface;
use App\Shared\Domain\Bus\Query\Response;
use Exception;
use Illuminate\Bus\Dispatcher;
use Illuminate\Foundation\Application;

class QueryBus implements QueryBusInterface
{
    private Dispatcher $queryBus;
    private Application $app;

    public function __construct(Dispatcher $queryBus, Application $app)
    {
        $this->queryBus = $queryBus;
        $this->app = $app;
    }

    public function ask(Query $query): ?Response
    {
        $handler = $this->resolveHandler($query);

        $job = new QueryJob(
            $handler,
            $query
        );

        try {
            return $this->queryBus->dispatchNow($job);
        } catch (Exception $exception) {
            throw $exception->getPrevious() ?? $exception;
        }
    }

    private function resolveHandler(Query $query)
    {
        $queryClassName = get_class($query);
        $handlerClassName = $queryClassName . 'Handler';

        if (false === class_exists($handlerClassName)) {
            throw new QueryBusException('Handler ' . $handlerClassName . ' not found');
        }

        return $this->app->make($handlerClassName);
    }
}
