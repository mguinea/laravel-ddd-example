<?php

declare(strict_types=1);

namespace Tests\Shared\Infrastructure\PhpUnit;

use App\Shared\Domain\Bus\Command\Command;
use App\Shared\Domain\Bus\Command\CommandBus;
use App\Shared\Domain\Bus\Event\DomainEvent;
use App\Shared\Domain\Bus\Query\Query;
use App\Shared\Domain\Bus\Query\QueryBus;
use App\Shared\Domain\Bus\Query\Response;
use PHPUnit\Framework\TestCase;
use Prophecy\Prophecy\ObjectProphecy;
use Prophecy\Prophet;

abstract class UnitTestCase extends TestCase
{
    protected Prophet $prophet;
    private $queryBusProphecy;
    private QueryBus $queryBus;
    private $commandBusProphecy;
    private CommandBus $commandBus;

    protected function setUp(): void
    {
        $this->prophet = new Prophet();
    }

    protected function tearDown(): void
    {
        $this->prophet->checkPredictions();
    }

    protected function prophecy(string $interface): ObjectProphecy
    {
        return $this->prophet->prophesize($interface);
    }

    protected function notify(DomainEvent $event, callable $subscriber): void
    {
        $subscriber($event);
    }

    protected function dispatch(Command $command, callable $commandHandler): void
    {
        $commandHandler($command);
    }

    protected function assertAskResponse(Response $expected, Query $query, callable $queryHandler): void
    {
        $actual = $queryHandler($query);

        $this->assertEquals($expected, $actual);
    }

    protected function assertAskThrowsException(string $expectedErrorClass, Query $query, callable $queryHandler): void
    {
        $this->expectException($expectedErrorClass);

        $queryHandler($query);
    }

    protected function assertAskNullResponse(Query $query, callable $queryHandler): void
    {
        $actual = $queryHandler($query);

        $this->assertNull($actual);
    }

    protected function assertOk(): void
    {
        $this->assertTrue(true);
    }

    /**
     * @return object|QueryBus
     */
    protected function queryBus()
    {
        return $this->queryBus = $this->queryBus ?? $this->queryBusProphecy()->reveal();
    }

    protected function queryBusProphecy(): ObjectProphecy
    {
        return $this->queryBusProphecy = $this->queryBusProphecy ?? $this->prophecy(QueryBus::class);
    }

    /**
     * @return object|CommandBus
     */
    protected function commandBus()
    {
        return $this->commandBus = $this->commandBus ?? $this->commandBusProphecy()->reveal();
    }

    protected function commandBusProphecy(): ObjectProphecy
    {
        return $this->commandBusProphecy = $this->commandBusProphecy ?? $this->prophecy(CommandBus::class);
    }
}
