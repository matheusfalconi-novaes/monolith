import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "./client.model";
import Client from "../domain/client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import ClientRepository from "./client.repository";
import Address from "../domain/value-object/address.value-object";

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
      document: "document",
      address: new Address({
        street: "Street",
        city: "City",
        complement: "Complement",
        number: 1,
        state: "State",
        zipCode: "000",
      }),
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
    expect(inserted.document).toEqual(client.document);
    expect(inserted.street).toEqual(client.address.street);
    expect(inserted.city).toEqual(client.address.city);
    expect(inserted.complement).toEqual(client.address.complement);
    expect(inserted.number).toEqual(client.address.number);
    expect(inserted.state).toEqual(client.address.state);
    expect(inserted.zipCode).toEqual(client.address.zipCode);
    expect(inserted.createdAt).toEqual(client.createdAt);
    expect(inserted.updatedAt).toEqual(client.updatedAt);
  });

  it("should find a Client", async () => {
    const client = await ClientModel.create({
      id: "1",
      name: "Client 1",
      email: "client1@client.com",
      document: "Document",
      street: "Street",
      city: "City",
      complement: "Complement",
      number: 1,
      state: "State",
      zipCode: "000",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const clientRepository = new ClientRepository();
    const found = await clientRepository.find("1");

    expect(found.id.id).toEqual(client.id);
    expect(found.name).toEqual(client.name);
    expect(found.email).toEqual(client.email);
    expect(found.document).toEqual(client.document);
    expect(found.address.street).toEqual(client.street);
    expect(found.createdAt).toEqual(client.createdAt);
    expect(found.updatedAt).toEqual(client.updatedAt);
  });
});
