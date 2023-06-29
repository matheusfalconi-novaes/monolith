import {
  Column,
  ForeignKey,
  PrimaryKey,
  Table,
  BelongsTo,
  Model,
} from "sequelize-typescript";
import InvoiceModel from "./invoice.model";

@Table({
  tableName: "products",
  timestamps: false,
})
export default class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  price: number;

  @ForeignKey(() => InvoiceModel)
  @Column({ allowNull: true })
  declare invoiceId: string;

  @BelongsTo(() => InvoiceModel)
  declare invoice: Awaited<InvoiceModel>;
}
