# Boilerplate-RSS-bot

## RSS Bot for Webex

The RSS bot for Webex is a boilerplate parser bot designed to digest the data provided from any compatible RSS Feeds, and update a Webex space of your choosing whenever there is a new feed.

**Note:** No initial messages will be published to the spaces when app is loaded. Only when a message is received on the RSS Feed it will be published into the respective space.

## Prerequisites

1. Register a Bot at [Webex Developers](https://developer.webex.com/my-apps) for your Organization, noting the Token ID
2. Create Spaces for Output Messages in Webex App (or skip to step 3 if you have a space/room already)
3. Obtain RoomId for the space/room
4. Add Bot created in Step 1 to your space.
5. Create a .env file and add the required variables below.

## Deployment (Local)

1. Clone / Download repository
2. Run `npm install` to add the require dependencies (ensure Node and NPM are installed)
3. Create an `.env` file and include the required variables outlined below.

- Recommend adding `CONSOLE_LEVEL=debug` during initial testing

4. Start the integration using `npm run start`
5. Review the console logs to confirm no errors encountered
6. As a suggestion for your Tests, you can use this sample feed https://lorem-rss.herokuapp.com/feed?unit=second&interval=30. It creates a new feed every 30 seconds.

## Deployment (Docker)

The simplest deployment method is using [Docker](https://docs.docker.com/engine/install/) and [Docker Compose](https://docs.docker.com/compose/install/)

1. Clone / Download repository
   - Only docker-compose.yml is needed if using prebuilt docker image
2. Update the included docker-compose.yml file with the correct Environmental parameters
3. - Use the prebuilt image available on Docker Hub (default in docker-compose.yml)
   - Build local image - Uncomment build and comment image line in docker-compose.yml
4. Provision and start the service using `docker-compose up -d`
5. Review the console logs using `docker logs rss-service -f` (assuming you are using the default container name)

### Environment Variables

These variables can be individually defined in Docker, or loaded as an `.env` file in the `/app` directory.

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| TOKEN | **Required** | ` ` | Bot Token for Webex Messaging Posts
| FEED_ROOM_ID | **Required** | ` ` | RoomId for Webex Announcement Space
| RSS_FEED_URL | **Required** | ` ` | Rss Feed URL to get the feeds 
| RSS_INTERVAL | Optional | `5` | Interval for RSS Checks (Seconds)
| **Logging Settings**
| CONSOLE_LEVEL | no | bool | `info` | Logging level exposed to console
| APP_NAME | no | string | `rss-service` | App Name used for logging service
| SYSLOG_ENABLED | no | bool | `false` | Enable external syslog server
| SYSLOG_HOST | no | string | `syslog` | Destination host for syslog server
| SYSLOG_PORT | no | num | `514` | Destination port for syslog server
| SYSLOG_PROTOCOL | no | str | `udp4` | Destination protocol for syslog server
| SYSLOG_SOURCE | no | str | `localhost` | Host to indicate that log messages are coming from
| LOKI_ENABLED | no | bool | `false` | Enable external Loki logging server
| LOKI_HOST| no | string | `http://loki:3100` | Destination host for Loki logging server
| **HTTP Proxy**
| GLOBAL_AGENT_HTTP_PROXY | no | string | ` ` | Container HTTP Proxy Server (format `http://<ip or fqdn>:<port>`)
| GLOBAL_AGENT_NO_PROXY | no | string | ` ` | Comma Separated List of excluded proxy domains (Supports wildcards)
| NODE_EXTRA_CA_CERTS | no | string | ` ` | Include extra CA Cert bundle if required, (PEM format) ensure location is attached as a volume to the container


## Support

In case you've found a bug, please open a ticket with the [Webex Developer Support Team](https://developer.webex.com/support).

## Disclaimer

This application is provided as a sample only and is NOT guaranteed to be bug free and of Production quality.
