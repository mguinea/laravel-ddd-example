<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Get;

use App\Kanban\Board\Application\Get\GetBoardByIdQuery;
use App\Kanban\Board\Domain\BoardId;
use Tests\Kanban\Board\Domain\BoardMother;

final class GetBoardByIdQueryMother
{
    public static function create(?BoardId $id = null): GetBoardByIdQuery
    {
        $board = BoardMother::create($id);

        return new GetBoardByIdQuery(
            $board->id()->value()
        );
    }
}
