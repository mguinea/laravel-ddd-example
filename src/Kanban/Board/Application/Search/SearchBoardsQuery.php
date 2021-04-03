<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Search;

use App\Shared\Domain\Bus\Query\Query;

final class SearchBoardsQuery implements Query
{
    public function queryName(): string
    {
        return 'kanban.board.search';
    }
}
