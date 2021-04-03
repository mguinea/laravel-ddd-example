<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Search;

use App\Kanban\Board\Application\BoardsResponse;
use App\Kanban\Board\Domain\BoardRepository;
use App\Shared\Domain\Bus\Query\QueryHandler;

final class SearchBoardsQueryHandler implements QueryHandler
{
    private BoardRepository $repository;

    public function __construct(BoardRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke(SearchBoardsQuery $query): BoardsResponse
    {
        $boards = $this->repository->search();

        return BoardsResponse::fromBoards($boards);
    }
}
