<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

use App\Shared\Domain\AbstractCollection;

final class Boards extends AbstractCollection
{
    protected function type(): string
    {
        return Board::class;
    }
}
