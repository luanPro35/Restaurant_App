import joi from "joi";
// import httpStatus from 'http-status';
// import pick from '../utils/pick';
// import ApiError from '../utils/ApiError';

const validate = (schema: object) => (req: any, res: any, next: any) => {
  next();
};

export default validate;
