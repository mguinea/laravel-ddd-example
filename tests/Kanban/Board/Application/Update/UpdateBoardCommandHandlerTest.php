<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Update;

use App\Kanban\Board\Application\Update\UpdateBoardCommandHandler;
use App\Kanban\Board\Domain\BoardNotFound;
use Tests\Kanban\Board\BoardModuleUnitTestCase;
use Tests\Kanban\Board\Domain\BoardBuilder;

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
        $board = (new BoardBuilder())->build();
        $command = (new UpdateBoardCommandBuilder())
            ->withId($board->id()->value())
            ->withName($board->name()->value())
            ->build();
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

        $board = (new BoardBuilder())->build();
        $command = (new UpdateBoardCommandBuilder())
            ->withId($board->id()->value())
            ->withName($board->name()->value())
            ->build();
        $this->shouldNotFindById(
            $board->id()
        );

        $this->dispatch($command, $this->handler);
    }
}
