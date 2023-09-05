import express, { Request, Response, Router } from "express";
import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import ControllerInterface from "../../@shared/api/controller.interface";

export default class ClientsController implements ControllerInterface {
  private _path = "/clients";
  private _router: Router;
  private _usecase: AddClientUseCase;

  constructor(usecase: AddClientUseCase) {
    this._router = express.Router();
    this._usecase = usecase;
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this._router.post(this._path, this.addClient);
  }

  private addClient = async (req: Request, resp: Response) => {
    try {
      const clientDto = {
        name: req.body.name,
        email: req.body.email,
        document: req.body.document,
        street: req.body.street,
        city: req.body.city,
        complement: req.body.complement,
        number: req.body.number,
        state: req.body.state,
        zipCode: req.body.zipCode,
      };
      const output = await this._usecase.execute(clientDto);
      resp.status(200).send(output);
    } catch (err) {
      resp.status(400).send(err);
    }
  };

  get router(): Router {
    return this._router;
  }
}
