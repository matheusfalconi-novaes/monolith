import ClientAdmFacade from "../facade/client-adm.facade";
import ClientRepository from "../gateway/client.repository";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";

export default class ClientAdmFacadeFactory {
  static create() {
    const clientRepository = new ClientRepository();
    const addUsecase = new AddClientUseCase(clientRepository);
    const findUsecase = new FindClientUseCase(clientRepository);
    return new ClientAdmFacade({
      addUsecase,
      findUsecase,
    });
  }
}
