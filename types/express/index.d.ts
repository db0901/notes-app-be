import { Request } from 'express'
// do not delete or this does not work

declare global {
  namespace Express {
    interface Request {
      userId: string;
      authToken: string
    }
  }
}
