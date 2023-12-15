import { afterAll, describe, expect, it } from "@jest/globals";
import request from "supertest";

import { app, server } from "index";
import { User } from "schemas/user";
import { testUserCredentials, testUserCredentialsWithUsername } from "../const";

let authToken = "";
let userId = "";

afterAll(async () => {
  server.close();
});

describe("Login", () => {
  it("if user credentials are right should return 200 OK and return an authToken property in the body", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send(testUserCredentials);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("authToken");
    authToken = res.body.authToken;
  });

  it("should return 400 Bad Request if body is empty", async () => {
    await request(app).post("/auth/login").send().expect(400);
  });

  it("if user password is wrong should return 401 Unauthorized", async () => {
    await request(app)
      .post("/auth/login")
      .send({
        email: "test@test.com",
        password: "test_password_wrong",
      })
      .expect(401);
  });

  it("if user email is wrong should return 401 Unathorized", async () => {
    await request(app)
      .post("/auth/login")
      .send({
        email: "test@test-wrong.com",
        password: "test_password",
      })
      .expect(401);
  });
});

describe("Current session", () => {
  it("should return 200 OK if there is a valid authToken on headers", async () => {
    const res = await request(app)
      .get("/auth/current-session")
      .set("Authorization", `Bearer ${authToken}`)
      .expect(200);

    userId = res.body.userId;

    expect(res.body).toHaveProperty("email");
    expect(res.body).toHaveProperty("expiresAt");
    expect(res.body).toHaveProperty("issuedAt");
    expect(res.body).toHaveProperty("userId");
    expect(res.body).toHaveProperty("username");
  });

  it("should return 400 Bad Request if there is no authToken on headers", async () => {
    await request(app).get("/auth/current-session").expect(400);
  });
});

// Register at last to always have a test user with the same credentials
// to be able to use that user in other tests
describe("Register", () => {
  it("should return 201 Created and return an authToken property in the body", async () => {
    await User.findByIdAndDelete(userId);
    const res = await request(app)
      .post("/auth/register")
      .send(testUserCredentialsWithUsername);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("authToken");
    expect(res.body).toHaveProperty("username");
  });

  it("should return 400 Bad Request if body is empty", async () => {
    await request(app).post("/auth/register").send().expect(400);
  });

  it("should return 409 Conflict if user already exists", async () => {
    await request(app)
      .post("/auth/register")
      .send(testUserCredentialsWithUsername);
  });
});
