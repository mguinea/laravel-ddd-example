<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

use App\Shared\Domain\DomainException;
use Throwable;

final class BoardNotFound extends DomainException
{
    public function __construct($message = "", $code = 0, Throwable $previous = null)
    {
        $message = "" === $message ? "Board not found" : $message;

        parent::__construct($message, $code, $previous);
    }
}
