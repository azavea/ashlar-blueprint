# Ashlar Blueprint

A reference implementation for using [Ashlar](https://github.com/azavea/ashlar)
to build flexible-schema web applications.

# Installation

## Requirements

- Docker >= 1.13.0 (must be compatible with [Compose file v3
  syntax](https://docs.docker.com/compose/compose-file/compose-versioning/#compatibility-matrix))
- docker-compose >= 1.10.0 (must be compatible with Compose file v3 syntax)

## Set up

Copy an environment file for the Ashlar instance and the frontend (you can change
some variables if you know they won't suit your setup, but the example file should work fine for
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

The Ashlar instance will be accessible on `localhost:8000` and the schema editor
will be accessible on `localhost:9000`. Both should reload in realtime
as you edit files.

You can choose to run only the services you need 
by passing the `server` script an optional argument:

```console
# Run only the Ashlar instance
./scripts/server ashlar

# Run only the schema editor
./scripts/server editor
```

Note that the initial migrations for the Ashlar server automatically create
an admin user with the username `admin` and the password `admin`. You can use
these credentials to log into the schema editor and the API admin portal.
