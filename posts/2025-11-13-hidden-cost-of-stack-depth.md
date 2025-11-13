---
name: "The Hidden Cost of Stack Depth: Problems with Recursive PSR-15 Middleware"
slug: hidden-cost-of-stack-depth
excerpt: Recursive PSR-15 middleware introduces significant performance overhead as stacks grow deeper. Here's what I found when benchmarking flat iteration vs recursive approaches.
tags:
    - PHP
    - Performance
    - PSR-15
    - Middleware
---

I've been working with [PSR-15 middleware](https://www.php-fig.org/psr/psr-15/) for years, and it's a great pattern for handling cross-cutting concerns like authentication, logging, CORS, and request/response transformation. But I've always wondered about the performance cost of the recursive pattern it uses.

Recently, I decided to benchmark the performance impact of stack depth and compare PSR-15's recursive approach against a flat iteration alternative. The results were surprising—especially for applications with deep middleware stacks.

## Understanding Stack Depth in PHP

Every function call in PHP adds a frame to the call stack. When middleware is implemented recursively (as in PSR-15), each middleware layer adds another frame to the stack before calling the next middleware. In a typical application with 10-20 middleware layers, this creates a deep call stack.

I wanted to quantify the impact of this, so I created a benchmark comparing PSR-15 recursive middleware against a stackless flat iteration approach. The benchmark uses actual middleware implementations (JSON validators) and tests at depths of 2, 10, 50, and 100 middleware layers.

The benchmark executed 5,000 requests (1,000 iterations × 5 test dates) at each middleware depth:

| Depth | PSR-15 Avg (ms) | Stackless Avg (ms) | Speedup | % Time Saved |
|-------|-----------------|---------------------|---------|--------------|
| **2** | 0.013798 | 0.013117 | **1.05x** | 4.94% |
| **10** | 0.024727 | 0.021984 | **1.12x** | 11.09% |
| **50** | 0.117636 | 0.077163 | **1.52x** | 34.41% |
| **100** | 0.312842 | 0.119360 | **2.62x** | 61.85% |

The results show exponential performance degradation with PSR-15 recursive middleware. At 100 middleware layers, recursive middleware is **2.62x slower** than stackless flat iteration. The performance gap widens dramatically as depth increases—from just 5% improvement at depth 2, to 62% improvement at depth 100.

For applications with deep middleware stacks (50+ layers), stackless middleware provides significant performance gains, with execution time improvements of 30-60% compared to recursive PSR-15 middleware.

## PSR-15 Middleware: The Recursive Approach

