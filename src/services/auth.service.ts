export function hashPassword(password: string): string {
  return Bun.password.hashSync(password);
}

export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  return Bun.password.verifySync(password, hashedPassword);
}

export function generateEmailVerificationCode(): string {
  let emailVerificationCode = "";
  for (let i = 0; i < 6; i++) {
    emailVerificationCode += Math.floor(Math.random() * 10);
  }
  return emailVerificationCode;
}
