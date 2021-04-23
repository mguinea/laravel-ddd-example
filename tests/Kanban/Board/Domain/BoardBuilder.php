<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Domain;

use App\Kanban\Board\Domain\Board;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardName;
use Tests\Shared\Domain\Builder;

final class BoardBuilder implements Builder
{
    private BoardId $id;
    private BoardName $name;

    public function __construct()
    {
        $this->id = (new BoardIdBuilder())->build();
        $this->name = (new BoardNameBuilder())->build();
    }

    public function withId(BoardId $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function withName(BoardName $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function build(): Board
    {
        return new Board($this->id, $this->name);
    }
}
