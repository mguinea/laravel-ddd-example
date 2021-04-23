<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Get;

use App\Kanban\Board\Application\Get\GetBoardByIdQuery;
use Tests\Kanban\Board\Domain\BoardIdBuilder;
use Tests\Shared\Domain\Builder;

final class GetBoardByIdQueryBuilder implements Builder
{
    private string $id;

    public function __construct()
    {
        $this->id = ((new BoardIdBuilder())->build())->value();
    }

    public function withId(string $id): self
    {
        $this->id = $id;

        return $this;
    }

    public function build(): GetBoardByIdQuery
    {
        return new GetBoardByIdQuery($this->id);
    }
}
