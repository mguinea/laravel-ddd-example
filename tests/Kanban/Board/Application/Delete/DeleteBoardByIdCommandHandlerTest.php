<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Delete;

use App\Kanban\Board\Application\Delete\DeleteBoardByIdCommandHandler;
use App\Kanban\Board\Domain\BoardNotFound;
use Tests\Kanban\Board\BoardModuleUnitTestCase;
use Tests\Kanban\Board\Domain\BoardMother;

final class DeleteBoardByIdCommandHandlerTest extends BoardModuleUnitTestCase
{
    private DeleteBoardByIdCommandHandler $handler;

    protected function setUp(): void
    {
        parent::setUp();

        $this->handler = new DeleteBoardByIdCommandHandler($this->repository());
    }

    public function testItShouldDeleteABoard(): void
    {
        $board = BoardMother::create();
        $command = DeleteBoardByIdCommandMother::create($board->id());
        $this->shouldFindById(
            $board->id(),
            $board
        );
        $this->shouldDelete($board->id());

        $this->dispatch($command, $this->handler);
        $this->assertOk();
    }

    public function testItShouldNotDeleteANotFoundBoard(): void
    {
        $this->expectException(BoardNotFound::class);

        $board = BoardMother::create();
        $command = DeleteBoardByIdCommandMother::create($board->id());
        $this->shouldNotFindById(
            $board->id()
        );

        $this->dispatch($command, $this->handler);
    }
}
