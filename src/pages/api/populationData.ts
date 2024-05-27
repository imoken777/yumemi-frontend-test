import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import type { ErrorAPIResponse, PopulationAPIResponse } from '../../types';
import { resasAxiosInstance } from '../../utils/resasAxiosInstance';
import { withZod } from '../../utils/withZod';

const querySchema = z
  .object({
    prefCode: z.string(),
    cityCode: z.string(),
  })
  .strict();

const handleGet = withZod(
  z.object({
    query: querySchema,
  }),
  async (
    req: Omit<NextApiRequest, 'query'> & { query: z.infer<typeof querySchema> },
    res: NextApiResponse<PopulationAPIResponse | ErrorAPIResponse>,
  ) => {
    const populationEndPoint = '/api/v1/population/composition/perYear';
    try {
      const response = await resasAxiosInstance.get<PopulationAPIResponse>(populationEndPoint, {
        params: req.query,
      });
      res.status(200).json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },
);

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  return handleGet(req, res);
};

export default handler;
