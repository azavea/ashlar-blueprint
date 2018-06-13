# Ashlar Blueprint

A reference implementation for using [Ashlar](https://github.com/azavea/ashlar)
to build flexible-schema web applications.

# Installation

## Requirements

- Docker >= 1.13.0 (must be compatible with [Compose file v3
  syntax](https://docs.docker.com/compose/compose-file/compose-versioning/#compatibility-matrix))
- docker-compose >= 1.10.0 (must be compatible with Compose file v3 syntax)

## Set up

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

The Ashlar instance will be accessible on `localhost:8000`, and the schema
editor app will be accessible on `localhost:4567`. Both will reload in realtime
as you edit files.

You can choose to run only the Ashlar instance or only the schema editor app
by passing the `server` script an optional argument:

```console
# Run only the Ashlar instance
./scripts/server ashlar

# Run only the schema editor app
./scripts/server editor
```

## Add new NPM packages

To add a new NPM package to the schema editor app:

- Manually add the package to the app's `package.json` file, ensuring that you 
pin it to a specific version.
- Add the package to the `vendor` array in `webpack.common.config.js`.
- Run `./scripts/update` to download new packages.
- Commit the changes to the following files to git:
    - `package.json`
    - `yarn.lock`
    - `webpack.common.config.js`
