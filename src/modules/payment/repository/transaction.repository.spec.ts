import { Sequelize } from "sequelize-typescript";
import TransactionModel from "./transaction.model";
import TransactionRepository from "./transaction.repository";
import Transaction from "../domain/transaction";
import Id from "../../@shared/domain/value-object/id.value-object";

describe("TransactionRepository tests", () => {
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

  it("should save a transaction", async () => {
    const transaction = new Transaction({
      id: new Id("1"),
      amount: 100,
      orderId: "1",
    });
    transaction.approve();
    const transactionRepository = new TransactionRepository();

    await transactionRepository.save(transaction);
    const savedTransaction = await TransactionModel.findOne({
      where: { id: "1" },
    });

    expect(savedTransaction.id).toBe(transaction.id.id);
    expect(savedTransaction.amount).toBe(transaction.amount);
    expect(savedTransaction.orderId).toBe(transaction.orderId);
    expect(savedTransaction.status).toBe(transaction.status);
    expect(savedTransaction.updatedAt).toStrictEqual(transaction.updatedAt);
    expect(savedTransaction.createdAt).toStrictEqual(transaction.createdAt);
  });
});
