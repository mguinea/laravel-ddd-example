<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application;

use App\Kanban\Board\Domain\Boards;
use App\Shared\Domain\Bus\Query\Response;

final class BoardsResponse implements Response
{
    /** @var array<BoardResponse> */
    private array $boards;

    public function __construct(array $boards)
    {
        $this->boards = $boards;
    }

    public static function fromBoards(Boards $boards): self
    {
        $boardResponses = array_map(
            function ($board) {
                return BoardResponse::fromBoard($board);
            },
            $boards->all()
        );

        return new self($boardResponses);
    }

    public function toArray(): array
    {
        return array_map(function (BoardResponse $boardResponse) {
            return $boardResponse->toArray();
        }, $this->boards);
    }
}
