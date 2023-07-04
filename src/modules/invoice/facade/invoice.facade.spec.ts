import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import ProductModel from "../repository/product.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("InvoiceFacade tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should find a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const invoice = await facade.generate({
      name: "Invoice 1",
      document: "Invoice 1 document",
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
    });

    const found = await facade.find({ id: invoice.id });

    expect(found.id).toBe(invoice.id);
    expect(found.name).toBe(invoice.name);
    expect(found.document).toBe(invoice.document);
    expect(found.address.street).toBe(invoice.street);
    expect(found.address.number).toBe(invoice.number);
    expect(found.address.complement).toBe(invoice.complement);
    expect(found.address.city).toBe(invoice.city);
    expect(found.address.state).toBe(invoice.state);
    expect(found.address.zipCode).toBe(invoice.zipCode);
    expect(found.items.length).toBe(1);
    expect(found.items[0].id).toBe(invoice.items[0].id);
    expect(found.items[0].name).toBe(invoice.items[0].name);
    expect(found.items[0].price).toBe(invoice.items[0].price);
    expect(found.total).toBe(invoice.total);
  });

  it("should generate a invoice", async () => {
    const facade = InvoiceFacadeFactory.create();
    const input = {
      name: "Invoice",
      document: "Invoice document",
      street: "Street",
      number: 1,
      complement: "Complement",
      city: "City",
      state: "State",
      zipCode: "12345678",
      items: [
        {
          id: "1",
          name: "Product 1",
          price: 10,
        },
      ],
    };

    const generated = await facade.generate(input);

    expect(generated).toBeDefined();
    expect(generated.id).toBeDefined();
    expect(generated.name).toBe(input.name);
    expect(generated.document).toBe(input.document);
    expect(generated.street).toBe(input.street);
    expect(generated.number).toBe(input.number);
    expect(generated.complement).toBe(input.complement);
    expect(generated.city).toBe(input.city);
    expect(generated.state).toBe(input.state);
    expect(generated.zipCode).toBe(input.zipCode);
    expect(generated.items.length).toBe(1);
    expect(generated.items[0].id).toBe(input.items[0].id);
    expect(generated.items[0].name).toBe(input.items[0].name);
    expect(generated.items[0].price).toBe(input.items[0].price);
    expect(generated.total).toBe(10);
  });
});
