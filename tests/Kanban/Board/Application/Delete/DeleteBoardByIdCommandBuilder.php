<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Delete;

use App\Kanban\Board\Application\Delete\DeleteBoardByIdCommand;
use Tests\Kanban\Board\Domain\BoardIdBuilder;

final class DeleteBoardByIdCommandBuilder
{
    private string $id;

    public function __construct()
    {
        $this->id = ((new BoardIdBuilder())->build())->value();
    }

    public function withId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function build(): DeleteBoardByIdCommand
    {
        return new DeleteBoardByIdCommand(
            $this->id
        );
    }
}
