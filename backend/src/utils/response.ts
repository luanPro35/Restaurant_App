export const successResponse = (res: any, data: any, message = "Success") => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};
