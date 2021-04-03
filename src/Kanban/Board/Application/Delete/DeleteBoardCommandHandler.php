<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Create;

use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Infrastructure\Persistence\Eloquent\BoardRepository;
use App\Shared\Domain\Bus\Command\CommandHandler;

final class DeleteBoardCommandHandler implements CommandHandler
{
    private BoardRepository $repository;

    public function __construct(BoardRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke(DeleteBoardByIdCommand $command): void
    {
        $id = BoardId::fromValue($command->id());

        $this->repository->delete($id);
    }
}
