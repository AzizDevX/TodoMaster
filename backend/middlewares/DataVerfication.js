function ValidateRegisterReq(req, res, next) {
  if (!req.body) {
    return res.status(400).json({
      message: "Email , UserName ,Password Are Required To Register ",
    });
  }
  if (!req.body.Email) {
    return res.status(400).json({ message: "Email Required" });
  }

  if (!req.body.UserName) {
    return res.status(400).json({ message: "UserName Required" });
  }

  if (!req.body.Password) {
    return res.status(400).json({ message: "Password Required" });
  }
  next();
}

function ValidateLoginReq(req, res, next) {
  if (!req.body) {
    return res.status(400).json({
      message: "Must Put Email , Password To Login ",
    });
  }
  if (!req.body.Email) {
    return res.status(400).json({ message: "Email Required" });
  }

  if (!req.body.Password) {
    return res.status(400).json({ message: "Password Required" });
  }
  next();
}

export { ValidateRegisterReq, ValidateLoginReq };
