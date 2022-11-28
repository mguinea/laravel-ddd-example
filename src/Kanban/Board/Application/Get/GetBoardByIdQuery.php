<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Get;

use App\Shared\Domain\Bus\Query\QueryInterface;

final class GetBoardByIdQuery implements QueryInterface
{
    public function __construct(public readonly string $id)
    {
    }
}
