<?php

declare(strict_types=1);

namespace App\Kanban\Board\Infrastructure\Persistence\Eloquent;

use App\Kanban\Board\Domain\Board;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardRepository as BoardRepositoryInterface;
use App\Kanban\Board\Domain\Boards;

final class BoardRepository implements BoardRepositoryInterface
{
    private BoardModel $model;

    public function __construct(BoardModel $model)
    {
        $this->model = $model;
    }

    public function delete(BoardId $id): void
    {
        // TODO: Implement delete() method.
    }

    public function find($id): ?Board
    {
        $eloquentBoard = $this->model->find($id);

        if (null === $eloquentBoard) {
            return null;
        }

        return $this->toDomain($eloquentBoard);
    }

    private function toDomain(BoardModel $eloquentBoardModel): Board
    {
        return Board::fromPrimitives(
            $eloquentBoardModel->id,
            $eloquentBoardModel->name
        );
    }

    public function save(Board $board): void
    {
    }

    //public function search(Criteria $criteria): array
    public function search(): Boards
    {
        return new Boards(
            [
                new Board(BoardId::random(), 'board1'),
                new Board(BoardId::random(), 'board2')
            ]
        );
    }
}
