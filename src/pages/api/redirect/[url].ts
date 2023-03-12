import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;
  console.log('redirecting to', url);
  return res.redirect(307, '/' + url);
}
