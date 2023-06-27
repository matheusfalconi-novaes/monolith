import Id from "../../../@shared/domain/value-object/id.value-object";
import Transaction from "../../domain/transaction";
import ProcessPaymentUseCase from "./process-payment.usecase";

let transaction: Transaction;
const MockRepository = (input?: { orderId: string; amount: number }) => {
  transaction = new Transaction({
    id: new Id("1"),
    orderId: input?.orderId || "1",
    amount: input?.amount || 100,
  });
  transaction.process();
  return {
    save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
  };
};

describe("Process payment usecase unit test", () => {
  it("should approve a transaction", async () => {
    const paymentRepository = MockRepository();
    const usecase = new ProcessPaymentUseCase(paymentRepository);
    const input = {
      orderId: "1",
      amount: 100,
    };

    const output = await usecase.execute(input);

    expect(paymentRepository.save).toHaveBeenCalled();
    expect(output.transactionId).toBe(transaction.id.id);
    expect(output.orderId).toBe("1");
    expect(output.amount).toBe(100);
    expect(output.status).toBe("approved");
    expect(output.createdAt).toEqual(transaction.createdAt);
    expect(output.updatedAt).toEqual(transaction.updatedAt);
  });

  it("should decline a transaction", async () => {
    const paymentRepository = MockRepository({ orderId: "1", amount: 50 });
    const usecase = new ProcessPaymentUseCase(paymentRepository);
    const input = {
      orderId: "1",
      amount: 50,
    };

    const output = await usecase.execute(input);

    expect(paymentRepository.save).toHaveBeenCalled();
    expect(output.transactionId).toBe(transaction.id.id);
    expect(output.orderId).toBe("1");
    expect(output.amount).toBe(50);
    expect(output.status).toBe("declined");
    expect(output.createdAt).toEqual(transaction.createdAt);
    expect(output.updatedAt).toEqual(transaction.updatedAt);
  });
});
