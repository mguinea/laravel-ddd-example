<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Tests\Feature\Http\Controllers\HealthCheck;

use Apps\KanbanApi\Tests\TestCase;

final class HealthCheckControllerTest extends TestCase
{
    public function testHealthCheck()
    {
        $response = $this->get($this->baseUrl . 'health-check');

        $response->assertStatus(200);
    }
}
