import { Router } from "express";

import AuthRouter from "./auth.routes.js";
import PostRouter from "./post.routes.js";

const Routes = Router();

Routes.use("/auth", AuthRouter);
Routes.use("/post", PostRouter);

export default Routes;

