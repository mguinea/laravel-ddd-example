<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Create;

use App\Kanban\Board\Application\Create\CreateBoardCommand;
use Tests\Kanban\Board\Domain\BoardBuilder;

final class CreateBoardCommandBuilder
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

    public function build(): CreateBoardCommand
    {
        return new CreateBoardCommand(
            $this->id,
            $this->name
        );
    }
}
