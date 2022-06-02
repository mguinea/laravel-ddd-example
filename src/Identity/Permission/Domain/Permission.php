<?php

declare(strict_types=1);

namespace App\Identity\Permission\Domain;

final class Permission
{
    public function __construct(private PermissionId $id)
    {
    }

    public function id(): PermissionId
    {
        return $this->id;
    }
}
