<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Http\Controllers\Board;

use App\Kanban\Board\Application\BoardsResponse;
use App\Kanban\Board\Application\Listing\SearchBoardsQuery;
use App\Shared\Domain\Bus\Query\QueryBusInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class SearchBoardsController
{
    public function __construct(private QueryBusInterface $queryBus)
    {
    }

    /**
     * @param Request $request
     * @return JsonResponse
     *
     * example url: v1/kanban/boards?filters=created_at>=2022-01-01&order_by=name&order=desc&limit=5&offset=1
     *
     */
    public function __invoke(Request $request): JsonResponse
    {
        $filters = $request->get('filters');
        $orderBy = $request->get('order_by');
        $order = $request->get('order');
        $limit  = $request->get('limit');
        $offset = $request->get('offset');

        /** @var BoardsResponse $boardsResponse */
        $boardsResponse = $this->queryBus->ask(
            new SearchBoardsQuery(
                $filters,
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
