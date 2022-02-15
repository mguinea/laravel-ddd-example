<?php

namespace App\Kanban\Board\Domain;

interface BoardRepository
{
    public function delete(BoardId $id): void;

    public function find(BoardId $id): ?Board;

    public function list(): Boards;

    public function save(Board $board): void;
}
