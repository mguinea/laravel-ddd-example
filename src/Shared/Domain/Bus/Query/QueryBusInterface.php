<?php

declare(strict_types=1);

namespace App\Shared\Domain\Bus\Query;

interface QueryBusInterface
{
    public function ask(QueryInterface $query): ?ResponseInterface;
}
