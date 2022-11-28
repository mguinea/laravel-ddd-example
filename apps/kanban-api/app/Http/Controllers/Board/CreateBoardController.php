<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Http\Controllers\Board;

use App\Kanban\Board\Application\Create\CreateBoardCommand;
use App\Shared\Domain\Bus\Command\CommandBusInterface;
use App\Shared\Domain\UuidGeneratorInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

final class CreateBoardController
{
    public function __construct(
        private CommandBusInterface $commandBus,
        private UuidGeneratorInterface $uuidGenerator
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $id = $request->get('id', $this->uuidGenerator->generate());

        $this->commandBus->dispatch(
            new CreateBoardCommand(
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
