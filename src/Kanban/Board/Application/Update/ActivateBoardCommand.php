<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Update;

use App\Shared\Domain\Bus\Command\Command;

final class ActivateBoardCommand implements Command
{
    public function __construct(private string $id)
    {
    }

    public function id(): string
    {
        return $this->id;
    }
}
