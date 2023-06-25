import AddClientUseCase from "./add-client.usecase";

const MockRepository = () => {
  return {
    add: jest.fn(),
    find: jest.fn(),
  };
};

describe("Add Client UseCase unit test", () => {
  it("should add a client", async () => {
    const repository = MockRepository();
    const useCase = new AddClientUseCase(repository);
    const input = {
      id: "1",
      name: "Client 1",
      email: "x@x.com",
      address: "Address 1",
    };

    const output = await useCase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(output.id).toEqual(input.id);
    expect(output.name).toEqual(input.name);
    expect(output.email).toEqual(input.email);
    expect(output.address).toEqual(input.address);
  });
});
