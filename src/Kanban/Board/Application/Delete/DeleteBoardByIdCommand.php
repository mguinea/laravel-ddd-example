<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Delete;

use App\Shared\Domain\Bus\Command\CommandInterface;

final class DeleteBoardByIdCommand implements CommandInterface
{
    public function __construct(public readonly string $id)
    {
    }
}
