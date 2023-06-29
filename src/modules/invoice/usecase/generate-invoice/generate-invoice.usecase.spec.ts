import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
  return {
    find: jest.fn(),
    generate: jest.fn(),
  };
};

describe("GenerateInvoice Usecase unit test", () => {
  it("should generate a invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(invoiceRepository);
    const input = {
      name: "Invoice 1",
      document: "Invoice 1 Document",
      street: "Street",
      number: 1,
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "123",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
        },
      ],
    };

    const output = await usecase.execute(input);

    expect(invoiceRepository.generate).toBeCalled();
    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.items.length).toBe(1);
    expect(output.items[0].id).toBe(input.items[0].id);
    expect(output.items[0].name).toBe(input.items[0].name);
    expect(output.items[0].price).toBe(input.items[0].price);
    expect(output.total).toBe(10);
  });
});
