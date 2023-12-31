// import { hashPassword } from '~/utils/crypto'
// // giả sử mình đang là route '/login'
// // thì ng dùng sẽ truyền email và pwd
// // tạo 1 cái rq có body là email và password(1 rq sẽ có body, header query string, param string).
// // làm 1 mdw kiểm tra xem email và pwd có đc truyền lên hay không?

// import { Request, Response, NextFunction } from 'express'
// import { body, checkSchema } from 'express-validator'
// import { USERS_MESSAGES } from '~/constants/message'
// import { ErrorWithStatus } from '~/models/Errors'
// import databaseService from '~/services/database.services'
// import usersService from '~/services/users.services'
// import { validate } from '~/utils/validation'
// import HTTP_STATUS from '~/constants/httpStatus'
// import { verifyToken } from '~/utils/jwt.'
// import { JsonWebTokenError } from 'jsonwebtoken'
// import { capitalize } from 'lodash'
// import { ObjectId } from 'mongodb'

// // export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
// //   //interface do express cung cấp, bổ nghĩa paremeter như Request,... mà mình có, nhớ import
// //   //server k bao h reject
// //   const { email, password } = req.body
// //   if (!email || !password) {
// //     return res.status(400).json({
// //       //400: lỗi về chuẩn validator, 401: lỗi authen
// //       error: 'Missing email or password'
// //     })
// //   }
// //   next()
// // }

// export const loginValidator = validate(
//   checkSchema(
//     {
//       email: {
//         notEmpty: {
//           errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
//         },
//         isEmail: {
//           errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
//         },
//         trim: true,
//         custom: {
//           options: async (value, { req }) => {
//             // tìm user nào có email và password giống client đưa không?
//             const user = await databaseService.users.findOne({
//               email: value,
//               password: hashPassword(req.body.password)
//             })
//             if (user === null) {
//               throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
//             }
//             req.user = user //lưu user vào req để dùng ở login controller
//             return true
//           }
//         }
//       },
//       password: {
//         notEmpty: {
//           errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
//         },
//         isString: {
//           errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
//         },
//         isLength: {
//           options: {
//             min: 8,
//             max: 50
//           },
//           errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
//         },
//         isStrongPassword: {
//           options: {
//             minLength: 8,
//             minLowercase: 1,
//             minUppercase: 1,
//             minNumbers: 1,
//             minSymbols: 1
//             // returnScore: false
//             // false : chỉ return true nếu password mạnh, false nếu k
//             // true : return về chất lượng password(trên thang điểm 10)
//           },
//           errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
//         }
//       }
//     },
//     ['body']
//   )
// )

// /*
//   body:{
//     name,
//     email,
//     password,
//     confirm-password,
//     date_of_birth,
//   }
// */

