<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Http\Controllers\Board;

use App\Kanban\Board\Application\BoardsResponse;
use App\Kanban\Board\Application\Search\SearchBoardsQuery;
use App\Shared\Domain\Bus\Query\QueryBus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class SearchBoardsController
{
    private QueryBus $queryBus;

    public function __construct(QueryBus $queryBus)
    {
        $this->queryBus = $queryBus;
    }

    public function __invoke(Request $request): JsonResponse
    {
        /** @var BoardsResponse $boardsResponse */
        $boardsResponse = $this->queryBus->ask(
            new SearchBoardsQuery()
        );

        return new JsonResponse(
            [
                'boards' => $boardsResponse->toArray()
            ],
            200,
            ['Access-Control-Allow-Origin' => '*']
        );
    }
}
