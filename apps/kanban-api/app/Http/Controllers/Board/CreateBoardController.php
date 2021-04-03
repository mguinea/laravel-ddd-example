<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Http\Controllers\Board;

use App\Kanban\Board\Application\Create\CreateBoardCommand;
use App\Kanban\Board\Domain\BoardId;
use App\Shared\Domain\Bus\Command\CommandBus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class CreateBoardController
{
    private CommandBus $commandBus;

    public function __construct(CommandBus $commandBus)
    {
        $this->commandBus = $commandBus;
    }

    public function __invoke(Request $request): JsonResponse
    {
        $id = BoardId::random();

        $this->commandBus->dispatch(
            new CreateBoardCommand(
                $id->value(),
                $request->get('name')
            )
        );

        return new JsonResponse(
            [
                'board' => [
                    'id' => $id->value()
                ]
            ],
            Response::HTTP_OK
        );
    }
}
