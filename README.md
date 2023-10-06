### JRM NC-News

## Description

This is the backend of my first project and is a news database which features articles with comments from users. The API is available to view at https://jrm-nc-news.onrender.com/API.

## Installation and Setup

This project can be cloned using the link provided by GitHub in the code button, and by using the command

```
 `git clone <url>`
```

In your desired directory.

Two `.env` files must be created to use this repo: a `.env.development` and `.env.test`. These must contain `PGDATABASE=my_database` and `PGDATABASE=my_database_test` respectively.

Using the following commands in the terminal will allow you to test and experiment with this repo:

```
npm install
```

will install all required dependencies.

```
npm run setup-dbs
```

will create the databases.

```
npm run seed
```

will populate the databases.

```
npm test app
```

will run the test files and will show any passing or failing tests.

## Versions

This repo uses Node.js v20.2.0 and PostgreSQL 14.9, and should be used to prevent compatibility issues.
