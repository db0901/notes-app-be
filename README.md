# Notes App - BE

This is a traditional notes app built with express.js, typescript and MongoDB.

## Features

- Authentication and authorization with [JWT](https://jwt.io/)
- User login and register
- Validation on each endpoint using [Zod](https://zod.dev/)
- Server and rest api built with [express.js](https://expressjs.com/)
- Database powered by [MongoDB](https://www.mongodb.com/)
- E2E testing using [Jest](https://jestjs.io/) and [Supertest](https://github.com/ladjs/supertest)

## Modules

- Auth
  - Register `POST /auth/register`
  - Login `POST /auth/login`
  - Current session `GET /auth/current-session`
- Notes
  - Create `POST /notes/create`
  - Find All `GET /notes`
  - Find One `GET /notes/:noteId`
  - Update `PATCH /notes/:noteId`
  - Remove `DELETE /notes/:noteId`

## Dev

This project is using npm. So to install just need to do

```
npm install
```

To run it you have to create a `.env` file and fill the following fields:

- `PORT` (optiona): Used to determine which port to use to run the app. _Default: 3000_
- `MONGO_URI`: Used to determine the MongoDB connection. Without this the server is not going to run.
- `JWT_SECRET`: Secret used by JWT. Use whatever you want. Implemented on .env to not upload it to the internet

Then you can do to start the dev server on the specified port:

```
npm run dev
```

## Testing

This is implemented using Jest for the assertions and Supertest to do API calls.
All of them can be found on `test/` folder and is divided by modules like the API

To run the tests you can do

```
npm run test | npm test
```

## Building and Deploy

To build the app you can use

```
npm run build
```

Which is going to transpile from TypeScript to Javascript.
Then to serve the build run

```
npm run serve
```

If you want to do both with just a single command please do

```
npm run prod
```

---

Done for learning purposes
