import express from "express";
import userRoute from "../modules/user/routes/user.route";
// import authRoute from '../modules/auth/auth.route';

const router = express.Router();

const defaultRoutes = [
  {
    path: "/users",
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
