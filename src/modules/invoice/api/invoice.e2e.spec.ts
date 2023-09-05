import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import App from "../../api/app";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceController from "./invoice.controller";
import ProductModel from "../repository/product.model";

describe("E2E tests for invoice", () => {
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

  const invoiceRepository = new InvoiceRepository();
  const invoiceUseCase = new FindInvoiceUseCase(invoiceRepository);
  const application = new App([new InvoiceController(invoiceUseCase)]);

  it("should find an invoice", async () => {
    const generateInvoiceUseCase = new GenerateInvoiceUseCase(
      invoiceRepository
    );
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
    const generated = await generateInvoiceUseCase.execute(input);

    const response = await request(application.app)
      .get(`/invoice/${generated.id}`)
      .send();

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(generated.id);
    expect(response.body.name).toBe(generated.name);
    expect(response.body.document).toBe(generated.document);
    expect(response.body.address.street).toBe(generated.street);
    expect(response.body.address.number).toBe(generated.number);
    expect(response.body.address.complement).toBe(generated.complement);
    expect(response.body.address.city).toBe(generated.city);
    expect(response.body.address.state).toBe(generated.state);
    expect(response.body.address.zipCode).toBe(generated.zipCode);
    expect(response.body.items.length).toBe(1);
    expect(response.body.items[0].id).toBe(generated.items[0].id);
    expect(response.body.items[0].name).toBe(generated.items[0].name);
    expect(response.body.items[0].price).toBe(generated.items[0].price);
    expect(response.body.total).toBe(generated.total);
  });

  it("should not find an invoice", async () => {
    const response = await request(application.app).get("/invoice/1").send();

    expect(response.status).toBe(404);
  });
});
