<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Delete;

use App\Kanban\Board\Application\Delete\DeleteBoardByIdCommand;
use App\Kanban\Board\Domain\BoardId;
use Tests\Kanban\Board\Domain\BoardMother;

final class DeleteBoardByIdCommandMother
{
    public static function create(?BoardId $id = null): DeleteBoardByIdCommand
    {
        $board = BoardMother::create($id);

        return new DeleteBoardByIdCommand(
            $board->id()->value()
        );
    }
}
