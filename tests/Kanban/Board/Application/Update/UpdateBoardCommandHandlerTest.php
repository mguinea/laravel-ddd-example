<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Update;

use App\Kanban\Board\Application\Update\UpdateBoardCommandHandler;
use App\Kanban\Board\Domain\BoardNotFound;
use Tests\Kanban\Board\BoardModuleUnitTestCase;
use Tests\Kanban\Board\Domain\BoardMother;

final class UpdateBoardCommandHandlerTest extends BoardModuleUnitTestCase
{
    private UpdateBoardCommandHandler $handler;

    protected function setUp(): void
    {
        parent::setUp();

        $this->handler = new UpdateBoardCommandHandler($this->repository());
    }

    public function testItShouldUpdateABoard(): void
    {
        $board = BoardMother::create();
        $command = UpdateBoardCommandMother::create(
            $board->id(),
            $board->name()
        );
        $this->shouldFindById(
            $board->id(),
            $board
        );
        $this->shouldSave($board);

        $this->dispatch($command, $this->handler);
        $this->assertOk();
    }

    public function testItShouldNotUpdateANotFoundBoard(): void
    {
        $this->expectException(BoardNotFound::class);

        $board = BoardMother::create();
        $command = UpdateBoardCommandMother::create(
            $board->id(),
            $board->name()
        );
        $this->shouldNotFindById(
            $board->id()
        );

        $this->dispatch($command, $this->handler);
    }
}
