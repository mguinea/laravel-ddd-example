<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

final class BoardDeletor
{
    public function __construct(private BoardRepositoryInterface $repository)
    {
    }

    public function __invoke(BoardId $id): void
    {
        $id = BoardId::fromValue($id);
        $board = $this->repository->find($id);

        if (null === $board) {
            throw new BoardNotFound();
        }

        $this->repository->delete($id);
    }
}
