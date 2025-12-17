const AuthService = require("../services/auth.service");

exports.registerUser = async (req, res) => {
  try {
    const result = await AuthService.register(req.body);
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const result = await AuthService.login(req.body, res);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

exports.cmsLogin = async (req, res) => {
  try {
    const result = await AuthService.cmsLogin(req.body, res);
   
    return res.status(200).json({
      data: null,
      outcome: true,
      message: result.message
    });
  } catch (error) {
    console.error("CMS login error:", error.message);
    return res.status(401).json({
      data: null,
      outcome: false,
      message: error.message
    });
  }
};

exports.secureCmsLogin = async (req, res) => {
  try {
    const result = await AuthService.secureCmsLogin(req.body, res);
    return res.status(200).json({
      data: null,
      outcome: true,
      message: result.message
    });
  } catch (error) {
    console.error("Secure CMS login error:", error.message);
    return res.status(401).json({
      data: null,
      outcome: false,
      message: error.message
    });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const result = await AuthService.adminLogin(req.body, res);
    return res.status(200).json({
      data: null,
      outcome: true,
      message: result.message
    });
  } catch (error) {
    console.error("Admin login error:", error.message);
    return res.status(401).json({
      data: null,
      outcome: false,
      message: error.message
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const result = await AuthService.verifyOtp(req.body, res);
  
    return res.status(200).json({
      data: null,
      outcome: true,
      message: result.message
    });
  } catch (error) {
    console.error("OTP verification error:", error.message);
    return res.status(401).json({
      data: null,
      outcome: false,
      message: error.message
    });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const result = await AuthService.refreshToken(req.body.token, res);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};