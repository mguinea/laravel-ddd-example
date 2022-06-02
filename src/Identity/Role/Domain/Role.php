<?php

declare(strict_types=1);

namespace App\Identity\Role\Domain;

final class Role
{
    public function __construct(private RoleId $id)
    {
    }

    public function id(): RoleId
    {
        return $this->id;
    }
}
