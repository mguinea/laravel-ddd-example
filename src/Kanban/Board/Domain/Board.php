<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

final class Board
{
    public function __construct(
        private BoardId $id,
        private BoardName $name
    ) {
    }

    public static function fromPrimitives(string $id, string $name): self
    {
        return new self(
            BoardId::fromValue($id),
            BoardName::fromValue($name)
        );
    }

    public function id(): BoardId
    {
        return $this->id;
    }

    public function name(): BoardName
    {
        return $this->name;
    }
}
