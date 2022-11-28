<?php

declare(strict_types=1);

namespace App\Kanban\Board\Infrastructure\Eloquent;

use App\Kanban\Board\Domain\Board;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardAlreadyExists;
use App\Kanban\Board\Domain\BoardRepositoryInterface;
use App\Kanban\Board\Domain\Boards;
use App\Shared\Domain\Criteria\Criteria;
use App\Shared\Infrastructure\Eloquent\EloquentException;
use Exception;
use Illuminate\Support\Facades\DB;

final class BoardRepository implements BoardRepositoryInterface
{
    private BoardModel $model;

    public function __construct(BoardModel $model)
    {
        $this->model = $model;
    }

    /**
     * @throws BoardAlreadyExists
     */
    public function delete(BoardId $id): void
    {
        $board = $this->model->find($id->value());

        if (null === $board) {
            throw new BoardAlreadyExists();
        }

        $board->delete();
    }

    public function find(BoardId $id): ?Board
    {
        $eloquentBoard = $this->model->find($id->value());

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

    /**
     * @throws EloquentException
     */
    public function save(Board $board): void
    {
        $boardModel = $this->model->find($board->id()->value());

        if (null === $boardModel) {
            $boardModel = new BoardModel;
            $boardModel->id = $board->id()->value();
            $boardModel->name = $board->name()->value();
        } else {
            $boardModel->name = $board->name()->value();
        }

        DB::beginTransaction();
        try {
            $boardModel->save();
            DB::commit();
        } catch (Exception $e) {
            DB::rollBack();
            throw new EloquentException(
                $e->getMessage(),
                $e->getCode(),
                $e->getPrevious()
            );
        }
    }

    public function search(Criteria $criteria): Boards
    {
        $eloquentBoards = $this->model->all();

        $boards = $eloquentBoards->map(
            function (BoardModel $eloquentBoard) {
                return $this->toDomain($eloquentBoard);
            }
        )->toArray();

        return new Boards($boards);
    }
}
