// validate sẽ không báo lỗi vì lỗi sẽ đc lưu vào trong
// req và nhiệm vụ của mình là lấy ra xài, mặc dù là controller
// sẽ nhận và báo lỗi nh mà chẵng lẽ cứ đến controller r báo lỗi, kỳ
// => vì vậy để báo lỗi ở mdw thì mình cần làm 1 hàm validateResult
//    để báo lỗi

// Hầu hết các lỗi ở tầng validate là lỗi 422
import { error } from 'console'
import express, { NextFunction, Response, Request } from 'express'
import { body, validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/src/middlewares/schema'
import { EntityError, ErrorWithStatus } from '~/models/Errors'
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
// validate này sẽ nhận vào 1 mảng các validation chain, vì nó là 1 cái mảng nên nó
// sẽ duyệt từng phần tử và kếu từng phần tử lấy dữ liệu từ bên trong req

// Cách để lấy RunnableValidationChains<ValidationChain>:
// ctrl+click vào checkSchema sẽ hiện file schema.d.ts, kéo qua trái sẽ thấy
// xong r lấy copy vào

// Import:
// khi mình đang ở file schema.d.ts thì nhìn lên góc trên bên trái(k phải nhìn
// vào explorer) và sẽ thấy đg dẫn express-validator/src/middlewares/schema,
// lấy về và import vô

// hàm validate nhận vào 1 checkSchema và biến cái chuẩn đó thành 1 cái mdw
export const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req) //hành động này sẽ đi qua từng cái check dữ liệu của mình
    // và lưu cái lỗi này vào trong cái req // chuẩn promise thì phải là await

    const errors = validationResult(req) //funct này giúp ta lấy lỗi ra từ biến req
    if (errors.isEmpty()) {
      return next()
    }
    // hàm tập lỗi dành cho checkSchema, những lỗi trong đây sđc
    const errorObject = errors.mapped() //hàm này giúp ta lấy lỗi ra dưới dạng object
    const etityError = new EntityError({ errors: {} })
    for (const key in errorObject) {
      // lấy msg của từng lỗi ra
      const { msg } = errorObject[key] //phân rã msg của mỗi lỗi
      // nếu msg có dạng ErrorWithStatus và status !== 422 thì ném lỗi cho default
      // error handler xử lý
      if (msg instanceof ErrorWithStatus && msg.status !== 422) {
        return next(msg)
      }
      // nếu xuống đc đây thì là lỗi 422
      etityError.errors[key] = msg
    }
    //   mapped biến đổi nh object đẹp hơn trong postman
    next(etityError)
    //lỗi do ng dùng truyền lên là 422
  }
}
