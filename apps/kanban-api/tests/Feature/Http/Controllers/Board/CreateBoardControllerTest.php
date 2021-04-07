<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Tests\Feature\Http\Controllers\Board;

use App\Kanban\Board\Infrastructure\Persistence\Eloquent\BoardModel;
use Apps\KanbanApi\Tests\TestCase;
use Faker\Factory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;

final class CreateBoardControllerTest extends TestCase
{
    use RefreshDatabase;
    use WithoutMiddleware;

    public function testCreateBoard()
    {
        $name = Factory::create()->randomElement(['Board test 1', 'Board test 2']);

        $response = $this->post(
            $this->baseUrl . 'boards',
            [
                'name' => $name
            ]
        );

        $response->assertJsonStructure(
            [
                'board' => [
                    'id'
                ]
            ]
        )->assertStatus(200);

        $this->assertDatabaseHas(
            'boards',
            [
                'name' => $name,
            ]
        );
    }
}
