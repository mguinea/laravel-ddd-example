<?php

declare(strict_types=1);

namespace App\Shared\Domain;

use InvalidArgumentException;

abstract class Collection implements CollectionInterface
{
    private array $items;

    public function __construct(array $items = [])
    {
        $this->arrayOf($this->type(), $items);
        $this->items = $items;
    }

    private function arrayOf(string $class, array $items): void
    {
        foreach ($items as $item) {
            $this->instanceOf($class, $item);
        }
    }

    private function instanceOf(string $class, $item): void
    {
        if (!$item instanceof $class) {
            throw new InvalidArgumentException(
                sprintf('The object <%s> is not an instance of <%s>', $class, get_class($item))
            );
        }
    }

    abstract protected function type(): string;

    public function count(): int
    {
        return count($this->all());
    }

    public function all(): array
    {
        return $this->items;
    }
}
