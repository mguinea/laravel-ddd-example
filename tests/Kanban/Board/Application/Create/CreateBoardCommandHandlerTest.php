<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Create;

use App\Kanban\Board\Application\Create\CreateBoardCommandHandler;
use App\Kanban\Board\Domain\BoardAlreadyExists;
use Tests\Kanban\Board\BoardModuleUnitTestCase;
use Tests\Kanban\Board\Domain\BoardMother;

final class CreateBoardCommandHandlerTest extends BoardModuleUnitTestCase
{
    private CreateBoardCommandHandler $handler;

    protected function setUp(): void
    {
        parent::setUp();

        $this->handler = new CreateBoardCommandHandler($this->repository());
    }

    public function testItShouldCreateABoard(): void
    {
        $board = BoardMother::create();
        $command = CreateBoardCommandMother::create(
            $board->id(),
            $board->name()
        );
        $this->shouldNotFindById(
            $board->id()
        );
        $this->shouldSave($board);

        $this->dispatch($command, $this->handler);
        $this->assertOk();
    }

    public function testItShouldNotCreateAnExistingBoard(): void
    {
        $this->expectException(BoardAlreadyExists::class);

        $board = BoardMother::create();
        $command = CreateBoardCommandMother::create(
            $board->id(),
            $board->name()
        );
        $this->shouldNotSave($board);

        $this->dispatch($command, $this->handler);
    }
}
