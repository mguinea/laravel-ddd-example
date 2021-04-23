<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Create;

use App\Kanban\Board\Domain\Board;
use App\Kanban\Board\Domain\BoardAlreadyExists;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardName;
use App\Kanban\Board\Domain\BoardRepository;
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
        $board = $this->repository->find($id);

        if (null !== $board) {
            throw new BoardAlreadyExists();
        }

        $name = BoardName::fromValue($command->name());

        $board = Board::fromPrimitives(
            $id->value(),
            $name->value()
        );

        $this->repository->save($board);
    }
}
