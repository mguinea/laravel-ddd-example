<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Get;

use App\Shared\Domain\Bus\Query\Query;

final class GetBoardByIdQuery implements Query
{
    public function __construct(private string $id)
    {
    }

    public function id(): string
    {
        return $this->id;
    }
}
