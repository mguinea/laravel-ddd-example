<?php

declare(strict_types=1);

namespace App\Kanban\Task\Domain;

use DateTimeImmutable;

final class Task
{
    private TaskId $id;
    private string $description;
    private DateTimeImmutable $createdAt;

    public function __construct(TaskId $id, string $description, DateTimeImmutable $createdAt)
    {
        $this->id = $id;
        $this->description = $description;
        $this->createdAt = $createdAt;
    }

    public function id(): TaskId
    {
        return $this->id;
    }

    public function description(): string
    {
        return $this->description;
    }

    public function createdAt(): DateTimeImmutable
    {
        return $this->createdAt;
    }
}
