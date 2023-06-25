import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import { ClientModel } from "../repository/client.model";
import ClientGateway from "./client.gateway";

export default class ClientRepository implements ClientGateway {
  async add(client: Client): Promise<void> {
    await ClientModel.create({
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
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
      address: clientFound.address,
      createdAt: clientFound.createdAt,
      updatedAt: clientFound.updatedAt,
    });
  }
}
