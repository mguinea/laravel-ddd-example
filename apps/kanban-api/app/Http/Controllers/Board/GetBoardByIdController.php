<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Http\Controllers\Board;

use App\Kanban\Board\Application\BoardResponse;
use App\Kanban\Board\Application\Get\GetBoardByIdQuery;
use App\Shared\Domain\Bus\Query\QueryBusInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class GetBoardByIdController
{
    public function __construct(private QueryBusInterface $queryBus)
    {
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
            ],
            Response::HTTP_OK,
            ['Access-Control-Allow-Origin' => '*']
        );
    }
}
