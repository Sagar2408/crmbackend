require("dotenv").config();
const { Sequelize } = require("sequelize");

describe("Sequelize ORM Connection", () => {
  let sequelize;

  beforeAll(() => {
    sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT,
        logging: false,
      }
    );
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should authenticate Sequelize successfully", async () => {
    await expect(sequelize.authenticate()).resolves.not.toThrow();
  });

  it("should have models defined", async () => {
    const db = {};
    db.Sequelize = Sequelize;
    db.sequelize = sequelize;
    db.Users = require("../../models/User.model")(sequelize, Sequelize);
    db.Deal = require("../../models/Deal.model")(sequelize, Sequelize);

    expect(db.Users).toBeDefined();
    expect(db.Deal).toBeDefined();
  });
});
