<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Listing;

use App\Kanban\Board\Application\BoardsResponse;
use App\Kanban\Board\Domain\BoardRepository;
use App\Shared\Domain\Bus\Query\QueryHandler;
use App\Shared\Domain\Criteria\Criteria;
use App\Shared\Domain\Criteria\Filters;
use App\Shared\Domain\Criteria\Order;

final class SearchBoardsQueryHandler implements QueryHandler
{
    public function __construct(private BoardRepository $repository)
    {
    }

    public function __invoke(SearchBoardsQuery $query): BoardsResponse
    {
        $criteria = new Criteria(
            new Filters(),
            new Order(),
            $query->offset(),
            $query->limit()
        );

        $boards = $this->repository->search($criteria);

        return BoardsResponse::fromBoards($boards);
    }
}
