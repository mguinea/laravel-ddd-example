<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Update;

use App\Kanban\Board\Application\Update\UpdateBoardCommand;
use Tests\Kanban\Board\Domain\BoardBuilder;

final class UpdateBoardCommandBuilder
{
    /** @var string */
    private $id;

    /** @var string */
    private $name;

    public function __construct()
    {
        $board = (new BoardBuilder())->build();
        $this->id = $board->id()->value();
        $this->name = $board->name()->value();
    }

    public function withId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function withName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function build(): UpdateBoardCommand
    {
        return new UpdateBoardCommand(
            $this->id,
            $this->name
        );
    }
}
