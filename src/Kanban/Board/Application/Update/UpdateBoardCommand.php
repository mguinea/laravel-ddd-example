<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Update;

use App\Shared\Domain\Bus\Command\CommandInterface;

final class UpdateBoardCommand implements CommandInterface
{
    public function __construct(public readonly string $id, public readonly string $name)
    {
    }
}
