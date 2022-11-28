<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

final class BoardFinder
{
    public function __construct(private BoardRepositoryInterface $repository)
    {
    }

    public function __invoke(BoardId $id): Board
    {
        $board = $this->repository->find($id);

        if (null === $board) {
            throw new BoardNotFound();
        }

        return $board;
    }
}
