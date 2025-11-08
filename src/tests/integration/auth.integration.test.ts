import request from "supertest";
import app from "../../server";

describe("Auth Integration Tests", () => {
  it("should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ fullName: "John Doe", phone: "254712345078", password: "123456" });

    expect(res.status).toBe(201);
  });
});
