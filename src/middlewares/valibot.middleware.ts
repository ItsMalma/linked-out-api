import { vValidator } from "@hono/valibot-validator";
import { Env, MiddlewareHandler, ValidationTargets } from "hono";
import * as v from "valibot";
import { BaseSchema, Input, Output } from "valibot";

type HasUndefined<T> = undefined extends T ? true : false;
export function withValibot<
  T extends BaseSchema,
  Target extends keyof ValidationTargets,
  E extends Env,
  P extends string,
  V extends {
    in: HasUndefined<Input<T>> extends true
      ? { [K in Target]?: Input<T> | undefined }
      : { [K_1 in Target]: Input<T> };
    out: { [K_2 in Target]: Output<T> };
  } = {
    in: HasUndefined<Input<T>> extends true
      ? { [K_3 in Target]?: Input<T> | undefined }
      : { [K_4 in Target]: Input<T> };
    out: { [K_5 in Target]: Output<T> };
  }
>(target: Target, schema: T): MiddlewareHandler<E, P, V> {
  return vValidator<T, Target, E, P, V>(target, schema, function (res, c) {
    if (!res.success) {
      return c.json({
        data: null,
        error: v.flatten(res.issues).nested,
      });
    }
  });
}
