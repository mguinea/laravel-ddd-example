<?php

declare(strict_types=1);

namespace App\Shared\Domain\Criteria;

enum FilterOperator
{
    case EQ;
    case NE;
    case GT;
    case GTE;
    case LT;
    case LTE;
}
