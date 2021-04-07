<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Get;

use App\Shared\Domain\Bus\Query\Query;

final class GetBoardByIdQuery implements Query
{
    private string $id;

    public function __construct(string $id)
    {
        $this->id = $id;
    }

    public function id(): string
    {
        return $this->id;
    }

    public function queryName(): string
    {
        return 'kanban.board.get_by_id';
    }
}
