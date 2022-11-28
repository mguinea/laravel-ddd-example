<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application;

use App\Kanban\Board\Domain\Board;
use App\Shared\Domain\Bus\Query\ResponseInterface;

final class BoardResponse implements ResponseInterface
{
    public function __construct(
        public readonly string $id,
        public readonly string $name
    ) {
    }

    public static function fromBoard(Board $board): self
    {
        return new self(
            $board->id->value(),
            $board->name->value()
        );
    }

    public function jsonSerialize(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name
        ];
    }
}
