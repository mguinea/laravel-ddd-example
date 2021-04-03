<?php

declare(strict_types=1);

namespace App\Shared\Infrastructure\Bus\Laravel;

use App\Shared\Domain\Bus\Query\Query;
use App\Shared\Domain\Bus\Query\QueryHandler;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class QueryJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /** @var QueryHandler */
    private $handler;

    /** @var Query */
    private $query;

    public function __construct(QueryHandler $handler, Query $query)
    {
        $this->handler = $handler;
        $this->query = $query;
    }

    public function handle()
    {
        return $this->handler->__invoke($this->query);
    }
}
