# Ashlar Blueprint

A reference implementation for using [Ashlar](https://github.com/azavea/ashlar)
to build flexible-schema web applications.

# Installation

## Requirements

- Docker >= 1.13.0 (must be compatible with [Compose file v3
  syntax](https://docs.docker.com/compose/compose-file/compose-versioning/#compatibility-matrix))
- docker-compose >= 1.10.0 (must be compatible with Compose file v3 syntax)

## Set up

Copy an environment file for the Ashlar instance (you can change some variables
you know they won't suit your setup, but the example file should work fine for
local development):

```
cp ./ashlar/.env.example ./ashlar/.env
```

Build the containers, run migrations, and install NPM modules with the `update`
script:

```console
./scripts/update
```

# Developing

## Run development servers

Run development servers with the `server` script:

```console
./scripts/server
```

The Ashlar instance will be accessible on `localhost:8000`, and the reference 
app will be accessible on `localhost:4567`. Both will reload in realtime
as you edit files.

You can choose to run only the Ashlar instance or only the app
by passing the `server` script an optional argument:

```console
# Run only the Ashlar instance
./scripts/server ashlar

# Run only the app
./scripts/server app 
```
