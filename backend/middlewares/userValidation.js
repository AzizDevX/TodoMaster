import Joi from "joi";

function RegisterValidation(req, res, next) {
  const registerSchema = Joi.object({
    Email: Joi.string().email().max(100).required(),
    UserName: Joi.string().min(3).max(64).required(),
    Password: Joi.string().min(6).required(),
  });
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: `Error: ${error.details[0].message}` });
  }
  next();
}

function LoginValidation(req, res, next) {
  const LoginSchema = Joi.object({
    Email: Joi.string().required().email().max(100),
    Password: Joi.string().required(),
  });
  const { error } = LoginSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: `Error: ${error.details[0].message}` });
  }
  next();
}

export { RegisterValidation, LoginValidation };
