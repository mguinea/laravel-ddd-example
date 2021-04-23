<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Domain;

use App\Kanban\Board\Domain\BoardName;
use Faker\Factory;
use Tests\Shared\Domain\Builder;

final class BoardNameBuilder implements Builder
{
    public string $value;

    public function __construct()
    {
        $this->value = Factory::create()->randomElement(['foo', 'bar', 'baz']);
    }

    public function withValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function build(): BoardName
    {
        return BoardName::fromValue($this->value);
    }
}
