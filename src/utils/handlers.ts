import { NextFunction, Request, RequestHandler, Response } from 'express'
// Request Handler sẽ bao gồm 2 cái:
// Middleware {req, res , next}
// Controller {req, res, next(Thường ko có cái này trong ctr vì nó nằm ơ cuối)}

// Error Handler {err, req, res, next}

// Hàm bình thường: dùng lệnh next, throw bình thường
// Hàm async: dùng lệnh next bth, throw thì bị lỗi => khắc phục bằng cách try catch | promise

// Mấy hàm này tương tự như validate

// wrap sync sẽ nhận 1 đống code không có try catch
export const wrapAsync = <P>(func: RequestHandler<P>) => {
  return async (req: Request<P>, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next) // đây chính là 1 req handler
    } catch (error) {
      next(error)
    }
  }
}
