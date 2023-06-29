import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDto,
  FindInvoiceFacadeOutputDto,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

type InvoiceProps = {
  find: UseCaseInterface;
  generate: UseCaseInterface;
};

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private readonly _findInvoiceUseCase: UseCaseInterface;
  private readonly _generateInvoiceUseCase: UseCaseInterface;

  constructor(props: InvoiceProps) {
    this._findInvoiceUseCase = props.find;
    this._generateInvoiceUseCase = props.generate;
  }

  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto> {
    return this._findInvoiceUseCase.execute(input);
  }
  generate(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generateInvoiceUseCase.execute(input);
  }
}
