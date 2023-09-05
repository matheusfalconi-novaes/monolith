import express, { Request, Response, Router } from "express";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import ControllerInterface from "../../@shared/api/controller.interface";

export default class CheckoutController implements ControllerInterface {
  private _path = "/checkout";
  private _router: Router;
  private _usecase: PlaceOrderUseCase;

  constructor(usecase: PlaceOrderUseCase) {
    this._router = express.Router();
    this._usecase = usecase;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this._router.post(this._path, this.checkout);
  }

  private checkout = async (req: Request, resp: Response) => {
    try {
      const placeOrderDto = {
        clientId: req.body.clientId,
        products: req.body.products,
      };
      const output = await this._usecase.execute(placeOrderDto);
      resp.status(200).send(output);
    } catch (err) {
      resp.status(400).send(err);
    }
  };

  get router(): Router {
    return this._router;
  }
}
