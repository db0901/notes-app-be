// do not delete or this does not work
import * as express from "express"

declare global {
  namespace Express {
    interface Request {
      userToken: string;
    }
  }
}
