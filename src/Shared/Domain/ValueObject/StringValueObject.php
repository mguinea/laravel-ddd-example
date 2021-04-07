<?php

declare(strict_types=1);

namespace App\Shared\Domain\ValueObject;

abstract class StringValueObject
{
    protected string $value;

    public function __construct(string $value)
    {
        $this->value = $value;
    }

    public static function fromValue(string $value)
    {
        return new static($value);
    }

    public function value(): string
    {
        return $this->value;
    }
}
