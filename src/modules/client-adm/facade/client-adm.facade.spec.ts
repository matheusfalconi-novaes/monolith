import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import ClientAdmFacadeFactory from "../factory/client-adm.facade.factory";

describe("ClientAdmFacade tests", () => {
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

  it("should create a client", async () => {
    const facadeFactory = ClientAdmFacadeFactory.create();
    const input = {
      id: "1",
      name: "Client 1",
      email: "client@client.com",
      address: "Address",
    };

    await facadeFactory.add(input);

    const client = await ClientModel.findOne({
      where: { id: input.id },
    });

    expect(client).toBeDefined();
    expect(client.id).toEqual(input.id);
    expect(client.name).toEqual(input.name);
    expect(client.email).toEqual(input.email);
    expect(client.address).toEqual(input.address);
  });

  it("should find a client", async () => {
    const created = await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "client@client.com",
      address: "Address",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    const facadeFactory = ClientAdmFacadeFactory.create();
    const input = { id: "1" };

    const client = await facadeFactory.find(input);

    expect(client.id).toEqual(created.id);
    expect(client.name).toEqual(created.name);
    expect(client.email).toEqual(created.email);
    expect(client.address).toEqual(created.address);
    expect(client.createdAt).toEqual(created.createdAt);
    expect(client.updatedAt).toEqual(created.updatedAt);
  });
});
