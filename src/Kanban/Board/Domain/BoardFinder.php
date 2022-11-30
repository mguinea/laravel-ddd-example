<?php

declare(strict_types=1);

namespace App\Kanban\Board\Domain;

use Mguinea\Criteria\Criteria;
use Mguinea\Criteria\Filter;
use Mguinea\Criteria\FilterOperator;

final class BoardFinder
{
    public function __construct(private BoardRepositoryInterface $repository)
    {
    }

    public function __invoke(BoardId $id): Board
    {
        $board = $this->repository->findOneBy(new Criteria([
            new Filter(
                'id',
                FilterOperator::EQUAL,
                $id->value()
            )
        ]));

        if (null === $board) {
            throw new BoardNotFound();
        }

        return $board;
    }
}
