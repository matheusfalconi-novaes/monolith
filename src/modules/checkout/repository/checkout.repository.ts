import Id from "../../@shared/domain/value-object/id.value-object";
import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { ClientModel } from "./client.model";
import { OrderModel } from "./order.model";
import { ProductModel } from "./product.model";

export default class CheckoutRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await OrderModel.create(
      {
        id: order.id.id,
        status: order.status,
        total: order.total,
        client_id: order.client.id.id,
        products: order.products.map((item) => ({
          id: item.id.id,
          name: item.name,
          description: item.description,
          salesPrice: item.salesPrice,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        })),
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
      {
        include: [{ model: ProductModel }],
      }
    );
  }
  async findOrder(id: string): Promise<Order> {
    let orderFound;
    try {
      orderFound = await OrderModel.findOne({
        where: { id },
        rejectOnEmpty: true,
        include: [{ model: ProductModel }, { model: ClientModel }],
      });
    } catch (error) {
      throw new Error("Customer not found");
    }
    const products = orderFound.products.map(
      (product) =>
        new Product({
          id: new Id(product.id),
          name: product.name,
          description: product.description,
          salesPrice: product.salesPrice,
        })
    );
    const client = new Client({
      id: new Id(orderFound.client.id),
      name: orderFound.client.name,
      address: orderFound.client.address,
      email: orderFound.client.email,
    });
    return new Order({
      id: new Id(orderFound.id),
      client,
      products,
    });
  }
}
