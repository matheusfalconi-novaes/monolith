import express, { Request, Response, Router } from "express";
import ControllerInterface from "../../@shared/api/controller.interface";
import FindInvoiceUseCase from "../usecase/find-invoice/find-invoice.usecase";

export default class InvoiceController implements ControllerInterface {
  private readonly _path = "/invoice";
  private readonly _router: Router;
  private readonly _usecase: FindInvoiceUseCase;

  constructor(usecase: FindInvoiceUseCase) {
    this._router = express.Router();
    this._usecase = usecase;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this._router.get(`${this._path}/:uid`, this.findInvoice);
  }

  private findInvoice = async (req: Request, resp: Response) => {
    try {
      const invoiceDto = {
        id: req.params.uid,
      };
      const output = await this._usecase.execute(invoiceDto);
      resp.status(200).send(output);
    } catch (err) {
      resp.status(404).send(err);
    }
  };

  get router(): Router {
    return this._router;
  }
}
