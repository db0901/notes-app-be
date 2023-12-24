import express from "express";

// auth
import { currentSession, login, register } from "./controllers";
import {
  currentSessionSchema,
  loginSchema,
  registerSchema,
} from "./validation";

// middlewares
import { authenticateJWT } from "middleware/authenticateJWT";
import { validate } from "middleware/validate";

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *    post:
 *      tags:
 *        - auth
 *      summary: "User Login"
 *      description: This endpoint enables the user to login with a valid email and password.
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                  password:
 *                    type: string
 *      responses:
 *        '200':
 *          description: Successfully logged in.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  authToken:
 *                    type: string
 *                  username:
 *                    type: string
 *        '401':
 *          description: Invalid Credentials.
 *        '400':
 *          description: Bad Request - email or password not sent.
 */
router.post("/login", validate(loginSchema), login);

/**
 * @openapi
 * /auth/register:
 *    post:
 *      tags:
 *        - auth
 *      summary: "User Register"
 *      description: This endpoint enables the user to register with a valid email and password, also a username is required.
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                  password:
 *                    type: string
 *                  username:
 *                    type: string
 *      responses:
 *        '201':
 *          description: Successfully registered / user created.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                  authToken:
 *                    type: string
 *                  username:
 *                    type: string
 *        '409':
 *          description: User with that email already exists.
 *        '500':
 *          description: Internal Server Error.
 */
router.post("/register", validate(registerSchema), register);

/**
 * @openapi
 * /auth/current-session:
 *    get:
 *      tags:
 *        - auth
 *      summary: "User Current Session"
 *      description: This endpoint returns information about the current session based on a valid JWT.
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: JWT token with 'Bearer' prefix. Returned from Login or register process.
 *          type: string
 *          required: true
 *      responses:
 *        '200':
 *          description: Valid JWT, so current session information is returned.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  email:
 *                    type: string
 *                  expiresAt:
 *                    type: string
 *                  issuedAt:
 *                    type: string
 *                  userId:
 *                    type: string
 *                  username:
 *                    type: string
 *        '400':
 *          description: Bad Request - email or password not sent.
 *        '401':
 *          description: Invalid Credentials.
 *        '403':
 *          description: Could not find any user with the provided credentials (User Id inside JWT).
 *        '500':
 *          description: Internal Server Error - Decoding token.
 *
 *      security:
 *       - jwt: []
 */
router.get(
  "/current-session",
  [validate(currentSessionSchema), authenticateJWT],
  currentSession
);

export default router;
