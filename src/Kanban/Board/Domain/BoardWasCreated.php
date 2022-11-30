<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

use App\Shared\Domain\Bus\Event\AbstractDomainEvent;

final class BoardWasCreated extends AbstractDomainEvent
{
    public function __construct(
        public readonly string $id,
        public readonly string $name,
        string $eventId = null,
        string $occurredOn = null
    ) {
        parent::__construct($id, $eventId, $occurredOn);
    }

    public static function fromPrimitives(
        string $aggregateId,
        array $body,
        string $eventId,
        string $occurredOn
    ): AbstractDomainEvent {
        return new self($aggregateId, $body['name'], $eventId, $occurredOn);
    }

    public static function eventName(): string
    {
        return 'board.was_created';
    }

    public function toPrimitives(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name
        ];
    }
}
