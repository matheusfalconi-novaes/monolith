import Id from "../../../@shared/domain/value-object/id.value-object";
import Product from "../../domain/product.entity";
import FindProductUseCase from "./find-product.usecase";

const product = new Product({
  id: new Id("1"),
  name: "Product 1",
  description: "Product 1 Description",
  salesPrice: 100,
});

const MockRepository = () => {
  return {
    findAll: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
  };
};

describe("Find Product usecase unit test", () => {
  it("should find a product", async () => {
    const productGateway = MockRepository();
    const usecase = new FindProductUseCase(productGateway);
    const input = {
      id: "1",
    };

    const output = await usecase.execute(input);

    expect(productGateway.find).toHaveBeenCalled();
    expect(output.id).toBe("1");
    expect(output.name).toBe("Product 1");
    expect(output.description).toBe("Product 1 Description");
    expect(output.salesPrice).toBe(100);
  });
});
