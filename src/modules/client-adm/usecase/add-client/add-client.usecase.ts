import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Client from "../../domain/client.entity";
import Address from "../../domain/value-object/address.value-object";
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
      document: input.document,
      address: new Address({
        street: input.street,
        number: input.number,
        complement: input.complement,
        city: input.city,
        state: input.state,
        zipCode: input.zipCode,
      }),
    });
    await this.clientRepository.add(client);
    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
