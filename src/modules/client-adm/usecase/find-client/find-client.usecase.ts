import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientGateway from "../../gateway/client.gateway";
import {
  FindClientUseCaseInputDto,
  FindClientUseCaseOutputDto,
} from "./find-client.usecase.dto";

export default class FindClientUseCase implements UseCaseInterface {
  constructor(private readonly clientRepository: ClientGateway) {}

  async execute(
    input: FindClientUseCaseInputDto
  ): Promise<FindClientUseCaseOutputDto> {
    const client = await this.clientRepository.find(input.id);
    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.address.street,
      city: client.address.city,
      complement: client.address.complement,
      number: client.address.number,
      state: client.address.state,
      zipCode: client.address.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
