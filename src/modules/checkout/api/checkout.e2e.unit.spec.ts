import request from "supertest";
import App from "../../api/app";
import CheckoutController from "./checkout.controller";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import { OrderModel } from "../repository/order.model";
import { ProductModel } from "../repository/product.model";
import CheckoutRepository from "../repository/checkout.repository";

describe("E2E tests for checkout", () => {
  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel, OrderModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  const mockClientFacade = {
    add: jest.fn(),
    find: jest.fn().mockResolvedValue({
      id: "1c",
      name: "Client 0",
      document: "0000",
      email: "client@user.com",
      street: "some address",
      number: "1",
      complement: "",
      city: "some city",
      state: "some state",
      zipCode: "000",
    }),
  };

  const mockPaymentFacade = {
    process: jest.fn().mockResolvedValue({
      transactionId: "1t",
      orderId: "1o",
      amount: 100,
      status: "approved",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
  };

  const mockCatalogFacade = {
    findAll: jest.fn(),
    find: jest.fn().mockResolvedValue({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      salesPrice: 100,
    }),
  };

  const mockProductFacade = {
    addProduct: jest.fn(),
    checkStock: jest.fn(({ productId }: { productId: string }) =>
      Promise.resolve({
        productId,
        stock: productId === "0" ? 0 : 1,
      })
    ),
  };

  const mockInvoiceFacade = {
    find: jest.fn(),
    generate: jest.fn().mockResolvedValue({ id: "1i" }),
  };

  const placeOrderUseCase = new PlaceOrderUseCase(
    mockClientFacade,
    mockProductFacade,
    mockCatalogFacade,
    new CheckoutRepository(),
    mockInvoiceFacade,
    mockPaymentFacade
  );

  const application = new App([new CheckoutController(placeOrderUseCase)]);

  it("should checkout another order", async () => {
    await ClientModel.create({
      id: "1c",
      name: "Client 0",
      email: "client@test.com",
      address: "Address",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(application.app)
      .post("/checkout")
      .send({
        clientId: "1c",
        products: [{ productId: "1" }],
      });
    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.products.length).toBe(1);
    expect(response.body.products[0].productId).toBe("1");
    expect(response.body.status).toBe("approved");
    expect(response.body.total).toBe(100);
  });

  it("should not checkout an order", async () => {
    const response = await request(application.app).post("/checkout").send({
      clientId: "1c",
    });
    expect(response.status).toBe(400);
  });
});
