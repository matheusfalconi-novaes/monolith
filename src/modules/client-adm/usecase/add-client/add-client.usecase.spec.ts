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
      document: "document",
      street: "Street",
      city: "City",
      complement: "Complement",
      number: 1,
      state: "State",
      zipCode: "000",
    };

    const output = await useCase.execute(input);

    expect(repository.add).toHaveBeenCalled();
    expect(output.id).toEqual(input.id);
    expect(output.name).toEqual(input.name);
    expect(output.email).toEqual(input.email);
    expect(output.document).toEqual(input.document);
    expect(output.street).toEqual(input.street);
    expect(output.city).toEqual(input.city);
    expect(output.complement).toEqual(input.complement);
    expect(output.number).toEqual(input.number);
    expect(output.state).toEqual(input.state);
    expect(output.zipCode).toEqual(input.zipCode);
  });
});
