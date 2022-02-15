<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Delete;

use App\Shared\Domain\Bus\Command\Command;

final class DeleteBoardByIdCommand implements Command
{
    public function __construct(private string $id)
    {
    }

    public function id(): string
    {
        return $this->id;
    }
}
