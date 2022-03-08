<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Update;

use App\Kanban\Board\Application\Update\UpdateBoardCommand;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardName;
use Tests\Kanban\Board\Domain\BoardMother;

final class UpdateBoardCommandMother
{
    public static function create(
        ?BoardId $id = null,
        ?BoardName $name = null
    ): UpdateBoardCommand
    {
        $board = BoardMother::create($id, $name);

        return new UpdateBoardCommand(
            $board->id()->value(),
            $board->name()->value()
        );
    }
}
