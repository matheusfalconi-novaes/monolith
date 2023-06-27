import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import PaymentFacadeInterface, {
  PaymentFacadeInputDto,
  PaymentFacadeOutputDto,
} from "./payment.facade.interface";

export interface PaymentFacadeProps {
  processUseCase: UseCaseInterface;
}

export default class PaymentFacade implements PaymentFacadeInterface {
  private readonly processPaymentUseCase: UseCaseInterface;

  constructor(props: PaymentFacadeProps) {
    this.processPaymentUseCase = props.processUseCase;
  }

  process(input: PaymentFacadeInputDto): Promise<PaymentFacadeOutputDto> {
    return this.processPaymentUseCase.execute(input);
  }
}
