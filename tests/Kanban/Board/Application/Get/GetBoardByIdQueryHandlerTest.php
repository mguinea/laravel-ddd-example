<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Get;

use App\Kanban\Board\Application\BoardResponse;
use App\Kanban\Board\Application\Get\GetBoardByIdQueryHandler;
use App\Kanban\Board\Domain\BoardNotFound;
use Tests\Kanban\Board\BoardModuleUnitTestCase;
use Tests\Kanban\Board\Domain\BoardMother;

final class GetBoardByIdQueryHandlerTest extends BoardModuleUnitTestCase
{
    private GetBoardByIdQueryHandler $handler;

    protected function setUp(): void
    {
        parent::setUp();

        $this->handler = new GetBoardByIdQueryHandler($this->repository());
    }

    public function testItShouldGetABoardById(): void
    {
        $board = BoardMother::create();
        $query = GetBoardByIdQueryMother::create($board->id());
        $response = BoardResponse::fromBoard($board);
        $this->shouldFindById(
            $board->id(),
            $board
        );

        $this->assertAskResponse($response, $query, $this->handler);
    }

    public function testItShouldNotGetABoardById(): void
    {
        $board = BoardMother::create();
        $query = GetBoardByIdQueryMother::create($board->id());
        $this->shouldNotFindById(
            $board->id()
        );

        $this->assertAskThrowsException(BoardNotFound::class, $query, $this->handler);
    }
}
