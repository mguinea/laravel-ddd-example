<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Get;

use App\Kanban\Board\Application\BoardResponse;
use App\Kanban\Board\Domain\BoardFinder;
use App\Kanban\Board\Domain\BoardId;
use App\Shared\Domain\Bus\Query\QueryHandlerInterface;

final class GetBoardByIdQueryHandler implements QueryHandlerInterface
{
    public function __construct(private BoardFinder $finder)
    {
    }

    public function __invoke(GetBoardByIdQuery $query): BoardResponse
    {
        $id = BoardId::fromValue($query->id);
        $board = $this->finder->__invoke($id);

        return BoardResponse::fromBoard($board);
    }
}
