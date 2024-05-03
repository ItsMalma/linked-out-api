import { Hono } from "hono";
import * as jwt from "jsonwebtoken";
import db from "../db";
import { withValibot } from "../middlewares/valibot.middleware";
import {
  loginSchema,
  verifyBodySchema,
  verifyParamSchema,
} from "../schemas/auth.schema";

const authRoute = new Hono().basePath("/auth");
authRoute.post("/login", withValibot("json", loginSchema), async function (c) {
  const data = c.req.valid("json");

  const user = await db.user.findFirst({
    where: {
      OR: [
        {
          email: data.emailOrPhoneNumber,
        },
        {
          phoneNumber: data.emailOrPhoneNumber,
        },
      ],
    },
  });
  if (!user) {
    return c.json(
      {
        data: null,
        error: {
          emailOrPhoneNumber: "Email atau nomor telepon tidak terdaftar",
        },
      },
      401
    );
  }

  const isPasswordValid = await Bun.password.verify(
    data.password,
    user.password
  );
  if (!isPasswordValid) {
    return c.json(
      {
        data: null,
        error: {
          password: "Password salah",
        },
      },
      401
    );
  }

  const token = jwt.sign(
    {
      nik: user.nik,
      firstName: user.firstName,
    },
    Bun.env.JWT_SECRET,
    {
      expiresIn: "1h",
      issuer: Bun.env.JWT_ISSUER,
    }
  );

  return c.json(
    {
      data: token,
      error: null,
    },
    200
  );
});
authRoute.post(
  "/verify/:nik",
  withValibot("param", verifyParamSchema),
  withValibot("json", verifyBodySchema),
  async function (c) {
    const params = c.req.valid("param");
    const body = c.req.valid("json");

    const user = await db.user.findFirst({
      where: {
        nik: params.nik,
      },
    });
    if (!user) {
      return c.json(
        {
          data: null,
          error: {
            nik: "NIK tidak terdaftar",
          },
        },
        404
      );
    }

    if (user.verificationCode !== body.code) {
      return c.json(
        {
          data: null,
          error: {
            code: "Kode verifikasi salah",
          },
        },
        401
      );
    }

    await db.user.update({
      where: {
        nik: params.nik,
      },
      data: {
        verificationCode: null,
      },
    });

    return c.json({
      data: {
        nik: user.nik,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        type: user.type,
        isVerified: user.verificationCode !== null,
      },
      error: null,
    });
  }
);

export { authRoute };
