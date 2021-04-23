<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Get;

use App\Kanban\Board\Application\BoardResponse;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardAlreadyExists;
use App\Kanban\Board\Domain\BoardRepository;
use App\Shared\Domain\Bus\Query\QueryHandler;

final class GetBoardByIdQueryHandler implements QueryHandler
{
    private BoardRepository $repository;

    public function __construct(BoardRepository $repository)
    {
        $this->repository = $repository;
    }

    public function __invoke(GetBoardByIdQuery $query): BoardResponse
    {
        $id = BoardId::fromValue($query->id());
        $board = $this->repository->find($id);

        if (null === $board) {
            throw new BoardAlreadyExists;
        }

        return BoardResponse::fromBoard($board);
    }
}
