---
name: Self-Hosting Analytics with Plausible
slug: self-hosting-analytics-with-plausible
tags:
    - self-hosting
    - plausible
    - analytics
    - docker
    - systemd
---

I was recently looking for a cheap way to move a few sites off of Google Analytics
and began looking into various options, both cloud-hosted and self-hosted.

## Available Options

Unfortunately most cloud-hosted options (that aren't google analytics)
are relatively pricy for what are essentially low traffic sites. After a bit of evalution
the best options seemed to be:

-   [Fathom (cloud)](https://usefathom.com/pricing) - \$14/month
-   [Fathom (self-hosted)](https://github.com/usefathom/fathom) - ~\$5/month
-   [Matamo (cloud)](https://matomo.org/pricing/) - \$30/month
-   [Matamo (self-hosted)](https://github.com/matomo-org/matomo) - \$10/month (greater server requirements)
-   [Plausible (cloud)](https://plausible.io/) - \$6/month
-   [Plausible (self-hosted)](https://github.com/plausible/analytics) - \$5/month

I ruled out the cloud hosted options for now, mostly because I wanted to be able to try a few of these out
quickly, without giving out any payment information.

Matamo's hosting requirements seemed larger than I wanted to go, and the additional features it has
over the other's seem more like clutter for my use cases.

That left me with Fathom & Plausible.

### Ruling out Fathom

I got Fathom up and running quick enough (they have 1-click digital ocean droplet),
but after setting it up, but it seemed to have a few major flaws:

-   The analytics dashboard was completely public, with no UI I could find to:
    -   Restrict it.
    -   Sign in.
-   I passed through the initial setup, but I couldn't find how to see my siteID or script location again.

This was enough friction that I tore down the instance and figured I'd give Plausible a shot.

## Installing Plausible

I followed the [self-hosted tutorial provided by Plausible](https://docs.plausible.io/self-hosting/), but I ran into a couple minor issues while
following it so I figured I'd write this post outlining the whole process.

## Creating the Server

I opted to use Digital Ocean for my hosting as I've used them for a few different projects before.
You should be able to use any other hosting provider as long as they support.

I created a new project, and setup a droplet with the following configuration:

-   1 vCPU
-   1GB RAM / 25 GB Disk
-   Droplet - Docker 19.x on Ubuntu 20.04 from the Marketplace.
-   IPv6 & monitoring enabled.
-   Attached my SSH key to the droplet.

Once the droplet was spun up, I ssh'd into it.

```shell
ssh root@ip.of.my.droplet
```

## Installing Plausible

```shell
cd /srv
git clone https://github.com/plausible/hosting plausible
cd plausible

# Generate a random key.
openssl rand -base64 64

# Edit the plausible config
nano plausible-conf.env
```

**plausible-conf.env**

```ini
ADMIN_USER_EMAIL=EMAIL
ADMIN_USER_NAME=USERNAME
ADMIN_USER_PWD=MY_PASSWORD
BASE_URL=https://stats.charron.dev
SECRET_KEY_BASE=RANDOM_KEY
```

## Starting and accessing Plausible

By default Plausible starts up on port 8000. It's expected that you will use some kind of reverse proxy.
I opted to use cloudflare as my reverse proxy and handle https.

Here I:

-   Update Plausible to run on port 80.
-   Configure my DNS (run through cloudflare) to point to the droplet.
-   Block access on port 80 to go only go through cloudflare.

### Update Plausible to run on port 80

**docker-compose.yml**

```yml
# Before
    ports:
      - 8000:8000

# After
    ports:
      - 80:8000
```

### Configuring DNS

-   Go to cloudflare DNS.
-   Add 2 records.

```shell
A stats DROPLET_IPV4
AAAA stats DROPLET_IPV6
```

### Only allowing access through Cloudflare

I configured [UFW (Uncomplicated Firewall)](https://wiki.ubuntu.com/UncomplicatedFirewall) with some additional rules
following [this guide.](https://designinterventionsystems.com/plone-blog/configuring-the-ufw-firewall-to-allow-cloudflare-ip-addresses)

## Starting up the Server

I made a small script to startup the server.

**/srv/start-plausible.sh**

```shell
cd /srv/plausible
docker-compose up --detached
```

Running this scripts starts up the server.

## Creating a SystemD service that runs on startup

In the event of a restart I want the droplet to be able to start up the server automatically.

To do that I created a SystemD service.

**/etc/systemd/system/plausible.service**

```ini
[Unit]
Description=Plausible Analytics
After=network.target
StartLimitIntervalSec=0

[Service]
Type=simple
Restart=always
RestartSec=1
User=root
ExecStart=/usr/bin/env /srv/plausible.sh

[Install]
WantedBy=multi-user.target
```

Then I enabled the service.

```shell
# Will run on startup
systemctl enable plausible

# Manually run it
systemctl start plausible
```
