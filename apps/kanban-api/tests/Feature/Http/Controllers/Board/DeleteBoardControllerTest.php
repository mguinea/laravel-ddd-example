<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Tests\Feature\Http\Controllers\Board;

use App\Kanban\Board\Infrastructure\Persistence\Eloquent\BoardModel;
use Apps\KanbanApi\Tests\TestCase;
use Faker\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

final class DeleteBoardControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithoutMiddleware;

    public function testCreateBoard()
    {
        $board = BoardModel::factory()->create();

        $response = $this->delete($this->baseUrl . 'boards/' . $board->id);

        $response->assertStatus(204);
        $this->assertDatabaseMissing(
            'boards',
            [
                'id' => $board->id,
            ]
        );
    }
}
