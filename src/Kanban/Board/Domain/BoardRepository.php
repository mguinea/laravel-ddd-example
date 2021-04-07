<?php

namespace App\Kanban\Board\Domain;

interface BoardRepository
{
    public function delete(BoardId $id): void;

    public function find(BoardId $id): ?Board;

    public function save(Board $board): void;

    public function search(): Boards;
}
