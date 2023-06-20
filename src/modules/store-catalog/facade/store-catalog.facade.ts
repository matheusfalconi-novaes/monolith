import FindAllProductsUseCase from "../usecase/find-all-products/find-all-products.usecase";
import FindProductUseCase from "../usecase/find-product/find-product.usecase";
import StoreCatalogFacadeInterface, {
  FindAllStoreCatalogFacadeOutputDto,
  FindStoreCatalogFacadeInputDto,
  FindStoreCatalogFacadeOutputDto,
} from "./store-catalog.facade.interface";

export type FacadeProps = {
  findUseCase: FindProductUseCase;
  findAllUseCase: FindAllProductsUseCase;
};

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
  private readonly _findUseCase: FindProductUseCase;
  private readonly _findAllUseCase: FindAllProductsUseCase;
  constructor(props: FacadeProps) {
    this._findUseCase = props.findUseCase;
    this._findAllUseCase = props.findAllUseCase;
  }

  find(
    input: FindStoreCatalogFacadeInputDto
  ): Promise<FindStoreCatalogFacadeOutputDto> {
    return this._findUseCase.execute({ id: input.id });
  }
  findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
    return this._findAllUseCase.execute();
  }
}
