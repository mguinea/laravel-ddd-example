<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

use App\Shared\Domain\Bus\Event\EventBusInterface;
use Mguinea\Criteria\Criteria;
use Mguinea\Criteria\Filter;
use Mguinea\Criteria\FilterOperator;

final class BoardCreator
{
    public function __construct(
        private BoardRepositoryInterface $repository,
        private EventBusInterface $eventBus
    ) {
    }

    public function __invoke(BoardId $id, BoardName $name): void
    {
        $board = $this->repository->findOneBy(new Criteria([
            new Filter(
                'name',
                FilterOperator::EQUAL,
                $name->value
            )
        ]));

        if (null !== $board) {
            throw new BoardAlreadyExists();
        }

        $board = Board::create($id, $name);
        $this->repository->save($board);
        $this->eventBus->publish(...$board->pullDomainEvents());
    }
}
