<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Listing;

use App\Kanban\Board\Application\BoardsResponse;
use App\Kanban\Board\Domain\BoardRepository;
use App\Shared\Domain\Bus\Query\QueryHandler;

final class SearchBoardsQueryHandler implements QueryHandler
{
    public function __construct(private BoardRepository $repository)
    {
    }

    public function __invoke(SearchBoardsQuery $query): BoardsResponse
    {
        $boards = $this->repository->search();

        return BoardsResponse::fromBoards($boards);
    }
}