// // export const registerValidator = validate(
// //   checkSchema({
// //     name: {
// //       notEmpty: { errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED },
// //       isString: { errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING },
// //       trim: true,
// //       isLength: {
// //         options: {
// //           min: 2,
// //           max: 100
// //         },
// //         errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
// //       }
// //     },
// //     email: {
// //       notEmpty: { errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED },
// //       isEmail: { errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID },
// //       trim: true,
// //       custom: {
// //         //check email có tồn tại chưa
// //         options: async (value) => {
// //           const isExist = await usersService.checkEmailExist(value)
// //           if (isExist) {
// //             // throw new Error('Email already exist')
// //             throw new Error('Email already exist  ')
// //           }
// //           return true
// //         }
// //       }
// //     },
// //     password: {
// //       notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
// //       isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING },
// //       isLength: {
// //         options: {
// //           min: 8,
// //           max: 50
// //         },
// //         errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
// //       },
// //       isStrongPassword: {
// //         options: {
// //           minLength: 8,
// //           minLowercase: 1,
// //           minUppercase: 1,
// //           minNumbers: 1,
// //           minSymbols: 1
// //         }
// //       },
// //       errorMessage:
// //         'password mus be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol'
// //     },
// //     confirm_password: {
// //       notEmpty: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED },
// //       isString: { errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING },
// //       isLength: {
// //         options: {
// //           min: 8,
// //           max: 50
// //         },
// //         errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
// //       },
// //       isStrongPassword: {
// //         options: {
// //           minLength: 8,
// //           minLowercase: 1,
// //           minUppercase: 1,
// //           minNumbers: 1,
// //           minSymbols: 1
// //         },
// //         errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
// //       },
// //       errorMessage:
// //         'password mus be at least 8 characters long and contain at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol',
// //       custom: {
// //         //value đại diện cho confirm password tại vì nó nằm trong trường
// //         //confirm_passwordz
// //         options: (value, { req }) => {
// //           if (value !== req.body.password) {
// //             throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
// //           }
// //           return true //k có cái này là pending tới chết
// //         }
// //       }
// //     },
// //     date_of_birth: {
// //       isISO8601: {
// //         options: {
// //           strict: true, //ép mình nhập theo format ngày tháng năm
// //           strictSeparator: true //là chuỗi của mình đc quyền thêm dấu gạch ngang
// //         },
// //         errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
// //       }
// //     }
// //   })
// // )
// export const registerValidator = validate(
//   checkSchema(
//     {
//       name: {
//         isString: {
//           errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
//         },
//         trim: true,
//         isLength: {
//           options: {
//             min: 1,
//             max: 100
//           },
//           errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100
//         }
//       },
//       email: {
//         notEmpty: {
//           errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
//         },
//         isEmail: {
//           errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
//         },
//         trim: true,
//         custom: {
//           options: async (value, { req }) => {
//             const isExistEmail = await usersService.checkEmailExist(value)
//             if (isExistEmail) {
//               throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
//             }
//             return true
//           }
//         }
//       },
//       password: {
//         notEmpty: {
//           errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
//         },
//         isString: {
//           errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
//         },
//         isLength: {
//           options: {
//             min: 8,
//             max: 50
//           },
//           errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
//         },
//         isStrongPassword: {
//           options: {
//             minLength: 8,
//             minLowercase: 1,
//             minUppercase: 1,
//             minNumbers: 1,
//             minSymbols: 1
//             // returnScore: false
//             // false : chỉ return true nếu password mạnh, false nếu k
//             // true : return về chất lượng password(trên thang điểm 10)
//           },
//           errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
//         }
//       },
//       confirm_password: {
//         notEmpty: {
//           errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
//         },
//         isString: {
//           errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_A_STRING
//         },
//         isLength: {
//           options: {
//             min: 8,
//             max: 50
//           },
//           errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_8_TO_50
//         },
//         isStrongPassword: {
//           options: {
//             minLength: 8,
//             minLowercase: 1,
//             minUppercase: 1,
//             minNumbers: 1,
//             minSymbols: 1
//           },
//           errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_STRONG
//         },
//         custom: {
//           options: (value, { req }) => {
//             if (value !== req.body.password) {
//               throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
//             }
//             return true
//           }
//         }
//       },
//       date_of_birth: {
//         isISO8601: {
//           options: {
//             strict: true,
//             strictSeparator: true
//           },
//           errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
//         }
//       }
//     },
//     ['body']
//   )
// )

// export const accessTokenValidator = validate(
//   checkSchema(
//     {
//       Authorization: {
//         trim: true,
//         custom: {
//           options: async (value, { req }) => {
//             const access_token = value.split(' ')[1]
//             if (!access_token) {
//               throw new ErrorWithStatus({
//                 message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
//                 status: HTTP_STATUS.UNAUTHORIZED
//               })
//             }
//             // nếu xuống đc đây thì tức là access_token có rồi
//             // cần verify access_token và lấy payload ra lưu lại trong req
//             try {
//               const decoded_authorization = await verifyToken({
//                 token: access_token,
//                 secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
//               })
//               ;(req as Request).decoded_authorization = decoded_authorization
//             } catch (error) {
//               throw new ErrorWithStatus({
//                 message: capitalize((error as JsonWebTokenError).message),
//                 status: HTTP_STATUS.UNAUTHORIZED
//               })
//             }
//             return true
//           }
//         }
//       }
//     },
//     ['headers']
//   )
// )

