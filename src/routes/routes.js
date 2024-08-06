import { Router } from "express";
import AuthRouter from "./auth.routes.js";

const Routes = Router();

Routes.use("/auth", AuthRouter);

export default Routes;

