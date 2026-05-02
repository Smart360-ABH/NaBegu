import { Parse, isConfigured } from "./parse";

export interface ParseUser {
  objectId: string;
  username: string;
  email?: string;
  phone?: string;
  sessionToken: string;
}

function toParseUser(user: Parse.User): ParseUser {
  return {
    objectId: user.id,
    username: user.getUsername() ?? "",
    email: user.getEmail(),
    phone: user.get("phone"),
    sessionToken: user.getSessionToken() ?? "",
  };
}

export async function registerUser(
  username: string,
  password: string,
  email: string,
  phone?: string
): Promise<ParseUser> {
  if (!isConfigured) throw new Error("not_configured");
  const user = new Parse.User();
  user.set("username", username);
  user.set("password", password);
  user.set("email", email);
  if (phone) user.set("phone", phone);
  try {
    await user.signUp();
    return toParseUser(user);
  } catch (err: unknown) {
    const e = err as { message?: string };
    throw new Error(e.message ?? "Ошибка регистрации");
  }
}

export async function loginUser(
  username: string,
  password: string
): Promise<ParseUser> {
  if (!isConfigured) throw new Error("not_configured");
  try {
    const user = await Parse.User.logIn(username, password);
    return toParseUser(user);
  } catch (err: unknown) {
    const e = err as { message?: string };
    throw new Error(e.message ?? "Неверный логин или пароль");
  }
}

export async function logoutUser(_sessionToken: string): Promise<void> {
  if (!isConfigured) return;
  try {
    await Parse.User.logOut();
  } catch {
    // ignore
  }
}

export async function getUserOrders(
  userId: string,
  _sessionToken: string
): Promise<object[]> {
  if (!isConfigured) return [];
  try {
    const query = new Parse.Query("Order");
    query.equalTo("userId", userId);
    query.descending("createdAt");
    query.limit(20);
    const results = await query.find();
    return results.map((obj) => ({ objectId: obj.id, ...obj.attributes }));
  } catch {
    return [];
  }
}

export { isConfigured };
