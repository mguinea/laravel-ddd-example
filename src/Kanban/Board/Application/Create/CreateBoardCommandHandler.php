<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Create;

use App\Kanban\Board\Domain\Board;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Infrastructure\Persistence\Eloquent\BoardRepository;
use App\Shared\Domain\Bus\Command\CommandHandler;

final class CreateBoardCommandHandler implements CommandHandler
{
    private BoardRepository $repository;

    public function __construct(BoardRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke(CreateBoardCommand $command): void
    {
        $id = BoardId::fromValue($command->id());
        $board = Board::fromPrimitives(
            $id->value(),
            $command->name()
        );

        $this->repository->save($board);
    }
}
