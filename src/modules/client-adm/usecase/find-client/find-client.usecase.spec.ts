import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import Address from "../../domain/value-object/address.value-object";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "Client 1",
  email: "client@client.com",
  document: "Document",
  address: new Address({
    street: "Street",
    city: "City",
    complement: "Complement",
    number: 1,
    state: "State",
    zipCode: "000",
  }),
});

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(client)),
  };
};

describe("Find Client UseCase unit test", () => {
  it("should find a client", async () => {
    const clientRepository = MockRepository();
    const usecase = new FindClientUseCase(clientRepository);
    const input = {
      id: "1",
    };

    const output = await usecase.execute(input);

    expect(clientRepository.find).toHaveBeenCalled();
    expect(output.id).toBe(input.id);
    expect(output.name).toBe(client.name);
    expect(output.email).toBe(client.email);
    expect(output.document).toBe(client.document);
    expect(output.street).toBe(client.address.street);
    expect(output.city).toBe(client.address.city);
    expect(output.complement).toBe(client.address.complement);
    expect(output.number).toBe(client.address.number);
    expect(output.state).toBe(client.address.state);
    expect(output.zipCode).toBe(client.address.zipCode);
    expect(output.createdAt).toBe(client.createdAt);
    expect(output.updatedAt).toBe(client.updatedAt);
  });
});
