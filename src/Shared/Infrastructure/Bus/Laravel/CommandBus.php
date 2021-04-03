<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Bus\Laravel;

use App\Shared\Domain\Bus\Command\Command;
use App\Shared\Domain\Bus\Command\CommandBus as CommandBusInterface;
use Exception;
use Illuminate\Bus\Dispatcher;

class CommandBus implements CommandBusInterface
{
    /** @var Dispatcher */
    private $commandBus;

    public function __construct(Dispatcher $commandBus)
    {
        $this->commandBus = $commandBus;
    }

    public function dispatch(Command $command): void
    {
        $handler = $this->resolveHandler($command);

        $job = (new CommandJob($handler, $command));
            // ->onConnection('database')
            // ->onQueue('default')
            // ->delay(
            //     now()->addMinutes(1)
            // );

        //try {
            $this->commandBus->dispatch($job);
        //} catch (Exception $exception) {
        //    throw $exception->getPrevious() ?? $exception;
        //}
    }

    private function resolveHandler(Command $command)
    {
        $commandClassName = get_class($command);
        $handlerClassName = $commandClassName . 'Handler';

        if (false === class_exists($handlerClassName)) {
            throw new \Exception('Handler ' . $handlerClassName . ' not found');
        }

        return app()->get($handlerClassName);
    }
}
