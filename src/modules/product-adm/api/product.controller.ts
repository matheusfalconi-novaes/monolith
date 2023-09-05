import express, { Request, Response, Router } from "express";
import AddProductUseCase from "../usecase/add-product/add-product.usecase";
import ControllerInterface from "../../@shared/api/controller.interface";

export default class ProductsController implements ControllerInterface {
  private _path = "/products";
  private _router: Router;
  private _usecase: AddProductUseCase;

  constructor(usecase: AddProductUseCase) {
    this._router = express.Router();
    this._usecase = usecase;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this._router.post(this._path, this.addProduct);
  }

  private addProduct = async (req: Request, resp: Response) => {
    try {
      const productDto = {
        name: req.body.name,
        description: req.body.description,
        purchasePrice: req.body.purchasePrice,
        stock: req.body.stock,
      };
      const output = await this._usecase.execute(productDto);
      resp.status(200).send(output);
    } catch (err) {
      resp.status(400).send(err);
    }
  };

  get router(): Router {
    return this._router;
  }
}
