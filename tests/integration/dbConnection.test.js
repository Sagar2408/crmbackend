require("dotenv").config();
const mysql = require("mysql2");

describe("MySQL Database Connection", () => {
  let db;

  beforeAll(() => {
    db = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3300,
    });
  });

  afterAll(() => {
    db.end();
  });

  it("should connect to MySQL database successfully", (done) => {
    db.connect((err) => {
      expect(err).toBeNull(); // Expect no errors
      done();
    });
  });
});
