# festigram-api-lb-v2

## Running Festigram locally

### Install multipass

...Starting from multipass instance login...

### Install software node
1. Add the ppa and install node
        $ curl -sL https://deb.nodesource.com/setup_13.x -o nodesource_setup.sh
        $ sudo bash nodesource_setup.sh
        $ sudo apt install nodejs
    (Say yes when prompted to confirm the installation)
2. Verify that node was installed
        $ node -v
        v13.14.0
3. Verify that npm was installed
        $ npm -v
        6.14.4

### Install and configure database
4. Install the database server
        $ sudo apt install mysql-server
5. Log into the database server as root
        $ sudo mysql
    This should give a `mysql>` prompt
6. Create a user to run the database. This will create a database and user named festigram, with a password of festigram
        mysql> create database festigram;
        mysql> create user 'festigram'@'localhost' identified WITH mysql_native_password by 'festigram';
        mysql> grant all privileges on festigram.* TO 'festigram'@'localhost';
        mysql> flush privileges;
7. Exit mysql
        mysql> quit
        Bye
        $

### Download and set up the project files
1. From inside the multipass instance
        git clone https://github.com/0441design/ft-api-lb.git
        cd ft-api-lb/
        npm install


This application is generated using [LoopBack 4 CLI](https://loopback.io/doc/en/lb4/Command-line-interface.html) with the
[initial project layout](https://loopback.io/doc/en/lb4/Loopback-application-layout.html).

## Install dependencies

By default, dependencies were installed when this application was generated.
Whenever dependencies in `package.json` are changed, run the following command:

```sh
npm install
```

To only install resolved dependencies in `package-lock.json`:

```sh
npm ci
```

## Run the application

```sh
npm start
```

You can also run `node .` to skip the build step.

Open http://127.0.0.1:3000 in your browser.

## Rebuild the project

To incrementally build the project:

```sh
npm run build
```

To force a full build by cleaning up cached artifacts:

```sh
npm run clean
npm run build
```

## Fix code style and formatting issues

If `eslint` and `prettier` are enabled for this project, you can use the
following commands to check code style and formatting issues.

```sh
npm run lint
```

To automatically fix such issues:

```sh
npm run lint:fix
```

## Other useful commands

- `npm run migrate`: Migrate database schemas for models
- `npm run openapi-spec`: Generate OpenAPI spec into a file
- `npm run docker:build`: Build a Docker image for this application
- `npm run docker:run`: Run this application inside a Docker container

## Tests

```sh
npm test
```

## What's next

Please check out [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/) to
understand how you can continue to add features to this application.

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
