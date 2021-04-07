<?php

namespace Apps\KanbanApi\Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected string $baseUrl = 'api/v1/kanban/';
}
