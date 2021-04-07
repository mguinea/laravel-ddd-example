<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Tests\Feature\Http\Controllers\Board;

use App\Kanban\Board\Infrastructure\Persistence\Eloquent\BoardModel;
use Apps\KanbanApi\Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

final class GetBoardByIdControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithoutMiddleware;

    public function testGetBoardById()
    {
        $board = BoardModel::factory()->create();

        $response = $this->get($this->baseUrl . 'boards/' . $board->id);

        $response
            ->assertJson(
                [
                    'board' => [
                        'id' => $board->id,
                        'name' => $board->name
                    ]
                ]
            )
            ->assertStatus(200);
    }
}
