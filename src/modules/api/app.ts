import express, { Express } from "express";
import ControllerInterface from "../@shared/api/controller.interface";

export default class App {
  private _app: Express;
  private _port: number;

  constructor(controllers: ControllerInterface[], port: number = 3000) {
    this._app = express();
    this._port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this._app.use(express.json());
  }

  private initializeControllers(controllers: ControllerInterface[]) {
    controllers.forEach((controller) => {
      this._app.use("/", controller.router);
    });
  }

  public start(): void {
    this._app.listen(this._port, () => {
      console.log(`Server is listening on port ${this._port}`);
    });
  }

  get app(): Express {
    return this._app;
  }
}
