<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Domain;

use App\Kanban\Board\Domain\Board;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardName;
use Exception;

final class BoardMother
{
    /**
     * @throws Exception
     */
    public static function create(
        ?BoardId $id = null,
        ?BoardName $name = null
    ): Board
    {
        return Board::fromPrimitives(
            $id?->value() ?? BoardIdMother::create()->value(),
            $name?->value() ?? BoardNameMother::create()->value()
        );
    }
}
