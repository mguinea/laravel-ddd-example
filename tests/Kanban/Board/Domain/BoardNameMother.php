<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Domain;

use App\Kanban\Board\Domain\BoardName;
use Exception;

use function random_int;

final class BoardNameMother
{
    /**
     * @throws Exception
     */
    public static function create(?string $value = null): BoardName
    {
        $values = ['foo', 'bar', 'baz'];

        return BoardName::fromValue($value ?? $values[random_int(0, count($values) - 1)]);
    }
}
