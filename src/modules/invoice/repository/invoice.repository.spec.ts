import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import ProductModel from "./product.model";
import Invoice from "../domain/invoice.entity";
import InvoiceRepository from "./invoice.repository";
import Address from "../domain/value-object/address.value-object";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("Invoice repository tests", () => {
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
    const invoiceRepository = new InvoiceRepository();
    const invoice = new Invoice({
      id: new Id("1"),
      name: "Invoice 1",
      document: "Invoice 1 document",
      address: new Address({
        street: "Street",
        number: 1,
        complement: "Complement",
        city: "City",
        state: "State",
        zipCode: "123",
      }),
      items: [
        new Product({
          id: new Id("1"),
          name: "Product 1",
          price: 10,
        }),
      ],
    });
    await invoiceRepository.generate(invoice);

    const found = await invoiceRepository.find("1");

    expect(found.id.id).toBe(invoice.id.id);
    expect(found.name).toBe(invoice.name);
    expect(found.document).toBe(invoice.document);
    expect(found.address.street).toBe(invoice.address.street);
    expect(found.address.number).toBe(invoice.address.number);
    expect(found.address.complement).toBe(invoice.address.complement);
    expect(found.address.city).toBe(invoice.address.city);
    expect(found.address.state).toBe(invoice.address.state);
    expect(found.address.zipCode).toBe(invoice.address.zipCode);
    expect(found.items.length).toBe(1);
    expect(found.items[0].id.id).toBe(invoice.items[0].id.id);
    expect(found.items[0].name).toBe(invoice.items[0].name);
    expect(found.items[0].price).toBe(invoice.items[0].price);
    expect(found.total).toBe(invoice.total);
    expect(found.createdAt).toStrictEqual(invoice.createdAt);
    expect(found.updatedAt).toStrictEqual(invoice.updatedAt);
  });

  it("should generate a invoice", async () => {
    const invoiceRepository = new InvoiceRepository();
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
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await invoiceRepository.generate(invoice);

    const generated = await InvoiceModel.findOne({
      where: { id: invoice.id.id },
      include: [{ model: ProductModel }],
    });

    expect(generated.id).toBe(invoice.id.id);
    expect(generated.name).toBe(invoice.name);
    expect(generated.document).toBe(invoice.document);
    expect(generated.street).toBe(invoice.address.street);
    expect(generated.number).toBe(invoice.address.number);
    expect(generated.complement).toBe(invoice.address.complement);
    expect(generated.city).toBe(invoice.address.city);
    expect(generated.state).toBe(invoice.address.state);
    expect(generated.zipCode).toBe(invoice.address.zipCode);
    expect(generated.items.length).toBe(1);
    expect(generated.items[0].id).toBe(invoice.items[0].id.id);
    expect(generated.items[0].name).toBe(invoice.items[0].name);
    expect(generated.items[0].price).toBe(invoice.items[0].price);
    expect(generated.total).toBe(invoice.total);
    expect(generated.createdAt).toStrictEqual(invoice.createdAt);
    expect(generated.updatedAt).toStrictEqual(invoice.updatedAt);
  });
});
