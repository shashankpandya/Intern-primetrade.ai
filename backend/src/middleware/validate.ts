import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export const validate = (schema: z.ZodTypeAny) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    next();
  };
};
