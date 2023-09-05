import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ClientRepository from "../repository/client.repository";
import App from "../../api/app";
import ClientsController from "./client.controller";

describe("E2E tests for clients", () => {
  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  const addClientUseCase = new AddClientUseCase(new ClientRepository());
  const application = new App([new ClientsController(addClientUseCase)]);

  it("should create a client", async () => {
    const response = await request(application.app).post("/clients").send({
      name: "John",
      email: "john@test.com",
      document: "12345",
      street: "Street",
      city: "City",
      complement: "Complement",
      number: 1,
      state: "State",
      zipCode: "12345678",
    });
    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("John");
    expect(response.body.email).toBe("john@test.com");
    expect(response.body.document).toBe("12345");
    expect(response.body.street).toBe("Street");
    expect(response.body.city).toBe("City");
    expect(response.body.complement).toBe("Complement");
    expect(response.body.number).toBe(1);
    expect(response.body.state).toBe("State");
    expect(response.body.zipCode).toBe("12345678");
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
  });

  it("should not create a client", async () => {
    const response = await request(application.app).post("/clients").send({
      name: "John",
    });
    expect(response.status).toBe(400);
  });
});
