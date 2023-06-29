import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import Address from "../../domain/value-object/address.value-object";
import FindInvoiceUseCase from "./find-invoice.usecase";

const address = new Address({
  street: "Street",
  number: 1,
  complement: "Complement",
  city: "City",
  state: "State",
  zipCode: "123",
});
const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  price: 10,
});
const invoice = new Invoice({
  id: new Id("1"),
  name: "Invoice 1",
  document: "Invoice 1 Document",
  address,
  items: [product],
});

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    generate: jest.fn(),
  };
};

describe("FindInvoice UseCase unit test", () => {
  it("should find a invoice", async () => {
    const invoiceRepository = MockRepository();
    const usecase = new FindInvoiceUseCase(invoiceRepository);
    const input = {
      id: "1",
    };

    const output = await usecase.execute(input);

    expect(invoiceRepository.find).toBeCalled();
    expect(output.id).toBe("1");
    expect(output.name).toBe("Invoice 1");
    expect(output.document).toBe("Invoice 1 Document");
    expect(output.address.street).toBe("Street");
    expect(output.address.number).toBe(1);
    expect(output.address.complement).toBe("Complement");
    expect(output.address.city).toBe("City");
    expect(output.address.state).toBe("State");
    expect(output.address.zipCode).toBe("123");
    expect(output.items.length).toBe(1);
    expect(output.items[0].id).toBe("1");
    expect(output.items[0].name).toBe("Product 1");
    expect(output.items[0].price).toBe(10);
    expect(output.total).toBe(10);
    expect(output.createdAt).toBeDefined();
  });
});
