<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Domain;

use App\Kanban\Board\Domain\BoardId;
use App\Shared\Domain\ValueObject\UuidValueObject;

final class BoardIdMother
{
    public static function create(?string $value = null): BoardId
    {
        return BoardId::fromValue($value ?? UuidValueObject::random()->value());
    }
}
