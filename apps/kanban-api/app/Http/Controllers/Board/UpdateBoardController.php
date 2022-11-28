<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Http\Controllers\Board;

use App\Kanban\Board\Application\Update\UpdateBoardCommand;
use App\Shared\Domain\Bus\Command\CommandBusInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class UpdateBoardController
{
    public function __construct(private CommandBusInterface $commandBus)
    {
    }

    public function __invoke(Request $request, string $id): JsonResponse
    {
        $this->commandBus->dispatch(
            new UpdateBoardCommand(
                $id,
                $request->get('name')
            )
        );

        return new JsonResponse(
            [
                'board' => [
                    'id' => $id
                ]
            ],
            Response::HTTP_OK,
            ['Access-Control-Allow-Origin' => '*']
        );
    }
}
