<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Create;

use App\Kanban\Board\Domain\Board;
use App\Kanban\Board\Domain\BoardAlreadyExists;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardName;
use App\Kanban\Board\Domain\BoardRepository;
use App\Shared\Domain\Bus\Command\CommandHandler;
use App\Shared\Domain\Bus\Event\EventBus;

final class CreateBoardCommandHandler implements CommandHandler
{
    public function __construct(
        private BoardRepository $repository,
        private EventBus $eventBus
    ) {
    }

    public function __invoke(CreateBoardCommand $command): void
    {
        $id = BoardId::fromValue($command->id());
        $board = $this->repository->find($id);

        if (null !== $board) {
            throw new BoardAlreadyExists();
        }

        $name = BoardName::fromValue($command->name());
        $board = Board::create($id, $name);
        $this->repository->save($board);
        $this->eventBus->publish(...$board->pullDomainEvents());
    }
}
