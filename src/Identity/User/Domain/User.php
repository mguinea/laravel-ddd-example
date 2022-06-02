<?php

declare(strict_types=1);

namespace App\Identity\User\Domain;

final class User
{
    public function __construct(private UserId $id)
    {
    }

    public function id(): UserId
    {
        return $this->id;
    }
}
