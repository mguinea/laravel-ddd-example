<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

final class BoardUpdater
{
    public function __construct(private BoardRepositoryInterface $repository)
    {
    }

    public function __invoke(BoardId $id, BoardName $name): void
    {
        $board = $this->repository->findOneBy($id);

        if (null === $board) {
            throw new BoardNotFound();
        }

        $board = Board::fromPrimitives(
            $id->value(),
            $name->value()
        );

        $this->repository->save($board);
    }
}