// export const refreshTokenValidator = validate(
//   checkSchema(
//     {
//       refresh_token: {
//         custom: {
//           options: async (value: string, { req }) => {
//             try {
//               const [decoded_refresh_token, refresh_token] = await Promise.all([
//                 verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
//                 databaseService.refreshTokens.findOne({ token: value })
//               ])

//               if (refresh_token === null) {
//                 throw new ErrorWithStatus({
//                   message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
//                   status: HTTP_STATUS.UNAUTHORIZED
//                 })
//               }
//               ;(req as Request).decoded_refresh_token = decoded_refresh_token
//             } catch (error) {
//               if (error instanceof JsonWebTokenError) {
//                 throw new ErrorWithStatus({
//                   message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
//                   status: HTTP_STATUS.UNAUTHORIZED //401
//                 })
//               }
//               throw error
//             }
//             return true //nếu không có lỗi thì trả về true
//           }
//         }
//       }
//     },
//     ['body']
//   )
// )

// export const emailVerifyTokenValidator = validate(
//   checkSchema(
//     {
//       email_verify_token: {
//         trim: true,
//         custom: {
//           options: async (value: string, { req }) => {
//             // kiểm tra ng dùng có truyền lên email_verify_token hay không
//             if (!value) {
//               throw new ErrorWithStatus({
//                 message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
//                 status: HTTP_STATUS.UNAUTHORIZED //401
//               })
//             }

//             // verify email_verify_token để lấy decoded_email_verify_token
//             try {
//               const decoded_email_verify_token = await verifyToken({
//                 token: value,
//                 secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
//               })
//               ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
//             } catch (error) {
//               if (error instanceof JsonWebTokenError) {
//                 throw new ErrorWithStatus({
//                   message: USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID,
//                   status: HTTP_STATUS.UNAUTHORIZED //401
//                 })
//               }
//               throw error
//             }
//             return true //nếu không có lỗi thì trả về true
//           }
//         }
//       }
//     },
//     ['body']
//   )
// )
// export const forgotPasswordValidator = validate(
//   checkSchema(
//     {
//       email: {
//         notEmpty: {
//           errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
//         },
//         isEmail: {
//           errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
//         },
//         trim: true,
//         custom: {
//           options: async (value, { req }) => {
//             const user = await databaseService.users.findOne({ email: value })
//             if (user === null) {
//               throw new ErrorWithStatus({
//                 message: USERS_MESSAGES.USER_NOT_FOUND,
//                 status: HTTP_STATUS.NOT_FOUND
//               })
//             }
//             req.user = user
//             return true
//           }
//         }
//       }
//     },
//     ['body']
//   )
// )
// export const verifyForgotPasswordTokenValidator = validate(
//   checkSchema(
//     {
//       forgot_password_token: {
//         trim: true,
//         custom: {
//           options: async (value: string, { req }) => {
//             // kiểm tra ng dùng có truyền lên forgot_password_token hay không
//             if (!value) {
//               throw new ErrorWithStatus({
//                 message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
//                 status: HTTP_STATUS.UNAUTHORIZED //401
//               })
//             }
//             try {
//               const decoded_forgot_password_token = await verifyToken({
//                 token: value,
//                 secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
//               })
//               ;(req as Request).decoded_forgot_password_token = decoded_forgot_password_token

//               const { user_id } = decoded_forgot_password_token
//               // dựa vào user_id tìm user
//               const user = await databaseService.users.findOne({
//                 _id: new ObjectId(user_id)
//               })

//               //nếu user === null thì throw lỗi 404
//               if (user === null) {
//                 throw new ErrorWithStatus({
//                   message: USERS_MESSAGES.USER_NOT_FOUND,
//                   status: HTTP_STATUS.NOT_FOUND
//                 })
//               }
//               if (user.forgot_password_token !== value) {
//                 throw new ErrorWithStatus({
//                   message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INCORRECT,
//                   status: HTTP_STATUS.UNAUTHORIZED
//                 })
//               }
//             } catch (error) {
//               if (error instanceof JsonWebTokenError) {
//                 throw new ErrorWithStatus({
//                   message: capitalize((error as JsonWebTokenError).message),
//                   status: HTTP_STATUS.UNAUTHORIZED //401
//                 })
//               }
//               throw error
//             }
//             return true //nếu không có lỗi thì trả về true
//           }
//         }
//       }
//     },
//     ['body']
//   )
// )

