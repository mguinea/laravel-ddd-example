<?php

declare(strict_types=1);

namespace App\Kanban\Column\Domain;

final class Column
{
    private ColumnId $id;
    private string $name;
    private int $order;

    public function __construct(ColumnId $id, string $name, int $order)
    {
        $this->id = $id;
        $this->name = $name;
        $this->order = $order;
    }

    public function id(): ColumnId
    {
        return $this->id;
    }

    public function name(): string
    {
        return $this->name;
    }

    public function order(): int
    {
        return $this->order;
    }
}
