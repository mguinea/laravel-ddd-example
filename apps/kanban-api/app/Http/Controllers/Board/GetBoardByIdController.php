<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Http\Controllers\Board;

use App\Kanban\Board\Application\BoardResponse;
use App\Kanban\Board\Application\Get\GetBoardByIdQuery;
use App\Shared\Domain\Bus\Query\QueryBus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

final class GetBoardByIdController
{
    private QueryBus $queryBus;

    public function __construct(QueryBus $queryBus)
    {
        $this->queryBus = $queryBus;
    }

    public function __invoke(Request $request, string $id): JsonResponse
    {
        /** @var BoardResponse $boardResponse */
        $boardResponse = $this->queryBus->ask(
            new GetBoardByIdQuery($id)
        );

        return new JsonResponse(
            [
                'board' => $boardResponse->toArray()
            ]
        );
    }
}
