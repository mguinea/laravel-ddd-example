<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Bus\Laravel;

use App\Shared\Domain\Bus\Command\Command;
use App\Shared\Domain\Bus\Command\CommandHandler;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CommandJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var CommandHandler */
    private $handler;

    /** @var Command */
    private $command;

    public function __construct(CommandHandler $handler, Command $command)
    {
        $this->handler = $handler;
        $this->command = $command;
    }

    public function handle()
    {
        return $this->handler->__invoke($this->command);
    }
}
