import bcrypt from "bcrypt";

class Security {
  private static saltRounds = 10;

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
}
export default Security;
