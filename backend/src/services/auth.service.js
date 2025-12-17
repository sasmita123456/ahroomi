const User = require("../models/User.model");
const Otp = require("../models/Otp.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmailService = require("./email.service");
const EncryptionService = require("./encryption.service");
const FrontendEncryptionService = require("./frontend-encryption.service");

function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

class AuthService {
  static async register(data) {
    const { name, email, password, role } = data;

    const existing = await User.findOne({ email });
    if (existing) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "USER",
    });

    const tokens = generateTokens(user);

    return {
      message: "User registered successfully",
      user,
      tokens,
    };
  }

  static async login(data, res) {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");

    const tokens = generateTokens(user);

    // Set cookies with tokens
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: 'lax'
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    });

    return {
      message: "Login successful",
      user,
      // Only send accessToken in response, not the entire tokens object
      accessToken: tokens.accessToken,
    };
  }

  static async cmsLogin(data, res) {
    const { username, password } = data;

    // For CMS login, we'll check against the database for a user with CMS role
    // We expect the username to be an email address
    const user = await User.findOne({ email: username, role: "CMS" });
    
    if (!user) throw new Error("Invalid email or password");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid email or password");

    const tokens = generateTokens(user);

    // Set cookies with tokens
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, // 1 hour
      sameSite: 'lax'
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: 'lax'
    });

    return {
      message: "CMS Login successful",
      user,
      // Only send accessToken in response, not the entire tokens object
      accessToken: tokens.accessToken,
    };
  }

  static async secureCmsLogin(data, res) {
    try {
      let username, password;
      
      if (data.encryptedData && data.iv) {
        const decryptedData = FrontendEncryptionService.decryptFromFrontend(
          data.encryptedData,
          data.iv
        );
        const parsedData = JSON.parse(decryptedData);
        username = parsedData.username;
        password = parsedData.password;
      } else {
        username = data.username;
        password = data.password;
      }

      // For CMS login, we'll check against the database for a user with CMS role
      // We expect the username to be an email address
      const user = await User.findOne({ email: username, role: "CMS" });
      
      if (!user) throw new Error("Invalid email or password");

      const match = await bcrypt.compare(password, user.password);
      if (!match) throw new Error("Invalid email or password");

      const tokens = generateTokens(user);

      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000,
        sameSite: 'lax'
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        sameSite: 'lax'
      });

      return {
        message: "Secure CMS Login successful",
        user,
        // Only send accessToken in response, not the entire tokens object
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      throw new Error("Decryption failed or invalid credentials: " + error.message);
    }
  }

  static async adminLogin(data, res) {
    let email, password;
    
    if (data.encryptedData && data.iv) {
      const decryptedData = FrontendEncryptionService.decryptFromFrontend(
        data.encryptedData,
        data.iv
      );
      const parsedData = JSON.parse(decryptedData);
      email = parsedData.email;
      password = parsedData.password;
    } else {
      email = data.email;
      password = data.password;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    
    const existingUser = await User.findOne({ email: email, role: "ADMIN" });
    
    if (!existingUser) {
      throw new Error("Admin account not found. Only existing admin accounts can log in.");
    }
    
    const match = await bcrypt.compare(password, existingUser.password);
    if (!match) {
      throw new Error("Invalid password");
    }
    
    const otp = generateOtp();
    
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    
    await Otp.findOneAndUpdate(
      { email: email },
      { otp, expiresAt, loginEmail: email },
      { upsert: true, new: true }
    );
    
    const emailResult = await EmailService.sendOtp(email, otp);
    
    const isSimulationMode = process.env.NODE_ENV === 'development' && process.env.SIMULATE_EMAIL === 'true';
    
    if (!emailResult.success) {
      let errorMessage = "Failed to send OTP email";
      
      if (emailResult.error && emailResult.error.includes("Invalid login")) {
        errorMessage = "Email authentication failed. Please check your email configuration.";
      }
      
      throw new Error(errorMessage);
    }
    
    return {
      message: "OTP sent to your email",
      email
    };
  }

  static async verifyOtp(data, res) {
    let email, otp;
    
    if (data.encryptedData && data.iv) {
      const decryptedData = FrontendEncryptionService.decryptFromFrontend(
        data.encryptedData,
        data.iv
      );
      const parsedData = JSON.parse(decryptedData);
      email = parsedData.email;
      otp = parsedData.otp;
    } else if (data.encryptedData && data.authTag) {
      const decryptedData = FrontendEncryptionService.decryptWithFixedIV(
        data.encryptedData,
        data.authTag
      );
      const parsedData = JSON.parse(decryptedData);
      email = parsedData.email;
      otp = parsedData.otp;
    } else {
      email = data.email;
      otp = data.otp;
    }
    
    if (!email || !otp) {
      throw new Error("Email and OTP are required");
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email format");
    }
    
    if (!/^\d{6}$/.test(otp)) {
      throw new Error("Invalid OTP format");
    }
    
    const existingUser = await User.findOne({ email: email, role: "ADMIN" });
    if (!existingUser) {
      throw new Error("Admin account not found. Only existing admin accounts can log in.");
    }
    
    const otpRecord = await Otp.findOne({ email: email });
    
    if (!otpRecord) {
      throw new Error("OTP not found. Please request a new OTP.");
    }
    
    if (otpRecord.expiresAt < new Date()) {
      throw new Error("OTP has expired. Please request a new OTP.");
    }
    
    if (otpRecord.loginEmail && otpRecord.loginEmail !== email) {
      throw new Error("Email mismatch. Please use the same email used during login request.");
    }
    
    if (otpRecord.otp !== otp) {
      throw new Error("Invalid OTP");
    }
    
    await Otp.deleteOne({ email: email });
    
    const user = existingUser;

    const tokens = generateTokens(user);

    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000, 
      sameSite: 'lax'
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'lax'
    });

    return {
      message: "Admin Login successful",
      user,
      // Only send accessToken in response, not the entire tokens object
      accessToken: tokens.accessToken,
    };
  }

  static async refreshToken(token, res) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      const user = await User.findById(decoded.id);

      if (!user) throw new Error("Invalid refresh token");

      const tokens = generateTokens(user);
      
      res.cookie('accessToken', tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 1000, 
        sameSite: 'lax'
      });

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
        sameSite: 'lax'
      });

      return {
        message: "Token refreshed successfully",
        // Only send accessToken in response, not the entire tokens object
        accessToken: tokens.accessToken,
      };
    } catch (error) {
      throw new Error("Invalid refresh token");
    }
  }
}

module.exports = AuthService;