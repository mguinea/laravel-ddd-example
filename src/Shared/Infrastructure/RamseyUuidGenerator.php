<?php

namespace App\Shared\Infrastructure;

use App\Shared\Domain\UuidGeneratorInterface;
use Ramsey\Uuid\Uuid as RamseyUuid;

final class RamseyUuidGenerator implements UuidGeneratorInterface
{
    public function generate(): string
    {
        return RamseyUuid::uuid4()->toString();
    }
}
