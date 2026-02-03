import express from "express";
// import userController from './user.controller';
// import auth from '../../middlewares/auth';
// import validate from '../../middlewares/validate';
// import userValidation from './user.validation';

const router = express.Router();

// router
//   .route('/')
//   .post(validate(userValidation.createUser), userController.createUser)
//   .get(auth('getUsers'), validate(userValidation.getUsers), userController.getUsers);

// router
//   .route('/:userId')
//   .get(auth('getUsers'), validate(userValidation.getUser), userController.getUser)
//   .patch(auth('manageUsers'), validate(userValidation.updateUser), userController.updateUser)
//   .delete(auth('manageUsers'), validate(userValidation.deleteUser), userController.deleteUser);

export default router;
