<?php

declare(strict_types=1);

namespace App\Kanban\Board\Infrastructure\Persistence\Eloquent;

use Illuminate\Database\Eloquent\Factories\Factory;

final class BoardModelFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = BoardModel::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'id' => $this->faker->uuid,
            'name' => $this->faker->randomElement(
                [
                    'Board A',
                    'Board B',
                    'Board C',
                    'Board D'
                ]
            ),
        ];
    }
}
