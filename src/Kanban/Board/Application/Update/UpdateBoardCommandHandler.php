<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Update;

use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardName;
use App\Kanban\Board\Domain\BoardUpdater;
use App\Shared\Domain\Bus\Command\CommandHandlerInterface;

final class UpdateBoardCommandHandler implements CommandHandlerInterface
{
    public function __construct(private BoardUpdater $updater)
    {
    }

    public function __invoke(UpdateBoardCommand $command): void
    {
        $id = BoardId::fromValue($command->id());
        $name = BoardName::fromValue($command->name());

        $this->updater->__invoke($id, $name);
    }
}
