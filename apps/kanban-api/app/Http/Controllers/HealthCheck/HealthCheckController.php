<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Http\Controllers\HealthCheck;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

final class HealthCheckController
{
    public function __invoke(): JsonResponse
    {
        return new JsonResponse(
            [
                'kanban-api-status' => 'ok'
            ],
            Response::HTTP_OK
        );
    }
}
