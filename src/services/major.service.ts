import { Major } from "@prisma/client";
import db from "../db";

export async function findOrCreateMajor(name: string): Promise<Major> {
  let major = await db.major.findFirst({
    where: { name: { equals: name, mode: "insensitive" } },
  });
  if (major == null) {
    major = await db.major.create({
      data: {
        name,
      },
    });
  }

  return major;
}
