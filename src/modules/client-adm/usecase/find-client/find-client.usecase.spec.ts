import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import FindClientUseCase from "./find-client.usecase";

const client = new Client({
  id: new Id("1"),
  name: "Client 1",
  email: "client@client.com",
  address: "Address",
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
    expect(output.address).toBe(client.address);
    expect(output.createdAt).toBe(client.createdAt);
    expect(output.updatedAt).toBe(client.updatedAt);
  });
});
