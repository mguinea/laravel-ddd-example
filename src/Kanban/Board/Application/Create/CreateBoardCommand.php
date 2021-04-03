<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Create;

use App\Shared\Domain\Bus\Command\Command;

final class CreateBoardCommand implements Command
{
    private string $id;
    private string $name;

    public function __construct(string $id, string $name)
    {
        $this->id = $id;
        $this->name = $name;
    }

    public function id(): string
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function commandName(): string
    {
        return 'kanban.board.create';
    }
}
