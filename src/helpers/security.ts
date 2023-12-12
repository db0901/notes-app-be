import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class Security {
  private static saltRounds = 10;

  private static jwtSecret = process.env.JWT_SECRET || "secret";

  static async hashPassword(password: string): Promise<string | null> {
    try {
      const hash = await bcrypt.hash(password, Security.saltRounds);
      return hash;
    } catch (_) {
      return null;
    }
  }

  static async checkPassword(
    password: string,
    hash: string | undefined | null
  ): Promise<boolean> {
    if (!hash) {
      return false;
    }
    try {
      const match = await bcrypt.compare(password, hash);
      return match;
    } catch (_) {
      return false;
    }
  }

  static generateToken(userId: string): string {
    return jwt.sign({ userId }, Security.jwtSecret, {
      expiresIn: "24h",
    });
  }

  static verifyToken(token: string): jwt.JwtPayload | string | null {
    try {
      return jwt.verify(token, this.jwtSecret);
    } catch (error) {
      return null;
    }
  }

  static filterBody<T extends Record<string, any>>(
    body: T,
    whitelist: string[]
  ): Partial<T> {
    return whitelist.reduce((filtered, key) => {
      if (key in body) {
        filtered[key as keyof T] = body[key as keyof T];
      }
      return filtered;
    }, {} as Partial<T>);
  }
}
export default Security;
