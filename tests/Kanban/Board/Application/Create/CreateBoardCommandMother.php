<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Create;

use App\Kanban\Board\Application\Create\CreateBoardCommand;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardName;
use Tests\Kanban\Board\Domain\BoardMother;

final class CreateBoardCommandMother
{
    public static function create(
        ?BoardId $id = null,
        ?BoardName $name = null
    ): CreateBoardCommand
    {
        $board = BoardMother::create($id, $name);

        return new CreateBoardCommand(
            $board->id()->value(),
            $board->name()->value()
        );
    }
}
