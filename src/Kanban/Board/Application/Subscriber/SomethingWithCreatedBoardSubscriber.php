<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Subscriber;

use App\Kanban\Board\Domain\BoardWasCreated;
use App\Shared\Domain\Bus\Event\DomainEventSubscriber;

class SomethingWithCreatedBoardSubscriber implements DomainEventSubscriber
{
    public function __invoke(BoardWasCreated $event): void
    {
        // TODO add here some logic
    }

    public static function subscribedTo(): array
    {
        return [
            BoardWasCreated::class
        ];
    }
}
