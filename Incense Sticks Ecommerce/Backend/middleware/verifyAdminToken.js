const jwt = require("jsonwebtoken");
const AdminModel = require("../models/Admin");

const verifyAdminToken = async (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token) {
      return res.status(403).json({ message: "Admin access required", success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded.admin_name) {
      return res.status(403).json({ message: "Admin access required", success: false });
    }

    const admin = await AdminModel.findById(decoded._id).select("name");
    if (!admin || admin.name !== decoded.admin_name) {
      return res.status(403).json({ message: "Admin access required", success: false });
    }

    req.token = decoded;
    return next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid admin session", success: false });
  }
};

module.exports = verifyAdminToken;
