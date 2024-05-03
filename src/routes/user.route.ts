import { Hono } from "hono";
import db from "../db";
import { mailTransporter } from "../mail";
import { withValibot } from "../middlewares/valibot.middleware";
import { createUserSchema } from "../schemas/user.schema";
import { generateEmailVerificationCode } from "../services/auth.service";
import { findOrCreateMajor } from "../services/major.service";

const userRoute = new Hono().basePath("/users");
userRoute.post("/", withValibot("json", createUserSchema), async function (c) {
  const data = c.req.valid("json");

  const major = await findOrCreateMajor(data.major);

  const hashedPassword = await Bun.password.hash(data.password);

  const user = await db.user.create({
    data: {
      nik: data.nik,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
      majorId: major.id,
      type: "JobSeeker",
      verificationCode: generateEmailVerificationCode(),
    },
    include: {
      major: true,
    },
  });

  await mailTransporter.sendMail({
    from: '"Adam Akmal (LinkedOut\'s Team)" <adamakmal789@gmail.com>',
    to: user.email,
    subject: "LinkedOut Account registration",
    text: `Hello ${user.firstName}, this is your email verification code: ${user.verificationCode}`,
  });

  return c.json(
    {
      data: {
        nik: user.nik,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        major: user.major.name,
        type: user.type,
        isVerified: user.verificationCode !== null,
      },
      error: null,
    },
    201
  );
});

export { userRoute };
