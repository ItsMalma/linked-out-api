import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ErrorHandler } from "hono";

export const onError: ErrorHandler = function (err, c) {
  console.error(err);

  if (err instanceof PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return c.json(
        {
          data: null,
          error: err.meta?.target ?? [],
        },
        409
      );
    }
  }

  return c.json(
    {
      data: null,
      error: "Internal Server Error",
    },
    500
  );
};
