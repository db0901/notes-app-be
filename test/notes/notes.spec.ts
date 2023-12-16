import { afterAll, beforeAll, describe, expect, it } from "@jest/globals";
import request from "supertest";

import { app, server } from "index";
import { testUserCredentials } from "../const";

const mainRoute = "/notes";

let authToken = "";
let noteId = "";

beforeAll(async () => {
  const res = await request(app).post("/auth/login").send(testUserCredentials);

  authToken = res.body.authToken;
});

afterAll(async () => {
  server.close();
});

describe("Create Note", () => {
  it("Should return 201 and return the new note properties", async () => {
    const noteTitle = "Test Note - Title";
    const res = await request(app)
      .post(mainRoute)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: noteTitle,
        content: "Test Note - Content",
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe(noteTitle);
    noteId = res.body.noteId;
  });
  it("Should get 400 Bad Request if body is empty", async () => {
    const res = await request(app)
      .post(mainRoute)
      .set("Authorization", `Bearer ${authToken}`)
      .send();

    expect(res.status).toBe(400);
  });
});

describe("Get Notes", () => {
  it("should return all notes", async () => {
    const res = await request(app)
      .get(mainRoute)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty("notes");
    expect(res.body).toHaveProperty("limit");
    expect(res.body).toHaveProperty("page");
    expect(res.body).toHaveProperty("totalPages");
  });

  it("if page and / or limit are negative, should return 400 Bad Request", async () => {
    const res = await request(app)
      .get(`${mainRoute}?page=-1&limit=-1`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(400);
  });

  it("if page is greater than total pages, should return 400 Bad Request", async () => {
    const res = await request(app)
      .get(`${mainRoute}?page=100&limit=10`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(400);
  });

  it("should return a single note", async () => {
    const res = await request(app)
      .get(`${mainRoute}/${noteId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("noteId");
    expect(res.body).toHaveProperty("title");
    expect(res.body).toHaveProperty("content");
    expect(res.body).toHaveProperty("createdAt");
    expect(res.body).toHaveProperty("updatedAt");
  });
  it("should return 404 if note is not found", async () => {
    const res = await request(app)
      .get(`${mainRoute}/${noteId.slice(0, noteId.length - 1) + "a"}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });
  it("should return 400 if pagination values are incorrect", async () => {
    const res = await request(app)
      .get(`${mainRoute}?page=0&limit=abc`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(400);
  });
});

describe("Update Note", () => {
  it("should return 200 if note is updated", async () => {
    const updatedNoteTitle = "Updated Note - Title";
    const updateRes = await request(app)
      .patch(`${mainRoute}/${noteId}`)
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        title: updatedNoteTitle,
      });

    expect(updateRes.status).toBe(200);

    const getNoteRes = await request(app)
      .get(`${mainRoute}/${noteId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(getNoteRes.status).toBe(200);
    expect(getNoteRes.body.title).toBe(updatedNoteTitle);
  });
  it("should return 404 if note is not found", async () => {
    const res = await request(app)
      .patch(`${mainRoute}/${noteId.slice(0, noteId.length - 1) + "a"}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });
});

describe("Delete Note", () => {
  it("should return 200 if note is deleted", async () => {
    const res = await request(app)
      .delete(`${mainRoute}/${noteId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(200);
  });
  it("should return 404 if note is not found", async () => {
    // previously deleted
    const res = await request(app)
      .delete(`${mainRoute}/${noteId}`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(res.status).toBe(404);
  });
});
