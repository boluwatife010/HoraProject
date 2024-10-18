// src/types/mongoose-gridfs.d.ts or src/mongoose-gridfs.d.ts
declare module 'mongoose-gridfs' {
    import { Document, Mongoose, Connection } from 'mongoose';
  
    interface WriteOptions {
      filename: string;
      contentType?: string;
    }
  
    interface GridFSModel {
      write: (options: WriteOptions) => any;
      read: (options: any) => any;
      unlink: (options: any, callback: (err: Error) => void) => any;
    }
  
    export function createModel(options: {
      modelName?: string;
      collection?: string;
      connection: Connection;
    }): GridFSModel;
  }
  