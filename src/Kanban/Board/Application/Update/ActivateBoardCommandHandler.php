<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Update;

use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardNotFound;
use App\Kanban\Board\Domain\BoardRepository;
use App\Shared\Domain\Bus\Command\CommandHandler;

final class ActivateBoardCommandHandler implements CommandHandler
{
    private BoardRepository $repository;

    public function __construct(BoardRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke(ActivateBoardCommand $command): void
    {
        $id = BoardId::fromValue($command->id());
        $board = $this->repository->find($id);

        if (null === $board) {
            throw new BoardNotFound();
        }

        $board->activate();
        $this->repository->save($board);
    }
}

