import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { ProductModel } from "../../product-adm/repository/product.model";
import App from "../../api/app";
import ProductsController from "./product.controller";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ProductRepository from "../repository/product.repository";

describe("E2E tests for products", () => {
  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  const addProductUseCase = new AddProductUseCase(new ProductRepository());
  const application = new App([new ProductsController(addProductUseCase)]);

  it("should create a product", async () => {
    const response = await request(application.app).post("/products").send({
      name: "Product ABC",
      description: "Description of Product ABC",
      purchasePrice: 10.0,
      stock: 2,
    });
    expect(response.status).toBe(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe("Product ABC");
    expect(response.body.description).toBe("Description of Product ABC");
    expect(response.body.purchasePrice).toBe(10.0);
    expect(response.body.stock).toBe(2);
    expect(response.body.createdAt).toBeDefined();
    expect(response.body.updatedAt).toBeDefined();
  });

  it("should not create a product", async () => {
    const response = await request(application.app).post("/products").send({
      name: "Product ABC",
    });
    expect(response.status).toBe(400);
  });
});