//giả xử là anh đang là route '/login'
//thì người dùng sẽ truyền email và password
//tạo 1 req có body là email và password
//- làm 1 middleware kiểm tra xem email và password có

import { NextFunction, Request, Response } from 'express'
import { ParamSchema, checkSchema } from 'express-validator'
import usersService from '~/services/users.services'
import { validate } from '~/utils/validation'
import { ErrorWithStatus } from '~/models/Errors'

import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import HTTP_STATUS from '~/constants/httpStatus'

import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/message'
import { verifyToken } from '~/utils/jwt.'
import { TokenPayLoad } from '~/models/request/User.requests'
import { UserVerifyStatus } from '~/constants/enums'

const passwordSchmea: ParamSchema = {
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
    },
    errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
  }
}

const confirmPasswordSchema: ParamSchema = {
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
}

const nameSchema: ParamSchema = {
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
}

const dateOfBirthSchema: ParamSchema = {
  isISO8601: {
    options: {
      strict: true,
      strictSeparator: true
    },
    errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_BE_ISO8601
  }
}

const imageSchema: ParamSchema = {
  optional: true,
  isString: {
    errorMessage: USERS_MESSAGES.IMAGE_URL_MUST_BE_A_STRING
  },
  // trim: true, //k nên đặt trim ở đây vì
  isLength: {
    options: {
      min: 1,
      max: 400
    },
    errorMessage: USERS_MESSAGES.IMAGE_URL_LENGTH_MUST_BE_FROM_1_TO_400
  },
  trim: true
}

