import { error } from 'console'
// Error Handler nhận vào err, req, response và res

import { NextFunction, Request, Response } from 'express'
import { forEach, omit } from 'lodash'
import HTTP_STATUS from '~/constants/httpStatus'
import { ErrorWithStatus } from '~/models/Errors'

export const defaultErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // tầng tập kết lỗi
  // đây là nơi mà tất cả lỗi trên hệ thống sẽ dồn về đây
  if (err instanceof ErrorWithStatus) {
    res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json(omit(err, ['status']))
  }
  // omit có khả năng loại bỏ thuộc tính
  // nếu không lọt vào if ở trên thì tức là err này là lỗi mặc định
  // name, message, stack mà 3 thằng này có enumberable là false => chuyển thành true
  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, { enumerable: true })
  }) //lấy ra đc tất cả thuộc tính trong err
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    errorInfor: omit(err, ['stack'])
  })
}
