import { Router } from "express";

export default interface ControllerInterface {
  get router(): Router;
}
