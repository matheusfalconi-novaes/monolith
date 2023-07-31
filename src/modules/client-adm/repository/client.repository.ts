import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import { ClientModel } from "./client.model";
import ClientGateway from "../gateway/client.gateway";
import Address from "../domain/value-object/address.value-object";

export default class ClientRepository implements ClientGateway {
  async add(client: Client): Promise<void> {
    await ClientModel.create({
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
    });
  }
  async find(id: string): Promise<Client> {
    const clientFound = await ClientModel.findOne({
      where: { id },
    });
    if (!clientFound) {
      throw new Error(`Client with id ${id} not found`);
    }
    return new Client({
      id: new Id(clientFound.id),
      name: clientFound.name,
      email: clientFound.email,
      document: clientFound.document,
      address: new Address({
        street: clientFound.street,
        city: clientFound.city,
        complement: clientFound.complement,
        number: clientFound.number,
        state: clientFound.state,
        zipCode: clientFound.zipCode,
      }),
      createdAt: clientFound.createdAt,
      updatedAt: clientFound.updatedAt,
    });
  }
}
