<?php

declare(strict_types=1);

namespace App\Shared\Domain\Criteria;

use App\Shared\Domain\Collection;

final class Filters extends Collection
{
    protected function type(): string
    {
        return Filter::class;
    }
}
