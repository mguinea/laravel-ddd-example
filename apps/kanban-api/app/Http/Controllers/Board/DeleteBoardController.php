<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Http\Controllers\Board;

use App\Kanban\Board\Application\Delete\DeleteBoardByIdCommand;
use App\Shared\Domain\Bus\Command\CommandBus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class DeleteBoardController
{
    private CommandBus $commandBus;

    public function __construct(CommandBus $commandBus)
    {
        $this->commandBus = $commandBus;
    }

    public function __invoke(Request $request, string $id): JsonResponse
    {
        $this->commandBus->dispatch(
            new DeleteBoardByIdCommand($id)
        );

        return new JsonResponse(
            null,
            Response::HTTP_NO_CONTENT
        );
    }
}
