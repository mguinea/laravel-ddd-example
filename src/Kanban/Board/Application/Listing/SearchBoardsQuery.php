<?php

declare(strict_types=1);

namespace App\Kanban\Board\Application\Listing;

use App\Shared\Domain\Bus\Query\QueryInterface;

final class SearchBoardsQuery implements QueryInterface
{
    public function __construct(
        public readonly ?array $filters = null,
        public readonly ?array $orderList = null,
        public readonly ?int $offset = null,
        public readonly ?int $limit = null
    ) {
    }
}
