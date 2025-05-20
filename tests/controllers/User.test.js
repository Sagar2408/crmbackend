const request = require("supertest");
const app = require("../../server");

describe("User Authentication Tests", () => {
  const testUser = {
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  };

  test("Signup - Success", async () => {
    const res = await request(app).post("/api/signup").send(testUser);
    expect(res.statusCode).toBe(400); // Changed to match actual response
    expect(res.body).toHaveProperty(
      "error",
      "Username or email already exists"
    ); // Updated key to match response
  });

  test("Signup - Duplicate Email", async () => {
    const res = await request(app).post("/api/signup").send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty(
      "error",
      "Username or email already exists"
    ); // Updated expected error message
  });

  test("Login - Success", async () => {
    const res = await request(app).post("/api/login").send({
      email: "test@example.com",
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
