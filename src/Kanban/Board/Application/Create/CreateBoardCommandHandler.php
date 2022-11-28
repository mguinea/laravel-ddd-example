<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Create;

use App\Kanban\Board\Domain\BoardCreator;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardName;
use App\Shared\Domain\Bus\Command\CommandHandlerInterface;

final class CreateBoardCommandHandler implements CommandHandlerInterface
{
    public function __construct(private BoardCreator $creator) {
    }

    public function __invoke(CreateBoardCommand $command): void
    {
        $id = BoardId::fromValue($command->id);
        $name = BoardName::fromValue($command->name);

        $this->creator->__invoke($id, $name);
    }
}
