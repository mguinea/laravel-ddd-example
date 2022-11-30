<?php

declare(strict_types=1);

namespace Tests\Shared\Infrastructure\PhpUnit;

use App\Shared\Domain\Bus\Command\CommandInterface;
use App\Shared\Domain\Bus\Command\CommandBusInterface;
use App\Shared\Domain\Bus\Event\AbstractDomainEvent;
use App\Shared\Domain\Bus\Event\EventBusInterface;
use App\Shared\Domain\Bus\Query\QueryInterface;
use App\Shared\Domain\Bus\Query\QueryBusInterface;
use App\Shared\Domain\Bus\Query\ResponseInterface;
use PHPUnit\Framework\TestCase;
use Prophecy\Prophecy\ObjectProphecy;
use Prophecy\Prophet;

abstract class UnitTestCase extends TestCase
{
    protected Prophet $prophet;
    private $queryBusProphecy;
    private QueryBusInterface $queryBus;
    private $commandBusProphecy;
    private CommandBusInterface $commandBus;
    private $eventBusProphecy;
    private EventBusInterface $eventBus;

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

    protected function notify(AbstractDomainEvent $event, callable $subscriber): void
    {
        $subscriber($event);
    }

    protected function dispatch(CommandInterface $command, callable $commandHandler): void
    {
        $commandHandler($command);
    }

    protected function assertAskResponse(ResponseInterface $expected, QueryInterface $query, callable $queryHandler): void
    {
        $actual = $queryHandler($query);

        $this->assertEquals($expected, $actual);
    }

    protected function assertAskThrowsException(string $expectedErrorClass, QueryInterface $query, callable $queryHandler): void
    {
        $this->expectException($expectedErrorClass);

        $queryHandler($query);
    }

    protected function assertAskNullResponse(QueryInterface $query, callable $queryHandler): void
    {
        $actual = $queryHandler($query);

        $this->assertNull($actual);
    }

    protected function assertOk(): void
    {
        $this->assertTrue(true);
    }

    /**
     * @return object|QueryBusInterface
     */
    protected function queryBus()
    {
        return $this->queryBus = $this->queryBus ?? $this->queryBusProphecy()->reveal();
    }

    protected function queryBusProphecy(): ObjectProphecy
    {
        return $this->queryBusProphecy = $this->queryBusProphecy ?? $this->prophecy(QueryBusInterface::class);
    }

    /**
     * @return object|CommandBusInterface
     */
    protected function commandBus()
    {
        return $this->commandBus = $this->commandBus ?? $this->commandBusProphecy()->reveal();
    }

    protected function commandBusProphecy(): ObjectProphecy
    {
        return $this->commandBusProphecy = $this->commandBusProphecy ?? $this->prophecy(CommandBusInterface::class);
    }

    /**
     * @return object|EventBusInterface
     */
    protected function eventBus()
    {
        return $this->eventBus = $this->eventBus ?? $this->eventBusProphecy()->reveal();
    }

    protected function eventBusProphecy(): ObjectProphecy
    {
        return $this->eventBusProphecy = $this->eventBusProphecy ?? $this->prophecy(EventBusInterface::class);
    }
}
