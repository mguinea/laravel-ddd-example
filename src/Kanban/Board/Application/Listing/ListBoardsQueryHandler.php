<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Listing;

use App\Kanban\Board\Application\BoardsResponse;
use App\Kanban\Board\Domain\BoardRepository;
use App\Shared\Domain\Bus\Query\QueryHandler;

final class ListBoardsQueryHandler implements QueryHandler
{
    public function __construct(private BoardRepository $repository)
    {
    }

    public function __invoke(ListBoardsQuery $query): BoardsResponse
    {
        $boards = $this->repository->list();

        return BoardsResponse::fromBoards($boards);
    }
}
