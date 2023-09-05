import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "./product.model";
import { OrderModel } from "./order.model";
import { ClientModel } from "./client.model";
import Order from "../domain/order.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import CheckoutRepository from "./checkout.repository";

describe("Checkout repository tests", () => {
  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ClientModel, ProductModel, OrderModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should add an order", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "client@test.com",
      address: "Address",
    });
    const product = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 Description",
      salesPrice: 10.0,
    });
    const order = new Order({
      id: new Id("1"),
      client,
      products: [product],
    });

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
    const checkoutRepository = new CheckoutRepository();

    await checkoutRepository.addOrder(order);

    const orderCreated = await OrderModel.findOne({
      where: { id: "1" },
      include: ["products", "client"],
    });
    expect(orderCreated.id).toBe("1");
    expect(orderCreated.updatedAt).toBeDefined();
    expect(orderCreated.createdAt).toBeDefined();
    expect(orderCreated.client).toBeDefined();
    expect(orderCreated.client.id).toBe(client.id.id);
    expect(orderCreated.client.name).toBe(client.name);
    expect(orderCreated.client.email).toBe(client.email);
    expect(orderCreated.client.address).toBe(client.address);
    expect(orderCreated.client.createdAt).toStrictEqual(client.createdAt);
    expect(orderCreated.client.updatedAt).toStrictEqual(client.updatedAt);
    expect(orderCreated.products.length).toBe(1);
    expect(orderCreated.products[0].id).toBe("1");
    expect(orderCreated.products[0].name).toBe("Product 1");
    expect(orderCreated.products[0].description).toBe("Product 1 Description");
    expect(orderCreated.products[0].salesPrice).toBe(10.0);
    expect(orderCreated.products[0].createdAt).toBeDefined();
    expect(orderCreated.products[0].updatedAt).toBeDefined();
  });

  it("should find an order", async () => {
    const client = new Client({
      id: new Id("1"),
      name: "Client 1",
      email: "client@test.com",
      address: "Address",
    });
    const product = new Product({
      id: new Id("1"),
      name: "Product 1",
      description: "Product 1 Description",
      salesPrice: 10.0,
    });
    const order = new Order({
      id: new Id("1"),
      client,
      products: [product],
    });

    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    });
    await OrderModel.create(
      {
        id: order.id.id,
        status: order.status,
        total: order.total,
        client_id: order.client.id.id,
        products: order.products.map((item) => ({
          id: item.id.id,
          name: item.name,
          description: item.description,
          salesPrice: item.salesPrice,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      {
        include: [{ model: ProductModel }],
      }
    );

    const checkoutRepository = new CheckoutRepository();
    const orderFound = await checkoutRepository.findOrder("1");

    expect(orderFound.id.id).toBe("1");
    expect(orderFound.updatedAt).toBeDefined();
    expect(orderFound.createdAt).toBeDefined();
    expect(orderFound.client).toBeDefined();
    expect(orderFound.client.id.id).toBe("1");
    expect(orderFound.client.name).toBe("Client 1");
    expect(orderFound.client.email).toBe("client@test.com");
    expect(orderFound.client.address).toBe("Address");
    expect(orderFound.client.createdAt).toBeDefined();
    expect(orderFound.client.updatedAt).toBeDefined();
    expect(orderFound.products.length).toBe(1);
    expect(orderFound.products[0].id.id).toBe("1");
    expect(orderFound.products[0].name).toBe("Product 1");
    expect(orderFound.products[0].description).toBe("Product 1 Description");
    expect(orderFound.products[0].salesPrice).toBe(10.0);
    expect(orderFound.products[0].createdAt).toBeDefined();
    expect(orderFound.products[0].updatedAt).toBeDefined();
  });
});
