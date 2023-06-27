import { Sequelize } from "sequelize-typescript";
import TransactionModel from "../repository/transaction.model";
import PaymentFacadeFactory from "../factory/payment.facade.factory";

describe("PaymentFacade tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequelize.addModels([TransactionModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should process a payment", async () => {
    const facade = PaymentFacadeFactory.create();
    let input = {
      orderId: "1",
      amount: 100,
    };

    let output = await facade.process(input);

    expect(output.transactionId).toBeDefined();
    expect(output.orderId).toBe(input.orderId);
    expect(output.amount).toBe(input.amount);
    expect(output.status).toBe("approved");
    expect(output.createdAt).toBeDefined();
    expect(output.updatedAt).toBeDefined();

    input.amount = 50;
    output = await facade.process(input);

    expect(output.transactionId).toBeDefined();
    expect(output.orderId).toBe(input.orderId);
    expect(output.amount).toBe(input.amount);
    expect(output.status).toBe("declined");
  });
});
