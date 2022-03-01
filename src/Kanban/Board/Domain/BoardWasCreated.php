<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

use App\Shared\Domain\Bus\Event\DomainEvent;

final class BoardWasCreated extends DomainEvent
{
    public function __construct(
        private string $id,
        private string $name,
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
    ): DomainEvent {
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

    public function id(): string
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }
}
