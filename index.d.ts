declare namespace Express {
  export interface Request {
    file: Multer["File"];
  }
}

/*
import { Multer } from 'multer';

declare global {
  namespace Express {
    interface Request {
      file?: Multer.File;
      files?: Multer.File[];
    }
  }
}
*/