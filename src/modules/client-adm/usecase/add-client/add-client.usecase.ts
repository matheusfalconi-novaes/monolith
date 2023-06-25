import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import {
  AddClientUseCaseInputDto,
  AddClientUseCaseOutputDto,
} from "./add-client.usecase.dto";

export default class AddClientUseCase implements UseCaseInterface {
  constructor(private readonly clientRepository: ClientGateway) {}

  async execute(
    input: AddClientUseCaseInputDto
  ): Promise<AddClientUseCaseOutputDto> {
    const client = new Client({
      id: new Id(input.id),
      name: input.name,
      email: input.email,
      address: input.address,
    });
    await this.clientRepository.add(client);
    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
