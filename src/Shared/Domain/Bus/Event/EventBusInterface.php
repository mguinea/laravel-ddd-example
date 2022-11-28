<?php

declare(strict_types=1);

namespace App\Shared\Domain\Bus\Event;

interface EventBusInterface
{
    public function publish(DomainEvent ...$events): void;
}
