import { hashPassword } from '~/utils/crypto'
// giả sử mình đang là route '/login'
// thì ng dùng sẽ truyền email và pwd
// tạo 1 cái rq có body là email và password(1 rq sẽ có body, header query string, param string).
// làm 1 mdw kiểm tra xem email và pwd có đc truyền lên hay không?

import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { USERS_MESSAGES } from '~/constants/message'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'
import HTTP_STATUS from '~/constants/httpStatus'
import { verifyToken } from '~/utils/jwt.'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'

// export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
//   //interface do express cung cấp, bổ nghĩa paremeter như Request,... mà mình có, nhớ import
//   //server k bao h reject
//   const { email, password } = req.body
//   if (!email || !password) {
//     return res.status(400).json({
//       //400: lỗi về chuẩn validator, 401: lỗi authen
//       error: 'Missing email or password'
//     })
//   }
//   next()
// }

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            // tìm user nào có email và password giống client đưa không?
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user === null) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            req.user = user //req giữ giùm cái user này
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
            // returnScore: false
            // false : chỉ return true nếu password mạnh, false nếu k
            // true : return về chất lượng password(trên thang điểm 10)
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

/*
  body:{
    name,
    email,
    password,
    confirm-password,
    date_of_birth,
  }
*/

// export const registerValidator = validate(
//   checkSchema({
//     name: {
//       notEmpty: { errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED },
//       isString: { errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING },
//       trim: true,
//       isLength: {
//         options: {
//           min: 2,
//           max: 100
//         },
//         errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
//       }
//     },
//     email: {
//       notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
//       isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
//       trim: true,
//       custom: {
//         //check email có tồn tại chưa
//         options: async (value) => {
//           const isExist = await usersService.checkEmailExist(value)
//           if (isExist) {
//             // throw new Error('Email already exist')
//             throw new Error('Email already exist  ')
//           }
//           return true
//         }
//       }
//     },
//     password: {
//       notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
//       isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING },
//       isLength: {
//         options: {
//           min: 8,
//           max: 50
//         },
//         errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
//       },
//       isStrongPassword: {
//         options: {
//           minLength: 8,
//           minLowercase: 1,
//           minUppercase: 1,
//           minNumbers: 1,
//           minSymbols: 1
//         }
//       },
//       errorMessage:
//         'password mus be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'
//     },
//     confirm_password: {
//       notEmpty: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
//       isString: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING },
//       isLength: {
//         options: {
//           min: 8,
//           max: 50
//         },
//         errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
//       },
//       isStrongPassword: {
//         options: {
//           minLength: 8,
//           minLowercase: 1,
//           minUppercase: 1,
//           minNumbers: 1,
//           minSymbols: 1
//         },
//         errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
//       },
//       errorMessage:
//         'password mus be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
//       custom: {
//         //value đại diện cho confirm password tại vì nó nằm trong trường
//         //confirm_passwordz
//         options: (value, { req }) => {
//           if (value !== req.body.password) {
//             throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
//           }
//           return true //k có cái này là pending tới chết
//         }
//       }
//     },
//     date_of_birth: {
//       isISO8601: {
//         options: {
//           strict: true, //ép mình nhập theo format ngày tháng năm
//           strictSeparator: true //là chuỗi của mình đc quyền thêm dấu gạch ngang
//         },
//         errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
//       }
//     }
//   })
// )
export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 100
          },
          errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
        }
      },
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const isExistEmail = await usersService.checkEmailExist(value)
            if (isExistEmail) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
            // returnScore: false
            // false : chỉ return true nếu password mạnh, false nếu k
            // true : return về chất lượng password(trên thang điểm 10)
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 8,
            max: 50
          },
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
        },
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
            }
            return true
          }
        }
      },
      date_of_birth: {
        isISO8601: {
          options: {
            strict: true,
            strictSeparator: true
          },
          errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        notEmpty: {
          errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED
        },
        custom: {
          options: async (value, { req }) => {
            const access_token = value.split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            // nếu xuống đc đây thì tức là access_token có rồi
            // cần verify access_token và lấy payload ra lưu lại trong req
            try {
              const decoded_authorization = await verifyToken({ token: access_token })
              ;(req as Request).decoded_authorization = decoded_authorization
            } catch (error) {
              throw new ErrorWithStatus({
                message: capitalize((error as JsonWebTokenError).message),
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID
        },

        custom: {
          options: async (value: string, { req }) => {
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value }),
                databaseService.refreshTokens.findOne({ token: value })
              ])

              if (refresh_token === null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              ;(req as Request).decoded_refresh_token = decoded_refresh_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
                  status: HTTP_STATUS.UNAUTHORIZED //401
                })
              }
              throw error
            }
            return true //nếu không có lỗi thì trả về true
          }
        }
      }
    },
    ['body']
  )
)
