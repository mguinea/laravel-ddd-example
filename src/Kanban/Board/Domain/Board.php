<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

final class Board
{
    private BoardId $id;
    private string $name;

    public function __construct(BoardId $id, string $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public static function fromPrimitives(string $id, string $name): self
    {
        return new self(
            BoardId::fromValue($id),
            $name
        );
    }

    public function id(): BoardId
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }
}
