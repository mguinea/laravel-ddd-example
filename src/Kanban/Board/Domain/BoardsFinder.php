<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

use Mguinea\Criteria\Criteria;

final class BoardsFinder
{
    public function __construct(private BoardRepositoryInterface $repository)
    {
    }

    public function __invoke(Criteria $criteria): Boards
    {
        return $this->repository->findBy($criteria);
    }
}
