<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Subscriber;

use App\Kanban\Board\Domain\BoardWasCreated;
use App\Shared\Domain\Bus\Event\DomainEventSubscriberInterface;

class SomethingWithCreatedBoardSubscriber implements DomainEventSubscriberInterface
{
    public function __invoke(BoardWasCreated $event): void
    {
        // TODO add here some logic in relation with the event
    }

    public static function subscribedTo(): array
    {
        return [
            BoardWasCreated::class
        ];
    }
}
