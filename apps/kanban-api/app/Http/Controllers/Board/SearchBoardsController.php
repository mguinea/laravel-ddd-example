<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Http\Controllers\Board;

use App\Kanban\Board\Application\BoardsResponse;
use App\Kanban\Board\Application\Listing\SearchBoardsQuery;
use App\Shared\Domain\Bus\Query\QueryBus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class SearchBoardsController
{
    public function __construct(private QueryBus $queryBus)
    {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $orderBy = $request->get('order_by');
        $order = $request->get('order');
        $limit  = $request->get('limit');
        $offset = $request->get('offset');

        /** @var BoardsResponse $boardsResponse */
        $boardsResponse = $this->queryBus->ask(
            new SearchBoardsQuery(
                [],
                $orderBy,
                $order,
                $limit,
                $offset
            )
        );

        return new JsonResponse(
            [
                'boards' => $boardsResponse->toArray()
            ],
            Response::HTTP_OK,
            ['Access-Control-Allow-Origin' => '*']
        );
    }
}
