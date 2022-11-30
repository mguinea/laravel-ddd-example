<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Listing;

use App\Kanban\Board\Application\BoardsResponse;
use App\Kanban\Board\Domain\BoardsFinder;
use App\Shared\Domain\Bus\Query\QueryHandlerInterface;
use Mguinea\Criteria\Criteria;

final class SearchBoardsQueryHandler implements QueryHandlerInterface
{
    public function __construct(private BoardsFinder $finder)
    {
    }

    public function __invoke(SearchBoardsQuery $query): BoardsResponse
    {
        $criteria = new Criteria(
            [], // TODO
            [], // TODO
            $query->offset,
            $query->limit
        );

        $boards = $this->finder->__invoke($criteria);

        return BoardsResponse::fromBoards($boards);
    }
}
