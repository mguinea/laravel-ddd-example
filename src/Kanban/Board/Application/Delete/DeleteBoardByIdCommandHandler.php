<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Delete;

use App\Kanban\Board\Domain\BoardDeletor;
use App\Kanban\Board\Domain\BoardId;
use App\Shared\Domain\Bus\Command\CommandHandlerInterface;

final class DeleteBoardByIdCommandHandler implements CommandHandlerInterface
{
    public function __construct(private BoardDeletor $deletor)
    {
    }

    public function __invoke(DeleteBoardByIdCommand $command): void
    {
        $id = BoardId::fromValue($command->id);

        $this->deletor->__invoke($id);
    }
}
