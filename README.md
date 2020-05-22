# Painting With Pixels API

Where users can paint and create a painting on 3x3 painting grid

<a href="https://painting-with-pixels-app.mesupi.now.sh/" target="_blank">Live Version</a>

[![Build Status](https://www.travis-ci.com/fastlain/developeer-api.svg?branch=master)](https://www.travis-ci.com/fastlain/developeer-api)

This repo contains the server-side API built with Node/Express. Looking for the front-end DeveloPeer Client? 
**[Click Here](https://github.com/supu4aqua/painting-with-pixels-app)**

## Introduction

User can create or view any existing painting. Color can be selected from a palette of 10 colors. Each painting have 9 cells represting one of the colors of the grid.

## Technology

### Back End
* [Node](https://nodejs.org/en/) and [Express](https://expressjs.com/)
    * [Mocha](https://mochajs.org/) test framework and [Chai](http://www.chaijs.com/) assertion library
* [Postgres](https://www.postgresql.org)

### Production
* [Heroku](https://www.heroku.com/) Cloud Application Platform

## Run Painting With Pixels API in a local development environment

### Prerequisites
* You will need these programs installed
    * [Git](https://git-scm.com/)
    * [Node.js](https://nodejs.org/en/)
    * [npm](https://www.npmjs.com/)
    * [Postgres](https://www.postgresql.org)
  
### Installation
* Clone this repository:
    * `git clone https://github.com/supu4aqua/painting-with-pixels-api.git`
* Move into folder:
    * `cd painting-with-pixels-api/`
* Run `npm install`

### Run Program
* Start PostgresSQL local server: `postgres`
* Run `npm start` (or `npm run dev` to run with nodemon which auto-restarts on save changes)
* Make requests using the root: `localhost:8080` or your specified port

### Test
* Start PostgresSQL local server
    * `postgres`
* Run `npm test`


## API Overview

## API

```
/api
.
├── /paintings
│   └── GET
│       ├── /
│   |   ├── /:painting_id
│   └── POST
│       └── /:painting_id
├── /cells
│   └── GET
│       ├── /
│       ├── /:cell_id
│   └── PUT
│       ├── /:cell_id
│   └── POST
│       └── /:cell_id

```
