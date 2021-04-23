<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

use App\Shared\Domain\DomainException;
use Throwable;

final class BoardAlreadyExists extends DomainException
{
    public function __construct($message = "", $code = 0, Throwable $previous = null)
    {
        $message = "" === $message ? "Board already exists" : $message;

        parent::__construct($message, $code, $previous);
    }
}
