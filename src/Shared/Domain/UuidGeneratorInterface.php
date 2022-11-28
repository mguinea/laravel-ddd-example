<?php

namespace App\Shared\Domain;

interface UuidGeneratorInterface
{
    public function generate(): string;
}
