import { Hono } from "hono";
import db from "../db";

const majorRoute = new Hono().basePath("/majors");
majorRoute.get("", async function (c) {
  const majors = await db.major.findMany();
  return c.json({
    data: majors.map(function (major) {
      return {
        id: Number(major.id),
        name: major.name,
        isVerified: major.isVerified,
        createdAt: major.createdAt,
        updatedAt: major.updatedAt,
      };
    }),
    error: null,
  });
});

export { majorRoute };
