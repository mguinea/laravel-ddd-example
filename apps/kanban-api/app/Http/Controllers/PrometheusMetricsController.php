<?php

declare(strict_types=1);

namespace Apps\KanbanApi\Http\Controllers;

use App\Shared\Infrastructure\Monitoring\PrometheusMonitor;
use Illuminate\Http\Response;
use Prometheus\RenderTextFormat;

final class PrometheusMetricsController
{
    public function __construct(private PrometheusMonitor $monitor)
    {
    }

    public function __invoke(): Response
    {
        $renderer = new RenderTextFormat();

        $result = $renderer->render($this->monitor->registry()->getMetricFamilySamples());

        return new Response($result, 200, ['Content-Type' => RenderTextFormat::MIME_TYPE]);
    }
}
