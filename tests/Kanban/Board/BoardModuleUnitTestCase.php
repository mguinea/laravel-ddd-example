<?php

declare(strict_types=1);

namespace Tests\Kanban\Board;

use App\Kanban\Board\Domain\Board;
use App\Kanban\Board\Domain\BoardId;
use App\Kanban\Board\Domain\BoardRepository;
use Prophecy\Prophecy\ObjectProphecy;
use Tests\Shared\Infrastructure\PhpUnit\UnitTestCase;

abstract class BoardModuleUnitTestCase extends UnitTestCase
{
    private $repository;
    private $repositoryProphecy;

    protected function shouldFindById(BoardId $id, Board $board): void
    {
        $this->repositoryProphecy()->find($id)->willReturn($board);
    }

    protected function shouldNotFindById(BoardId $id): void
    {
        $this->repositoryProphecy()->find($id)->willReturn(null);
    }

    protected function shouldSave(Board $board): void
    {
        $this->repositoryProphecy()->save($board);
    }

    protected function shouldNotSave(Board $board): void
    {
        $this->shouldFindById(
            $board->id(),
            $board
        );
    }

    protected function shouldDelete(BoardId $id): void
    {
        $this->repositoryProphecy()->delete($id);
    }

    protected function repository()
    {
        return $this->repository = $this->repository ?? $this->repositoryProphecy()->reveal();
    }

    private function repositoryProphecy(): ObjectProphecy
    {
        return $this->repositoryProphecy = $this->repositoryProphecy ?? $this->prophecy(BoardRepository::class);
    }
}
