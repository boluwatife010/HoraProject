// index.d.ts
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Multer {
      File: Multer.File;
    }

    interface Request {
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}
