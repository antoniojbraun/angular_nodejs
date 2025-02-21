import { Request, Response } from "express";
import { z } from "zod";
import {
  addUser,
  getUserByEmail,
  getUserById,
  updateUser,
} from "../services/user.service";
import {
  encryptPassword,
  generateToken,
  verifyToken,
} from "../shared/auth.util";
import { addToken, deleteTokens, getToken } from "../services/token.service";
import {
  sendConfirmationEmail,
  sendForgotPasswordEmail,
} from "../shared/email.util";

const passwordZodRules = z
  .string()
  .min(6, { message: "Password must have at least 6 characteres." })
  .max(100, { message: "Password must have maximum 100 characteres" })
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/, //Email must be at least 6 characters long, include one uppercase letter, one lowercase letter, and one number
    {
      message:
        "Password must have at least one uppercase letter, one lowercase letter and one number. ",
    }
  );

export const registerController = async (req: Request, res: Response) => {
  // Check the dada coming from the frontend
  const schema = z.object({
    name: z.string().min(3).max(100),
    email: z.string().email(),
    password: passwordZodRules,
  });
  const parsedData = schema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }
  // Get the data from the body
  let { name, email, password } = req.body;
  // Check if already exists an user with the email informed
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    res.status(400).json({ message: "User already exists" });
    return;
  }
  // Encrypt the password before save it.
  password = encryptPassword(password);

  // Create the new user
  let user = await addUser(name, email, password);
  user = user.toJSON();
  delete user.password;

  // Send email verification
  const token = generateToken(user.id);
  await sendConfirmationEmail(email, token);
  await addToken(token, "activation", user.id);

  res.status(201).json(user);
  return;
};

export const loginController = async (req: Request, res: Response) => {
  // Check the dada coming from the frontend
  const schema = z.object({
    email: z.string().email({ message: "Email must be valid." }),
    password: passwordZodRules,
  });
  const parsedData = schema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }
  // Get the data from the body
  const { email, password } = req.body;
  // Check if already exists an user with the email informed
  const user = await getUserByEmail(email);
  if (!user) {
    res.status(400).json({ message: "User not found" });
    return;
  }
  // Check if the user status is active
  if (user.get("status") !== "active") {
    res.status(400).json({
      message:
        "Your account is pending of confirmation. Please confirm the link sent to your email.",
    });
  }

  const dbPassword = verifyToken(user.password!);

  // Check if the password is correct
  if (dbPassword !== password) {
    res.status(400).json({ message: "Invalid password" });
    return;
  }
  // Generate the Token
  const accessToken = generateToken(user.get("id"));
  const refreshToken = generateToken(user.get("id"), "7d");

  // Delete old Tokens
  await deleteTokens(user.get("id"));

  // Save refresh token
  await addToken(refreshToken, "refresh", user.get("id"));
  await addToken(accessToken, "access", user.get("id"));

  // Create and send session to client
  const session = {
    accessToken,
    refreshToken,
    user: user.toJSON(),
  };

  delete session.user.password;
  res.status(200).json(session);
  return;
};

export const refreshTokenController = async (req: Request, res: Response) => {
  const schema = z.object({
    refreshToken: z.string(),
  });
  const parsedData = schema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }
  const { refreshToken } = parsedData.data;

  const isTokenValid = verifyToken(refreshToken);
  if (!isTokenValid) {
    res.status(400).json({ message: "Token is not valid or expired." });
    return;
  }

  const dbRefreshToken = await getToken(refreshToken);
  if (!dbRefreshToken || dbRefreshToken.get("type") !== "refresh") {
    res.status(400).json({ message: "Invalid Token." });
    return;
  }
  const userId = dbRefreshToken.get("userId");

  const accessToken = generateToken(userId!);
  const newRefreshToken = generateToken(userId!, "7d");

  // Delete all old tokens
  await deleteTokens(userId!);

  // Save access token
  await addToken(accessToken, "access", userId!);
  // Save refresh token
  await addToken(newRefreshToken, "refresh", userId!);

  res.status(200).json({
    accessToken,
    refreshToken: newRefreshToken,
  });

  return;
};

export const logoutController = async (req: Request, res: Response) => {
  const schema = z.object({
    refreshToken: z.string(),
  });
  const parsedData = schema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }
  const { refreshToken } = parsedData.data;
  const isTokenValid = verifyToken(refreshToken);

  if (!isTokenValid) {
    res.status(400).json({ message: "Token is not valid or expired." });
    return;
  }
  const dbRefreshToken = await getToken(refreshToken);
  if (!dbRefreshToken || dbRefreshToken.get("type") !== "refresh") {
    res.status(400).json({ message: "Invalid Token." });
    return;
  }
  const userId = dbRefreshToken.get("userId");
  await deleteTokens(userId!);
  res.status(200).json({ message: "Logged out!" });
  return;
};

export const confirmEmailController = async (req: Request, res: Response) => {
  const { token } = req.params;
  const isTokenValid = verifyToken(token);

  if (!token) {
    res.status(400).json({ message: "Invalid Token or expired." });
    return;
  }
  const dbToken = await getToken(token);
  if (!dbToken || dbToken.get("type") !== "activation") {
    res.status(400).json({ message: "Invalid Token." });
    return;
  }

  const userId = dbToken.get("userId");

  const user = await getUserById(userId!);
  if (userId && user)
    await updateUser({
      id: userId,
      status: "active",
    });

  await deleteTokens(userId!);
  //   res.status(200).json({ message: "Email confirmed." });
  res.redirect(process.env.FRONTEND_URL + "/auth/login");
  return;
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  // Check the data coming from the form
  const schema = z.object({
    email: z.string().email(),
  });
  const parsedData = schema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }
  // Getting the email from the request body and check if exists in database
  const { email } = parsedData.data;
  const user = await getUserByEmail(email);
  if (!user) {
    res.status(400).json({ message: "User not found!" });
    return;
  }

  // Generate new token
  const token = generateToken(user.get("id"));
  // Deleting old tokens
  await deleteTokens(user.get("id"));
  // Saving new tokens on database
  await addToken(token, "reset", user.get("id"));
  // Send email to user
  await sendForgotPasswordEmail(email, token);
  res.status(200).json({ message: "Email sent." });
  return;
};

export const resetPasswordController = async (req: Request, res: Response) => {
  const schema = z.object({
    token: z.string(),
    password: passwordZodRules,
  });
  const parsedData = schema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(400).json(parsedData.error);
    return;
  }
  const { token, password } = parsedData.data;

  const isTokenValid = verifyToken(token);
  if (!isTokenValid) {
    res.status(400).json({ message: "Token is not valid or expired." });
    return;
  }

  const dbToken = await getToken(token);
  if (!dbToken || dbToken.get("type") !== "reset") {
    res.status(400).json({ message: "Invalid Token." });
    return;
  }
  const userId = dbToken.get("userId");
  const encryptedPassword = encryptPassword(password);
  await updateUser({
    id: userId!,
    password: encryptedPassword,
  });
  await deleteTokens(userId!);

  res.status(200).json({ message: "Password updated." });
};
