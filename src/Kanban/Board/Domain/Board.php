<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

use App\Shared\Domain\Aggregate\AggregateRoot;

final class Board extends AggregateRoot
{
    public function __construct(
        public readonly BoardId $id,
        public readonly BoardName $name
    ) {
    }

    public static function fromPrimitives(string $id, string $name): self
    {
        return new self(
            BoardId::fromValue($id),
            BoardName::fromValue($name)
        );
    }

    public static function create(BoardId $id, BoardName $name): self
    {
        $board = new self($id, $name);
        $board->record(new BoardWasCreated($id->value, $name->value));

        return $board;
    }
}
