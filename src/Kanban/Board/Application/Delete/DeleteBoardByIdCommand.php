<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Delete;

use App\Shared\Domain\Bus\Command\Command;

final class DeleteBoardByIdCommand implements Command
{
    private string $id;

    public function __construct(string $id)
    {
        $this->id = $id;
    }

    public function id(): string
    {
        return $this->id;
    }

    public function commandName(): string
    {
        return 'kanban.board.delete';
    }
}
