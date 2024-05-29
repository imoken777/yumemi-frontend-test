import type { NextApiRequest, NextApiResponse } from 'next';
import type { ZodSchema, z } from 'zod';

export const withZod = <T extends ZodSchema>(
  schema: T,
  next: (
    req: Omit<NextApiRequest, 'query'> & z.infer<T>,
    res: NextApiResponse,
  ) => unknown | Promise<unknown>,
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const parsed = schema.safeParse(req);
    if (!parsed.success) {
      res.status(400).json({
        message: 'Bad Request',
        issues: parsed.error.format(),
      });
      return;
    }
    return next(req, res);
  };
};
