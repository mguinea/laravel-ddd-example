<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application;

use App\Kanban\Board\Domain\Board;
use App\Kanban\Board\Domain\Boards;
use App\Shared\Domain\Bus\Query\ResponseInterface;

final class BoardsResponse implements ResponseInterface
{
    /**
     * @param array<BoardResponse> $boards
     */
    public function __construct(private array $boards)
    {
    }

    public static function fromBoards(Boards $boards): self
    {
        $boardResponses = array_map(
            function (Board $board) {
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
