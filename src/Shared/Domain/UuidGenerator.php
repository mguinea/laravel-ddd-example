<?php

namespace App\Shared\Domain;

interface UuidGenerator
{
    public function generate(): string;
}
