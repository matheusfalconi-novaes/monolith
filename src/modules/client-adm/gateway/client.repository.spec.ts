import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ClientRepository from "./client.repository";

describe("ClientRepository tests", () => {
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

  it("should create a Client", async () => {
    const clientRepository = new ClientRepository();
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "client1@client.com",
      address: "Address Client 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await clientRepository.add(client);
    const inserted = await ClientModel.findOne({
      where: { id: client.id.id },
    });

    expect(inserted.id).toEqual(client.id.id);
    expect(inserted.name).toEqual(client.name);
    expect(inserted.email).toEqual(client.email);
    expect(inserted.address).toEqual(client.address);
    expect(inserted.createdAt).toEqual(client.createdAt);
    expect(inserted.updatedAt).toEqual(client.updatedAt);
  });

  it("should find a Client", async () => {
    const client = await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "client1@client.com",
      address: "Address Client 1",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientRepository = new ClientRepository();
    const found = await clientRepository.find("1");

    expect(found.id.id).toEqual(client.id);
    expect(found.name).toEqual(client.name);
    expect(found.email).toEqual(client.email);
    expect(found.address).toEqual(client.address);
    expect(found.createdAt).toEqual(client.createdAt);
    expect(found.updatedAt).toEqual(client.updatedAt);
  });
});
