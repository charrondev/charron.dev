---
name: Speeding Up PHP in Docker w/ XDebug
slug: "speeding-up-php-in-docker-xdebug"
updated: 2020/11/06
tags:
    - PHP
    - Performance
    - XDebug
    - Docker
    - Nginx
---

I've been using Docker for my local environments at Vanilla since 2017.
It was a good way to ensure consistent & reproducible developer environments
and was a marked improvement over what we were running before. We setup a single repository
with our shared environment ([vanilla-docker](https://github.com/vanilla/vanilla-docker)) and
it spread across the company like wildfire.

The consistency was great, especially as we onboarded various junior developers over the years.
Unfortunately in 2018, Apple released MacOS High Sierra, sporting a new filesystem, [APFS](https://en.wikipedia.org/wiki/Apple_File_System).

This brought one single major regression to our developer environments.

## Docker for Mac was Slow!

In the beginning, it was completely unusable.
[Massive CPU spikes would freeze up our machines](https://github.com/docker/for-mac/issues/2582), and response times were abysmal.

Things got a little better with introduction of a few options when mounting volumes: [Delegated & Cached](https://tkacz.pro/docker-volumes-cached-vs-delegated/)

These along with various improvements in docker for mac made things better,
but we still struggled with performance for a long time.
It wasn't completely unusable, but we were seeing 3-4 second response times in docker,
where we would see 200-300ms response times in local development.

## Various Attempts at Fixing it

I tried a few things to speed them up.

-   [NFS Volumes](https://www.jeffgeerling.com/blog/2020/revisiting-docker-macs-performance-nfs-volumes) - This offered a 30-40% speed improvement but proved to difficult to roll across all of our developers due to the additional configuration required.
-   [docker-sync](https://docker-sync.readthedocs.io/en/latest/) - This tool gave essentially native performance but brought some major drawbacks. I tried 2 times, once in 2019, and again in the beginning of 2020 but these still seemed to hold true.
    -   It was very slow to startup. We have a lot of files and directories, and the initial sync would take 10+ minutes with no status indicator. Sometimes it would hang entirely and you'd have to reboot your machine, wipe the containers, and start again.
    -   It would stop syncing at random times with no indication. You would notice when you changes suddenly stopped applying. Often the only fix was to wipe the volumes and redo the initial sync. This was particularly evident when checking out and older release and swithing back.
    -   The configuration was complicated. Additional commands were required for startup, and the configuration file used a poorly documented syntax for marking excluded directories (a few `node_modules` directories in particular needed to be excluded in order for things to sync for even short periods of time).
    -   Sometimes filesystem permissions wouldn't sync properly. This tended to happen with certain configuration files written by the app.

## The Real Problem - XDebug

Many of our developers use XDebug extensively during development and testing.
A 2-5x slowdown while running a debug session is not unexpected.

Little did I know that just **_having the extension installed brings along some significant slowdown._**
This is amplified in docker, where every System IO call brings with it a lot of overhead due to the virtualization in Docker for Mac.

Removing the XDebug extension had the local sites responding within expected times again.
XDebug is really useful though. I didn't want to give it up. Enabling it also couldn't be an onerous activity; I could use XDebug 10-20 times throughout a workday, and having to restart the container would be a chore.

## The Solution - 2 PHP-FPM Containers

The final solution ended up being running 2 PHP-FPM containers.

1. With a "production-ish" configuration. This one _without_ XDebug and _with_ a development configuration for OPCache.
2. With a debugging configuration. This one _with_ XDebug.

Nginx was already used to serve our PHP-FPM processes, so I just updated the configuration to route between them.

## The Configs

[The Full PR is available here](https://github.com/vanilla/vanilla-docker/pull/90)

**Nginx Server Config**

This is the bulk of the required configuration. It does the following:

-   Define the 2 upstreams (php-fpm socket and php-fpm-xdebug socket).
-   Define a few mappings 2 allow switching between the 2 upstreams based on
    -   An XDebug cookie.
    -   A query parameter of `?XDEBUG_SESSION_START`
    -   Many possible cookie values used by various browser plugins and IDEs.

```nginx
http {
    # ... Other top level config.

    # Define available upstreams
    upstream php-fpm {
        server unix:/shared/var/run/php-fpm.sock;
    }
    upstream php-fpm-xdebug {
        server unix:/shared/var/run/php-fpm-xdebug.sock;
    }

    # XDebug mappings.
    map $arg_XDEBUG_SESSION_START $session_arg_pass {
        default php-fpm;
        1 php-fpm-xdebug;
    }

    map $cookie_XDEBUG_SESSION $cookie_arg_pass {
        default $session_arg_pass;
        xdebug php-fpm-xdebug;
        1 php-fpm-xdebug;
        PHPSTORM php-fpm-xdebug;
        XDEBUG_ECLIPSE php-fpm-xdebug;
    }

    map $arg_XDEBUG_PROFILE $xdebug_test_pass {
        default $cookie_arg_pass;
        1 php-fpm-xdebug;
    }

    server {

        # ... Rest of config

        location ~* "/([^./]+)/index\.php(/|$)" {
            # ... Other FastCGI configs.
            fastcgi_pass $xdebug_test_pass;
        }

        # ... Rest of config
    }
}
```

**Debug PHP config**

```ini
[www]
listen = /shared/var/run/php-fpm-xdebug.sock
listen.owner = www-data
listen.group = www-data
listen.mode = 0660

[xdebug]
xdebug.idekey = PHPSTORM
xdebug.profiler_output_dir = /var/log/php-fpm

xdebug.remote_enable = 1
xdebug.remote_host = 192.0.2.1
xdebug.profiler_enable_trigger = 1

# Name the profiles with the url.
xdebug.profiler_output_name = %R.cachegrind.out

; One second only. Fast expiry.
; Keep requesting the cookie if you want it.
xdebug.remote_cookie_expire_time = 1
```

**"Production-ish" PHP config**

```ini
[www]
listen = /shared/var/run/php-fpm.sock

listen.owner = www-data
listen.group = www-data
listen.mode = 0660

[opcache]
opcache.enable=1
; 0 means it will check on every request
; 0 is irrelevant if opcache.validate_timestamps=0 which is desirable in production
opcache.revalidate_freq=0
opcache.validate_timestamps=1
opcache.max_accelerated_files=100000
opcache.memory_consumption=500
opcache.max_wasted_percentage=20
opcache.interned_strings_buffer=16
opcache.fast_shutdown=1
```