[PSR-15](https://www.php-fig.org/psr/psr-15/) middleware follows a recursive pattern where each middleware calls the next one. The standard defines `MiddlewareInterface` which requires implementing a `process()` method that receives both a [PSR-7](https://www.php-fig.org/psr/psr-7/) `ServerRequestInterface` and a `RequestHandlerInterface`.

In my benchmark implementation ([PSR15MiddlewareDispatcher.php](https://github.com/charrondev/psr-7-stackless-middleware-benchmark/blob/main/src/PSR15MiddlewareDispatcher.php)), the dispatcher creates nested handlers recursively:

```php
public function handle(ServerRequestInterface $request): ResponseInterface
{
    if (empty($this->middleware)) {
        return $this->handler->handle($request);
    }

    // Create a new handler that processes the remaining middleware recursively
    $nextHandler = new self($this->handler);
    foreach (array_slice($this->middleware, 1) as $middleware) {
        $nextHandler->addMiddleware($middleware);
    }

    // Call the first middleware, which will recursively call the next
    return $this->middleware[0]->process($request, $nextHandler);
}
```

Each middleware layer adds a stack frame, creating a deep call stack:
```
Middleware1::process()
  └─ Middleware2::process()
      └─ Middleware3::process()
          └─ ... (100+ more layers)
              └─ Dispatcher::handle()
```

## Flat Iteration: An Optimized Alternative

Instead of recursive calls, I split middleware execution into phases and use flat iteration. The implementation defines a [`StacklessMiddlewareInterface`](https://github.com/charrondev/psr-7-stackless-middleware-benchmark/blob/main/src/StacklessMiddlewareInterface.php) interface that splits execution into `before()` and `after()` phases:

```php
interface StacklessMiddlewareInterface
{
    public function before(ServerRequestInterface $request): ServerRequestInterface|ResponseInterface;
    public function after(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface;
    public function resetState(): void;
}
```

The [`StacklessMiddlewareChain`](https://github.com/charrondev/psr-7-stackless-middleware-benchmark/blob/main/src/StacklessMiddlewareChain.php) trait executes middleware with flat iteration:

```php
public function handleWithMiddleware(
    ServerRequestInterface $request,
    RequestHandlerInterface $handler
): ResponseInterface {
    $executedMiddleware = [];

    // Phase 1: Execute before() with flat iteration (no recursion)
    foreach ($this->middleware as $middleware) {
        $result = $middleware->before($request);
        $executedMiddleware[] = $middleware;
        // ... handle short-circuiting ...
        $request = $result;
    }

    // Phase 2: Execute request handler once
    $response = $handler->handle($request);

    // Phase 3: Execute after() in reverse order (flat iteration)
    foreach (array_reverse($executedMiddleware) as $middleware) {
        $response = $middleware->after($request, $response);
    }

    return $response;
}
```

### How It Works

1. **Phase 1 (before)**: Iterate through all middleware, calling `before()` in sequence. No recursion, minimal stack depth.

2. **Phase 2 (handle)**: Execute the `RequestHandlerInterface` handler once. This is where legacy recursive middleware could still be called if needed.

3. **Phase 3 (after)**: Iterate through executed middleware in reverse order, calling `after()`. Again, no recursion.

The call stack remains shallow regardless of middleware depth:
```
Dispatcher::handleWithMiddleware()
  ├─ Middleware1::before() [returns]
  ├─ Middleware2::before() [returns]
  ├─ ... (all before() calls complete, no recursion)
  ├─ RequestHandler::handle() [single call]
  ├─ Middleware2::after() [returns]
  └─ Middleware1::after() [returns]
```

Even with 100 middleware layers, the stack depth remains constant, avoiding the exponential performance degradation seen in recursive implementations.

## Performance Characteristics

Looking at the benchmark results, PSR-15 shows exponential growth in execution time (0.013 ms at depth 2 → 0.313 ms at depth 100), while stackless shows near-linear growth (0.013 ms → 0.119 ms). At 100 layers, stackless middleware is **2.62x faster** than PSR-15 recursive middleware.

For applications with 50+ middleware layers (common in enterprise applications), stackless middleware provides **30-60% performance improvements**, making it a compelling choice for high-performance applications.

It's worth noting that these benchmarks represent a best-case scenario with minimal CPU work. Real-world applications with CPU-intensive operations would see even larger performance gaps.

## Why These Benchmarks Are Conservative

I designed the benchmark to perform minimal CPU work—just JSON serialization/deserialization and basic date processing. This represents a best-case scenario for PSR-15 recursive middleware.

In real-world applications with CPU-intensive operations (text processing, data transformation, complex business logic), the performance gap would be even larger. Consider an endpoint that:
- Processes and validates complex data structures
- Performs text analysis or content parsing
- Executes multiple database queries with result transformation
- Generates reports or aggregates data

In these CPU-bound scenarios, the overhead from repeated stack building in recursive middleware compounds with the application's actual work, potentially making the performance difference even more pronounced than the benchmark shows.

## Real-World Middleware Depth

You might be wondering: when would you actually hit 100+ middleware layers? I tested up to 100 layers to reflect patterns I've seen in large, mature PHP codebases.

### Large Application Stacks

The [Vanilla Forums](https://www.higherlogic.com/vanilla/) API, for example, uses approximately **30 middleware layers** in production. These handle:
- Authentication and session management
- CORS and security headers
- Request/response logging
- Rate limiting
- Content negotiation
- Permission checking
- Transaction management
- Cache control
- Error handling
- Response formatting
- Expanding additional data into responses
- Filtering response output
- Mapping responses into different formats
- Decrypting encrypted response fields.
- Translating contents into different languages.

### Nested Request Dispatching

A common pattern in PHP applications is dispatching internal requests. For example, a page controller calling API controllers to preload data:

```php
// Page request: /dashboard
PageController
  └─ Middleware Stack (30 layers)
      └─ Dispatches internal request: /api/user/stats
          └─ Middleware Stack (30 layers again)
              └─ Handler
```

This pattern **doubles the effective middleware depth** for the outer request, resulting in 60+ layers of middleware execution. In complex applications with multiple nested dispatches, this can easily reach 100+ layers.

### Middleware Composition

Some legacy implementations used naive middleware wrapping patterns that added extra anonymous functions with each middleware layer, effectively doubling the stack depth per middleware:

```php
// Naive pattern (DON'T DO THIS)
$stack = function() use ($handler) {
    return $middleware->process($request, $handler);
};
// This adds 2 stack frames per middleware instead of 1
```

When combined with nested dispatching, these patterns could result in extremely deep call stacks, causing performance degradation and even stack overflow errors in extreme cases.

## When Does This Matter?

The impact becomes significant in a few scenarios:

**High-Traffic Applications**: Even small per-request overhead compounds under load. At 10,000 requests/second, a 0.1ms improvement saves 1 full CPU second per second.

**Deep Middleware Stacks**: Applications with 10+ middleware layers see dramatic improvements. Enterprise applications commonly have 20-40 middleware layers.

**Microservices**: Low-latency requirements make every millisecond count. In a microservice architecture where requests fan out to multiple services, reducing per-request overhead is critical.

**Resource-Constrained Environments**: Better performance characteristics mean better resource utilization in containerized deployments, potentially reducing infrastructure costs.

## Dual Implementation Support

The benchmark demonstrates that middleware can implement both interfaces simultaneously. For example, [`RequestJsonValidatorMiddleware`](https://github.com/charrondev/psr-7-stackless-middleware-benchmark/blob/main/src/RequestJsonValidatorMiddleware.php) implements both `Psr\Http\Server\MiddlewareInterface` and `StacklessMiddlewareInterface`:

```php
class RequestJsonValidatorMiddleware implements MiddlewareInterface, StacklessMiddlewareInterface
{
    // PSR-15 Implementation
    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        // ... validation logic ...
        return $handler->handle($request);
    }

    // StacklessMiddlewareInterface Implementation
    public function before(ServerRequestInterface $request): ServerRequestInterface|ResponseInterface
    {
        // Same validation logic, but returns request/response directly
        return $request;
    }

    public function after(ServerRequestInterface $request, ResponseInterface $response): ResponseInterface
    {
        return $response;
    }
}
```

This allows the same middleware to work with both dispatcher types, enabling gradual migration.

## Migration Considerations

Migrating from [PSR-15](https://www.php-fig.org/psr/psr-15/) to flat iteration requires:

1. **Refactoring Middleware**: Split `process()` into `before()` and `after()` methods
2. **State Management**: Use `resetState()` to clean up between requests
3. **Testing**: Ensure middleware behavior remains identical

The good news: Most middleware logic can be easily split into before/after phases, and the performance gains justify the migration effort. You can still use [PSR-7](https://www.php-fig.org/psr/psr-7/) interfaces (`ServerRequestInterface`, `ResponseInterface`) for type safety and interoperability.

## Takeaways

Stack depth has a profound impact on PHP performance. The benchmarks show that recursive middleware (PSR-15 style) introduces exponential performance degradation as stack depth increases, while flat iteration maintains near-linear performance.

For applications with deep middleware stacks, adopting a flat iteration approach can provide:
- **30-60% performance improvements** in middleware execution (at 50-100 layers)
- **2-3x speedup** compared to recursive middleware at high depths
- **Better scalability** under high load with consistent performance characteristics

While [PSR-15](https://www.php-fig.org/psr/psr-15/) provides a standard interface, the recursive execution pattern comes with significant performance costs as middleware depth increases. By splitting middleware into `before()` and `after()` phases and using flat iteration, you can achieve the same functionality with dramatically better performance.

The choice between PSR-15 and flat iteration isn't just about code style—it's about understanding the performance characteristics of your application and choosing the right pattern for your use case. Both approaches can use [PSR-7](https://www.php-fig.org/psr/psr-7/) interfaces for HTTP message handling, ensuring interoperability with the broader PHP ecosystem.

## Benchmark Implementation

The complete benchmark implementation is available on GitHub: [charrondev/psr-7-stackless-middleware-benchmark](https://github.com/charrondev/psr-7-stackless-middleware-benchmark)

Key files:
- **Middleware Interfaces**: [`StacklessMiddleware.php`](https://github.com/charrondev/psr-7-stackless-middleware-benchmark/blob/main/src/StacklessMiddleware.php), [`StacklessMiddlewareChain.php`](https://github.com/charrondev/psr-7-stackless-middleware-benchmark/blob/main/src/StacklessMiddlewareChain.php)
- **Dispatchers**: [`PSR15MiddlewareDispatcher.php`](https://github.com/charrondev/psr-7-stackless-middleware-benchmark/blob/main/src/PSR15MiddlewareDispatcher.php), [`StacklessMiddlewareDispatcher.php`](https://github.com/charrondev/psr-7-stackless-middleware-benchmark/blob/main/src/StacklessMiddlewareDispatcher.php)
- **Middleware Examples**: [`RequestJsonValidatorMiddleware.php`](https://github.com/charrondev/psr-7-stackless-middleware-benchmark/blob/main/src/RequestJsonValidatorMiddleware.php), [`ResponseJsonValidatorMiddleware.php`](https://github.com/charrondev/psr-7-stackless-middleware-benchmark/blob/main/src/ResponseJsonValidatorMiddleware.php)
- **Benchmark Script**: [`benchmark.php`](https://github.com/charrondev/psr-7-stackless-middleware-benchmark/blob/main/src/benchmark.php)

Run the benchmark yourself:
```bash
git clone https://github.com/charrondev/psr-7-stackless-middleware-benchmark.git
cd psr-7-stackless-middleware-benchmark
composer install
php -d xdebug.mode=off src/benchmark.php
```

---

*Benchmark results were generated using PHP 8.x with xdebug disabled. Your mileage may vary based on PHP version, opcache settings, and system configuration.*

