<?php

declare(strict_types=1);

namespace App\Shared\Domain\ValueObject;

use ReflectionClass;
use Stringable;
use function in_array;

abstract class EnumValueObject implements Stringable
{
    protected static array $cache = [];

    public function __construct($value)
    {
        $this->ensureIsBetweenAcceptedValues($value);
        $this->value = $value;
    }

    abstract protected function throwExceptionForInvalidValue($value);

    public static function __callStatic(string $name, $args)
    {
        return new static(self::values()[$name]);
    }

    public static function fromString(string $value): EnumValueObject
    {
        return new static($value);
    }

    public static function values(): array
    {
        $class = static::class;

        if (!isset(self::$cache[$class])) {
            $reflected           = new ReflectionClass($class);
            self::$cache[$class] = reindex(self::keysFormatter(), $reflected->getConstants());
        }

        return self::$cache[$class];
    }

    public static function randomValue()
    {
        return self::values()[array_rand(self::values())];
    }

    public static function random(): static
    {
        return new static(self::randomValue());
    }

    private static function keysFormatter(): callable
    {
        return static fn($unused, string $key): string => Utils::toCamelCase(strtolower($key));
    }

    public function value()
    {
        return $this->value;
    }

    public function equals(Enum $other): bool
    {
        return $other == $this;
    }

    public function __toString(): string
    {
        return (string) $this->value();
    }

    private function ensureIsBetweenAcceptedValues($value): void
    {
        if (!in_array($value, static::values(), true)) {
            $this->throwExceptionForInvalidValue($value);
        }
    }
}
