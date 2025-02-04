---
name: "Scaling Performance: Caching at the Edge"
slug: scaling-performance-caching
excerpt: Efficient caching is key to scaling web applications. This post explores how static asset caching, edge caching for guest users, and in-memory storage with Redis or Memcached can significantly reduce latency and server load.
tags:
    - Scaling Performance
    - Caching
---

## Static Asset Cache

A static asset cache is critical for reducing latency and improving page load speeds. The standard approach today is a combination of a long or infinite `Cache-Control` header and a Content Delivery Network (CDN) like Cloudflare or CloudFront. To ensure that assets are properly cached without serving outdated versions, you must make asset URLs unique. There are two common ways to achieve this:

- Use a bundling tool like Vite or Webpack to append a hash of the file contents to the filename.
- Append a "cache-buster" query parameter to the URL. Before Vanilla adopted bundling tools, we appended the release version to the URL (e.g., `/js/theme.css` would become `/js/theme.css?v=3.1.1`).

A properly cached asset would return a `Cache-Control` header like this:

```http
Cache-Control: public, max-age=31536000, immutable
```

This ensures that browsers and CDNs aggressively cache the file for up to a year, and since the filename is unique, updates are instantly available once a new version is deployed.

## Dynamic Content Caches

One of the biggest performance optimizations we've deployed at Vanilla is caching entire pages at the edge, preventing over half of all requests from hitting our application servers.

However, Vanilla Forums is dynamic software, where different users might have different access levels and see different content. So, how do we safely cache pages while keeping things secure?

### The Key: Cache Only for Guest Users

Since logged-in users see personalized content, we only cache pages for guest users. This has a few caveats:

- If your application receives traffic primarily from logged-in users, this strategy won't help much.
- Edge caching means serving potentially stale content to guest users. For a high-traffic Vanilla site, we set this threshold at 2 minutes—a good balance between cache hit ratio and freshness. This is especially useful when a specific page gets a surge in traffic from a popular link or notification.
- The examples here assume we vary caching based only on certain encodings and authentication status. If your app needs to vary responses on more dimensions, your cache hit ratio may drop significantly.

### Setting Up Edge Caching

To configure this, we need to set response headers appropriately.

**Response Headers for Guest Users:**

```http
Cache-Control: max-age=120
Vary: Accept-Encoding, Cookie
```

**Response Headers for Logged-In Users:**

```http
Cache-Control: private, no-cache, max-age=0, must-revalidate
Set-Cookie
```

The `Vary` header tells caches to segment the cache by both the `Cookie` header and `Accept-Encoding` header.

For example, if User 1 makes this request:

```http
GET /my-url
Accept-Encoding: gzip, deflate, br, zstd
Set-Cookie: v_session=a3fWaa52D; Expires=Wed, 21 Oct 2015 07:28:00 GMT
```

It would be cached under a key like `/my-url:gzip,deflate,br,zstd`. A different user with a session cookie would bypass the cache and hit the application server.

### Improving Cache Efficiency

To improve our cache hit ratio, we do two things:

1. **Normalize Accept-Encoding Values** - Different browsers send different `Accept-Encoding` headers, which can fragment the cache. We normalize them to a small set of values.
2. **Filter Cookies** - Many sites set extra cookies for rate limiting, analytics, or tracking. We ensure the cache key only considers the session cookie.

### Example: Varnish HTTP Cache Configuration

In the past, Vanilla used a self-hosted [Varnish HTTP Cache](https://varnish-cache.org/) for this. Normalizing cache keys was relatively straightforward:

```shell
import cookie;

sub vcl_recv {
    # Normalize accept encoding to just your supported response encodings.
    if (req.http.Accept-Encoding) {
        if (req.url ~ "\.(jpg|png|gif|gz|tgz|bz2|tbz|mp3|ogg)$") {
            # No point in compressing these
            remove req.http.Accept-Encoding;
        } elsif (req.http.Accept-Encoding ~ "gzip") {
            set req.http.Accept-Encoding = "gzip";
        } elsif (req.http.Accept-Encoding ~ "deflate") {
            set req.http.Accept-Encoding = "deflate";
        } else {
            # Unknown encoding
            remove req.http.Accept-Encoding;
        }
    }

    # Reduce the cookies we look at.
    cookie.parse(req.http.cookie);
    cookie.keep("v_session");
    set req.http.cookie = cookie.get_string();
    # Only v_session cookie remains.
    return (hash);
}
```

### Cloudflare Configuration

Today, Vanilla uses Cloudflare for edge caching. Cloudflare's cache rules allow for response variation based on cookies and encoding, but this is only configurable on an Enterprise plan as far as I can tell.

## In-Memory Caching with Memcached or Redis

By far, the biggest efficiency gain in Vanilla has come from in-memory caching with Memcached and Redis.

Fetching a value from Memcached or Redis has significantly lower latency than querying a database like MySQL. A typical database query might take tens of milliseconds, while an in-memory cache lookup can be in the sub-millisecond range.

### Common Use Cases for In-Memory Caching:

- **Session Storage** - Keeping session data in Redis avoids hitting the database for every request.
- **Query Results** - Storing expensive query results in Memcached can dramatically speed up page loads.
- **Rate Limiting** - Implementing per-user or per-IP rate limits efficiently using Redis' atomic increment operations.
- **Computed Data** - Caching expensive computations (e.g., aggregated statistics, leaderboards) to reduce CPU load.

I intend to write a more detailed post on specific caching strategies we use with Memcached and my experiences comparing Redis vs. Memcached in the future. Stay tuned!
