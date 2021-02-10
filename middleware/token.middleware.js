var jwt = require("jsonwebtoken");

module.exports.veryfiToken = function(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(400).send("Access denied");
  }
  try {
    const verified = jwt.verify(token.slice(7), process.env.SECRET_COOKIES);
    const currentTime = Date.now() / 1000;
    if (currentTime > verified.exp) return res.status(400).send("Token timeout");
    next();
  } catch (error) {
    return res.status(400).send("Invalid token");
  }
};


module.exports.isAdmin = function(req, res, next) {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(400).send("Access denied");
  }
  try {
    const verified = jwt.verify(token.slice(7), process.env.SECRET_COOKIES);
    if (!verified.isAdmin) return res.status(400).send("Access is not allowed");
    next();
  } catch (error) {
    return res.status(400).send("Invalid token");
  }
};

