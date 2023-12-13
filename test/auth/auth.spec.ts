import { afterAll, describe, it } from "@jest/globals";
import request from "supertest";

import { app, server } from "index";

afterAll(() => {
  server.close();
});

describe("E2E Test - Login", () => {
  it("should return 400 if body is empty", async () => {
    const res = await request(app).post("/auth/login").send().expect(400);
  });
});
