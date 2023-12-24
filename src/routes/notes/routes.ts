import express from "express";

// notes
import { create, findAll, findOne, remove, update } from "./controllers";
import {
  createSchema,
  findAllSchema,
  findOneSchema,
  removeSchema,
  updateSchema,
} from "./validation";

// middlewares
import { authenticateJWT } from "middleware/authenticateJWT";
import { validate } from "middleware/validate";

const router = express.Router();

/**
 * @openapi
 * /notes:
 *    post:
 *      tags:
 *        - notes
 *      summary: "Create user note"
 *      description: This endpoint creates a note for an existing user.
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: JWT token with 'Bearer' prefix. Returned from Login or register process.
 *          type: string
 *          required: true
 *          example: Bearer <JWT>
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                    required: true
 *                  content:
 *                    type: string
 *      responses:
 *        '201':
 *          description: Successfully created note.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  userId:
 *                    type: string
 *                  noteId:
 *                    type: string
 *                  title:
 *                    type: string
 *                  content:
 *                    type: string
 *                  createdAt:
 *                    type: string
 *                  updatedAt:
 *                    type: string
 *        '400':
 *          description: Bad Request - email or password not sent.
 *        '403':
 *          description: Could not find any user with the provided credentials (User Id inside JWT).
 *
 *      security:
 *       - jwt: []
 */
router.post("/", [validate(createSchema), authenticateJWT], create);

/**
 * @openapi
 * /notes:
 *    get:
 *      tags:
 *        - notes
 *      summary: "Get all user notes"
 *      description: This endpoint returns all notes for an existing user.
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: JWT token with 'Bearer' prefix. Returned from Login or register process.
 *          type: string
 *          required: true
 *          example: Bearer <JWT>
 *        - in: query
 *          name: page
 *          description: Page number
 *          type: string
 *          example: 1
 *        - in: query
 *          name: limit
 *          description: Number of notes per page
 *          type: string
 *          example: 10
 *      responses:
 *        '200':
 *          description: Successfully returned all notes for an existing user.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  notes:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        noteId:
 *                          type: string
 *                        title:
 *                          type: string
 *                        content:
 *                          type: string
 *                        createdAt:
 *                          type: string
 *                        updatedAt:
 *                          type: string
 *                  limit:
 *                    type: string
 *                  page:
 *                    type: string
 *                  totalPages:
 *                    type: string
 *        '400':
 *          description: Bad Request - page not found.
 *        '403':
 *          description: Could not find any user with the provided credentials (User Id inside JWT).
 *
 *      security:
 *       - jwt: []
 */
router.get("/", [validate(findAllSchema), authenticateJWT], findAll);

/**
 * @openapi
 * /notes/{id}:
 *    get:
 *      tags:
 *        - notes
 *      summary: "Get one user note"
 *      description: This endpoint returns one note for an existing user.
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: JWT token with 'Bearer' prefix. Returned from Login or register process.
 *          type: string
 *          required: true
 *          example: Bearer <JWT>
 *        - in: query
 *          name: path
 *          description: Note Id
 *          type: string
 *          required: true
 *      responses:
 *        '200':
 *          description: Successfully returned a single note for an existing user.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  noteId:
 *                    type: string
 *                  title:
 *                    type: string
 *                  content:
 *                    type: string
 *                  createdAt:
 *                    type: string
 *                  updatedAt:
 *                    type: string
 *        '400':
 *          description: Bad Request - not valid note ID.
 *        '403':
 *          description: UserId is not the same as the userId in the note.
 *        '404':
 *          description: Note not found.
 *
 *      security:
 *       - jwt: []
 */
router.get("/:id", [validate(findOneSchema), authenticateJWT], findOne);

/**
 * @openapi
 * /notes/{id}:
 *    patch:
 *      tags:
 *        - notes
 *      summary: "Update user note"
 *      description: This endpoint updates a note for an existing user.
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: JWT token with 'Bearer' prefix. Returned from Login or register process.
 *          type: string
 *          required: true
 *        - in: query
 *          name: path
 *          description: Note Id
 *          type: string
 *          required: true
 *      requestBody:
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  title:
 *                    type: string
 *                  content:
 *                    type: string
 *      responses:
 *        '200':
 *          description: Successfully updated note.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  updated:
 *                    type: string
 *        '400':
 *          description: Bad Request - not valid note ID.
 *        '403':
 *          description: UserId is not the same as the userId in the note.
 *        '404':
 *          description: Note not found.
 *
 *      security:
 *       - jwt: []
 */
router.patch("/:id", [validate(updateSchema), authenticateJWT], update);

/**
 * @openapi
 * /notes/{id}:
 *    delete:
 *      tags:
 *        - notes
 *      summary: "Delete a user note"
 *      description: This endpoint updates a note for an existing user.
 *      parameters:
 *        - in: header
 *          name: Authorization
 *          description: JWT token with 'Bearer' prefix. Returned from Login or register process.
 *          type: string
 *          required: true
 *        - in: query
 *          name: path
 *          description: Note Id
 *          type: string
 *          required: true
 *      responses:
 *        '200':
 *          description: Successfully updated note.
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  deleted:
 *                    type: string
 *        '400':
 *          description: Bad Request - not valid note ID.
 *        '403':
 *          description: UserId is not the same as the userId in the note.
 *        '404':
 *          description: Note not found.
 *
 *      security:
 *       - jwt: []
 */
router.delete("/:id", [validate(removeSchema), authenticateJWT], remove);

export default router;
