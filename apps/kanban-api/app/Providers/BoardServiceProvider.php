<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Providers;

use App\Kanban\Board\Application\Create\CreateBoardCommandHandler;
use App\Kanban\Board\Application\Delete\DeleteBoardByIdCommandHandler;
use App\Kanban\Board\Application\Get\GetBoardByIdQueryHandler;
use App\Kanban\Board\Application\Listing\SearchBoardsQueryHandler;
use App\Kanban\Board\Application\Subscriber\SomethingWithCreatedBoardSubscriber;
use App\Kanban\Board\Application\Update\UpdateBoardCommandHandler;
use App\Kanban\Board\Domain\BoardRepository;
use App\Kanban\Board\Infrastructure\Persistence\Eloquent\BoardRepository as EloquentBoardRepository;
use Illuminate\Support\ServiceProvider;

final class BoardServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            BoardRepository::class,
            EloquentBoardRepository::class
        );

        $this->app->tag(
            CreateBoardCommandHandler::class,
            'command_handler'
        );

        $this->app->tag(
            DeleteBoardByIdCommandHandler::class,
            'command_handler'
        );

        $this->app->tag(
            GetBoardByIdQueryHandler::class,
            'query_handler'
        );

        $this->app->tag(
            SearchBoardsQueryHandler::class,
            'query_handler'
        );

        $this->app->tag(
            UpdateBoardCommandHandler::class,
            'command_handler'
        );

        $this->app->tag(
            SomethingWithCreatedBoardSubscriber::class,
            'domain_event_subscriber'
        );
    }
}
