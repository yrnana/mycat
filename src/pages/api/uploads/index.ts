import multer from 'multer';
import type { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

const outputDir = './public/uploads';

// https://betterprogramming.pub/upload-files-to-next-js-with-api-routes-839ce9f28430
const upload = multer({
  limits: { fileSize: 1_000_000 * 2 },
  storage: multer.diskStorage({
    destination: outputDir,
    filename: (req, file, cb) => cb(null, file.originalname),
  }),
});

const handler = nc<NextApiRequest, NextApiResponse>({
  onError(error, req, res) {
    console.error(error);
    res
      .status(501)
      .json({ error: `Sorry something Happened! ${error.message}` });
  },
  onNoMatch(req, res) {
    res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
  },
});

handler.use(upload.array('files'));

interface NextConnectApiRequest extends NextApiRequest {
  files: Express.Multer.File[];
}

// POST /api/upload
handler.post((req: NextConnectApiRequest, res) => {
  const { files } = req;
  res.status(200).json({ files });
});

export default handler;

export const config = {
  api: {
    bodyParser: false,
  },
};
