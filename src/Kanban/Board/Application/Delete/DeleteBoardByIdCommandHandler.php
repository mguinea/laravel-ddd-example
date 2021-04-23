<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Delete;

use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardNotFound;
use App\Kanban\Board\Domain\BoardRepository;
use App\Shared\Domain\Bus\Command\CommandHandler;

final class DeleteBoardByIdCommandHandler implements CommandHandler
{
    private BoardRepository $repository;

    public function __construct(BoardRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke(DeleteBoardByIdCommand $command): void
    {
        $id = BoardId::fromValue($command->id());
        $board = $this->repository->find($id);

        if (null === $board) {
            throw new BoardNotFound();
        }

        $this->repository->delete($id);
    }
}
