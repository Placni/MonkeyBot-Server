# MonkeyBot-Server
A simple local server written in JS using Express to handle Bungie OAuth requests\
MonkeyBot-Server is meant to run in tandem with the Discord bot [Monkeybot](https://github.com/Placni/MonkeyBot) for Destiny 2 command functionality

## Requirements
- npm
- node
- Bungie.net App
- MongoDB cluster
- mkcert

## Installing mkcert
mkcert is a utility to create https certificates\
Bungie will not accept an http server as a redirect, so we need to create a localhost cert\
From anywhere on your system, run:

```
$ npm i -g mkcert
```

## Creating a Bungie App
1. Navigate to https://www.bungie.net/en/Application
2. Login and create a new app
3. Set *OAuth Client Type* to *Confidential*
4. Set *Redirect URL* to https://127.0.0.1:8000/oauth
5. Under *Scope* select all boxes

## Running the server
First, git clone this repository, or download as zip and unpack
```
$ git clone https://github.com/Placni/MonkeyBot-Server.git
```

Next, install the dependencies for the server with npm
```
$ npm install package.json
```

Next, create a `.env` file in the root directory of the project. This will contain your login for MongoDB and Bungie App credentials
```
CLIENT_ID=
CLIENT_SECRET=
MONGODB_SRV=
```

Create a folder in the root directory of the project named `certs`. This is where we will generate our https certificates with MKcert
Then, from the root directory of the project

```$ cd certs
$ mkcert create-ca
$ mkcert create-cert
```

After all previous steps are done, the server can be ran with:
```
$ node server.js 
```
