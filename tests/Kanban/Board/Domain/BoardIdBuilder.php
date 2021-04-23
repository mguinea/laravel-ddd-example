<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Domain;

use App\Kanban\Board\Domain\BoardId;
use Faker\Factory;
use Tests\Shared\Domain\Builder;

final class BoardIdBuilder implements Builder
{
    private string $value;

    public function __construct()
    {
        $this->value = Factory::create()->uuid;
    }

    public function withValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function build(): BoardId
    {
        return BoardId::fromValue($this->value);
    }
}