//được truyền lên hay không ?
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
            //dựa vào email và password tìm đối tượng users tương ứng
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user === null) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            req.user = user
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
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: nameSchema,
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
            const isExist = await usersService.checkEmailExist(value)
            if (isExist) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: passwordSchmea,
      confirm_password: confirmPasswordSchema,
      date_of_birth: dateOfBirthSchema
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            const accessToken = value.split(' ')[1]
            //nếu k có accessToken thì ném lỗi 401
            if (!accessToken) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED //401
              })
            }
            try {
              //nếu có accessToken thì mình phải verify AccessToken
              const decoded_authorization = await verifyToken({
                token: accessToken,
                secretOrPublicKey: process.env.JWT_SECRET_ACCESS_TOKEN as string
              })
              //lấy ra decoded_authorization(payload), lưu vào req, để dùng dần
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
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            //verify refresh_token để lấy decoced_refresh_token
            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({ token: value, secretOrPublicKey: process.env.JWT_SECRET_REFRESH_TOKEN as string }),
                databaseService.refreshTokens.findOne({
                  token: value
                })
              ])
              //tìm refresh_token có tồn tại trong db hay không ?

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
                  message: capitalize((error as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      email_verify_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            //kiểm tra người dùng có truyền lên email_verify_token hay không ?
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            //verify email_verify_token để lấy decoced_email_verify_token
            try {
              const decoded_email_verify_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string
              })

              //sau khi verify ta được payload của email_verify_token: decoded_email_verify_token
              ;(req as Request).decoded_email_verify_token = decoded_email_verify_token
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize((error as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const forgotPasswordValidator = validate(
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
            //dựa vào email tìm đối tượng users tương ứng
            const user = await databaseService.users.findOne({
              email: value
            })
            if (user === null) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.USER_NOT_FOUND,
                status: HTTP_STATUS.NOT_FOUND
              })
            }
            req.user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyForgotPasswordTokenValidator = validate(
  checkSchema(
    {
      forgot_password_token: {
        trim: true,
        custom: {
          options: async (value: string, { req }) => {
            //kiểm tra người dùng có truyền lên forgot_password_token hay không ?
            if (!value) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }

            //verify forgot_password_token để lấy decoced_forgot_password_token
            try {
              const decoded_forgot_password_token = await verifyToken({
                token: value,
                secretOrPublicKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string
              })

              //sau khi verify ta được payload của email_verify_token: decoded_email_verify_token
              ;(req as Request).decoded_forgot_password_token = decoded_forgot_password_token

              const { user_id } = decoded_forgot_password_token
              //dựa vào user_id tìm user
              const user = await databaseService.users.findOne({
                _id: new ObjectId(user_id)
              })
              //nếu user === null thì ném lỗi 404
              if (user === null) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.USER_NOT_FOUND,
                  status: HTTP_STATUS.NOT_FOUND
                })
              }
              if (user.forgot_password_token !== value) {
                throw new ErrorWithStatus({
                  message: USERS_MESSAGES.FORGOT_PASSWORD_TOKEN_IS_INCORRECT,
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ErrorWithStatus({
                  message: capitalize((error as JsonWebTokenError).message),
                  status: HTTP_STATUS.UNAUTHORIZED
                })
              }
              throw error
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const resetPasswordValidator = validate(
  checkSchema(
    {
      password: passwordSchmea,
      consfirmPassword: confirmPasswordSchema
    },
    ['body']
  )
)

export const updateMeValidator = validate(
  checkSchema(
    {
      name: {
        optional: true, //đc phép có hoặc k
        ...nameSchema, //phân rã nameSchema ra
        notEmpty: undefined //ghi đè lên notEmpty của nameSchema
      },
      date_of_birth: {
        optional: true, //đc phép có hoặc k
        ...dateOfBirthSchema, //phân rã nameSchema ra
        notEmpty: undefined //ghi đè lên notEmpty của nameSchema
      },
      bio: {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.BIO_MUST_BE_A_STRING ////messages.ts thêm BIO_MUST_BE_A_STRING: 'Bio must be a string'
        },
        trim: true, //trim phát đặt cuối, nếu k thì nó sẽ lỗi validatior
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: USERS_MESSAGES.BIO_LENGTH_MUST_BE_LESS_THAN_200 //messages.ts thêm BIO_LENGTH_MUST_BE_LESS_THAN_200: 'Bio length must be less than 200'
        }
      },
      //giống bio
      location: {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.LOCATION_MUST_BE_A_STRING ////messages.ts thêm LOCATION_MUST_BE_A_STRING: 'Location must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },
          errorMessage: USERS_MESSAGES.LOCATION_LENGTH_MUST_BE_LESS_THAN_200 //messages.ts thêm LOCATION_LENGTH_MUST_BE_LESS_THAN_200: 'Location length must be less than 200'
        }
      },
      //giống location
      website: {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.WEBSITE_MUST_BE_A_STRING ////messages.ts thêm WEBSITE_MUST_BE_A_STRING: 'Website must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 200
          },

          errorMessage: USERS_MESSAGES.WEBSITE_LENGTH_MUST_BE_LESS_THAN_200 //messages.ts thêm WEBSITE_LENGTH_MUST_BE_LESS_THAN_200: 'Website length must be less than 200'
        }
      },
      username: {
        optional: true,
        isString: {
          errorMessage: USERS_MESSAGES.USERNAME_MUST_BE_A_STRING ////messages.ts thêm USERNAME_MUST_BE_A_STRING: 'Username must be a string'
        },
        trim: true,
        isLength: {
          options: {
            min: 1,
            max: 50
          },
          errorMessage: USERS_MESSAGES.USERNAME_LENGTH_MUST_BE_LESS_THAN_50 //messages.ts thêm USERNAME_LENGTH_MUST_BE_LESS_THAN_50: 'Username length must be less than 50'
        }
      },
      avatar: imageSchema,
      cover_photo: imageSchema
    },
    ['body']
  )
)

// kiểm tra user đã verified hay chưa
// chạy sau accessTokenVerifier
export const verifiedUserValidator = (req: Request, res: Response, next: NextFunction) => {
  const { verify } = req.decoded_authorization as TokenPayLoad
  if (verify !== UserVerifyStatus.Verified) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_VERIFIED,
      status: HTTP_STATUS.FORBIDDEN
    })
  }
  next()
}


