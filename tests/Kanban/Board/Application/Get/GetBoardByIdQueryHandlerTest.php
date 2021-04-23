<?php

declare(strict_types=1);

namespace Tests\Kanban\Board\Application\Get;

use App\Kanban\Board\Application\BoardResponse;
use App\Kanban\Board\Application\Get\GetBoardByIdQueryHandler;
use App\Kanban\Board\Domain\BoardAlreadyExists;
use Tests\Kanban\Board\BoardModuleUnitTestCase;
use Tests\Kanban\Board\Domain\BoardBuilder;

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
        $board = (new BoardBuilder())->build();
        $query = (new GetBoardByIdQueryBuilder())
            ->withId($board->id()->value())
            ->build();
        $response = BoardResponse::fromBoard($board);
        $this->shouldFindById(
            $board->id(),
            $board
        );

        $this->assertAskResponse($response, $query, $this->handler);
    }

    public function testItShouldNotGetABoardById(): void
    {
        $board = (new BoardBuilder())->build();
        $query = (new GetBoardByIdQueryBuilder())
            ->withId($board->id()->value())
            ->build();
        $this->shouldNotFindById(
            $board->id()
        );

        $this->assertAskThrowsException(BoardAlreadyExists::class, $query, $this->handler);
    }
}
