<?php

namespace App\Kanban\Board\Domain;

use Mguinea\Criteria\Criteria;

interface BoardRepositoryInterface
{
    public function delete(BoardId $id): void;

    public function findBy(Criteria $criteria): Boards;

    public function findOneBy(Criteria $criteria): ?Board;

    public function save(Board $board): void;
}
