import { body } from 'express-validator'
import { resetPasswordValidator } from './../middlewares/users.middlewares'
// import { emailVerifyTokenValidator } from './../middlewares/users.middlewares'
// import { NextFunction } from 'express'
// // file chứa tất cả các controllers liên quan đến users
// // nơi xử lý logic
// //nếu không import Express thì nó đang xài interface của fetch API
// import { Request, Response } from 'express'
// import {
//   LoginReqBody,
//   RegisterReqBody,
//   TokenPayLoad,
//   VerifyEmailReqBody,
//   logoutReqBody
// } from '~/models/request/User.requests'
// import { ParamsDictionary } from 'express-serve-static-core'
// import usersService from '~/services/users.services'
// import User from '~/models/schemas/User.schema'
// import { ObjectId } from 'mongodb'
// import { USERS_MESSAGES } from '~/constants/message'
// import databaseService from '~/services/database.services'
// import { ErrorWithStatus } from '~/models/Errors'
// import HTTP_STATUS from '~/constants/httpStatus'
// import { UserVerifyStatus } from '~/constants/enums'

// // export const loginController = (req: Request, res: Response) => {
// //   const { email, password } = req.body //đây chính là cái rq
// //   //phải vô trong database mới log ra và kiểm tra chứ không phải như này

// //   if (email === 'test@gmail.com' && password === '123456') {
// //     //đây chính là cái response
// //     return res.json({
// //       message: 'loginSuccessful',
// //       data: [
// //         { fname: 'Điệp', yob: 1999 },
// //         { fname: 'Hùng', yob: 2003 },
// //         { fname: 'Được', yob: 1994 }
// //       ]
// //     })
// //   }
// //   //nếu mà không có thì phải luôn trả ra 1 cái response có status là 401
// //   return res.status(401).json({
// //     error: 'login failed'
// //   })
// // }

// export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
//   // nếu nó vào đây, tức là nó đã đăng nhập thành công
//   const user = req.user as User // lấy user từ req
//   const user_id = user._id as ObjectId //Lấy _id từ user
//   // server phải tạo ra access_token và refresh_token để đưa cho client
//   const result = await usersService.login(user_id.toString())
//   //login nhận vào user_id:string, nhưng user_id ta có
//   //là objectid trên mongodb, nên phải toString()
//   //trả ra kết quả, thiếu cái này là sending hoài luôn
//   return res.json({
//     message: USERS_MESSAGES.LOGIN_SUCCESS,
//     result
//   })
// }

// // khi định nghĩa chức năng register thì body của nó phải trông như nào
// // = tạo interface để định nghĩa cái body trông như nào

// // Response Body: cái gói hàng mà server gửi về trông như nào
// // RegisterReqBody: body của cái req mà ng dùng gửi lên cho mình
// // |||||||||||||||||||||||||||||||||||||||||||Param|||||||||||Response Body||RegisterReqBody
// export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
//   // nhét db
//   // hành động mà nhét như v dễ bị bug(rớt mạng,...), nên xài catch
//   // Controller không nên nhảy 1 phát vô db, rất nguy hiểm

//   // throw new Error('error test')
//   const result = await usersService.register(req.body)
//   return res.json({
//     message: USERS_MESSAGES.REGISTER_SUCCESS,
//     result
//   })
// }

// export const logoutController = async (req: Request<ParamsDictionary, any, logoutReqBody>, res: Response) => {
//   // Lấy refresh token từ req.body
//   // và vào database xóa refresh_token này
//   const { refresh_token } = req.body
//   //logout sẽ nhận vào refresh_token để tìm và xóa
//   const result = await usersService.logout(refresh_token)
//   res.json(result)
// }

// export const emailVerifyTokenController = async (
//   req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
//   res: Response
// ) => {
//   // nếu mà code vào đc đây nghĩa là email verify token hợp lệ
//   //và mình đã lấy đc decoded_email_verify_token
//   const { user_id } = req.decoded_email_verify_token as TokenPayLoad
//   //dựa vào user_id tìm user và xem thử nó đã verify chưa ?
//   const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
//   if (user === null) {
//     throw new ErrorWithStatus({
//       message: USERS_MESSAGES.USER_NOT_FOUND,
//       status: HTTP_STATUS.NOT_FOUND
//     })
//   }

//   //nếu đã verify rồi thì k cần verify nữa
//   if (user.verify === UserVerifyStatus.Verified && user.email_verify_token === '') {
//     return res.json({
//       message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
//     })
//   }

//   // nếu mà k khớp email_verify_token
//   if (user.email_verify_token !== (req.body.email_verify_token as string)) {
//     throw new ErrorWithStatus({
//       message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INCORRECT,
//       status: HTTP_STATUS.UNAUTHORIZED
//     })
//   }

//   //nếu mà xuống đc đây có nghĩa là user chưa verify
//   // mình sẽ update lại user đó
//   const result = await usersService.verifyEmail(user_id)
//   return res.json({
//     message: USERS_MESSAGES.VERIFY_EMAIL_SUCCESS,
//     result
//   })
// }

// export const resendEmailVerifyController = async (req: Request, res: Response) => {
//   // nếu mình vào đc đây có nghĩa là access_token hợp lệ
//   // và mình đã lấy đc decoded_authorization
//   const { user_id } = req.decoded_authorization as TokenPayLoad
//   //dựa vào user_id tìm user và xem thử nó đã verify chưa ?
//   const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
//   if (user === null) {
//     throw new ErrorWithStatus({
//       message: USERS_MESSAGES.USER_NOT_FOUND,
//       status: HTTP_STATUS.NOT_FOUND
//     })
//   }
//   // nếu đã verified r th2i k cần verified nữa
//   if (user.verify === UserVerifyStatus.Verified && user.email_verify_token === '') {
//     return res.json({
//       message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
//     })
//   }

//   if (user.verify === UserVerifyStatus.Banned) {
//     throw new ErrorWithStatus({
//       message: USERS_MESSAGES.USER_BANNED,
//       status: HTTP_STATUS.UNAUTHORIZED
//     })
//   }
//   //user này thật sự chưa verify: mình sẽ tạo lại email_verify_token
//   //cập nhật lại user
//   const result = await usersService.resendEmailVerify(user_id)
//   return res.json(result)
// }
// export const forgotPasswordValidatorController = async (req: Request, res: Response) => {
//   // lấy user_id từ user của req
//   const { _id } = req.user as User
//   // dùng _id tìm và cập nhật lại user thêm vào forgot_password_token
//   const result = await usersService.forgotPassword((_id as ObjectId).toString())
//   return res.json(result)
// }
// export const verifyForgotPasswordTokenValidatorController = async (req: Request, res: Response) => {
//   return res.json({
//     message: USERS_MESSAGES.CHECK_FORGOT_PASSWORD_TOKEN_SUCCESS
//     //'Verify forgot password token success'
//   })
// }

import { Request, Response } from 'express'
import User from '~/models/schemas/User.schema'
import usersService from '~/services/users.services'
import { ParamsDictionary } from 'express-serve-static-core'

import { ObjectId } from 'mongodb'

import databaseService from '~/services/database.services'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { UserVerifyStatus } from '~/constants/enums'
import {
  GetProfileReqParams,
  LoginReqBody,
  RegisterReqBody,
  TokenPayLoad,
  UpdateMeReqBody,
  VerifyEmailReqBody,
  logoutReqBody,
  resetPasswordReqBody
} from '~/models/request/User.requests'
import { USERS_MESSAGES } from '~/constants/message'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  //lấy user_id từ user của req
  const user = req.user as User
  const user_id = user._id as ObjectId
  //dùng user_id tạo access_token và refresh_token

  const result = await usersService.login({
    user_id: user_id.toString(),
    verify: user.verify
  })
  //res  access_token và refresh_token cho client
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await usersService.register(req.body)
  res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
}

export const logoutController = async (req: Request<ParamsDictionary, any, logoutReqBody>, res: Response) => {
  const { refresh_token } = req.body
  //logout sẽ nhận vào refresh_token để tìm và xóa
  const result = await usersService.logout(refresh_token)
  res.json(result)
}

export const emailVerifyTokenController = async (
  req: Request<ParamsDictionary, any, VerifyEmailReqBody>,
  res: Response
) => {
  //nếu mà code vào được đây nghĩa là email_verify_token hợp lệ
  //và mình đã lấy đc decoded_email_verify_token
  const { user_id } = req.decoded_email_verify_token as TokenPayLoad
  //dựa vào user_id tìm user và xem thử nó đã verify chưa ?
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (user === null) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  //nếu đã verify rồi thì k cần verify nữa
  if (user.verify === UserVerifyStatus.Verified && user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }

  //nếu mà k khớp email_verify_token
  if (user.email_verify_token !== (req.body.email_verify_token as string)) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.EMAIL_VERIFY_TOKEN_IS_INCORRECT,
      status: HTTP_STATUS.UNAUTHORIZED
    })
  }
  //nếu mà xuống đc đây có nghĩa là user chưa verify
  //mình sẽ update lại user đó
  const result = await usersService.verifyEmail(user_id)
  return res.json({
    message: USERS_MESSAGES.VERIFY_EMAIL_SUCCESS,
    result
  })
}

export const resendEmailVerifyController = async (req: Request, res: Response) => {
  //nếu vào được đây có nghĩa là access_token hợp lệ
  //và mình đã lấy đc decoded_authorization
  const { user_id } = req.decoded_authorization as TokenPayLoad
  //dựa vào user_id tìm user và xem thử nó đã verify chưa ?
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (user === null) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified && user.email_verify_token === '') {
    return res.json({
      message: USERS_MESSAGES.EMAIL_ALREADY_VERIFIED_BEFORE
    })
  }
  if (user.verify === UserVerifyStatus.Banned) {
    throw new ErrorWithStatus({
      message: USERS_MESSAGES.USER_BANNED, //USER_BANNED: 'User banned'
      status: HTTP_STATUS.FORBIDDEN //403
    })
  }
  //user này thật sự chưa verify: mình sẽ tạo lại email_verify_token
  // cập nhật lại user
  const result = await usersService.resendEmailVerify(user_id)
  return res.json(result)
}

export const forgotPasswordController = async (req: Request, res: Response) => {
  //lấy user_id từ user của req
  const { _id, verify } = req.user as User
  // dùng _id tìm và cập nhật lại user thêm vào forgot_password_token
  const result = await usersService.forgotPassword({
    user_id: (_id as ObjectId).toString(),
    verify
  })
  return res.json(result)
}

export const verifyForgotPasswordTokenController = async (req: Request, res: Response) => {
  return res.json({
    message: USERS_MESSAGES.VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS
    //'Verify forgot password token success'
  })
}

export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, resetPasswordReqBody>,
  res: Response
) => {
  // muốn cập nhật mk mới th2i cần user_id và password mới
  const { user_id } = req.decoded_forgot_password_token as TokenPayLoad
  const { password } = req.body
  const result = await usersService.resetPassword({ user_id, password })
  return res.json(result)
  // cập nhật password mới có user có user_id này
}

export const getMeController = async (req: Request, res: Response) => {
  // muốn lấy thông tin từ user thì cần userID
  const { user_id } = req.decoded_authorization as TokenPayLoad
  // tiến hành vào db tìm và lấy thông tin user
  const user = await usersService.getMe(user_id)
  return res.json({
    message: USERS_MESSAGES.GET_ME_SUCCESS,
    data: user
  })
}
export const updateMeController = async (req: Request<ParamsDictionary, any, UpdateMeReqBody>, res: Response) => {
  //muốn update thông tin của user thì cần user_id và thông tin mà ng ta muốn update
  const { user_id } = req.decoded_authorization as TokenPayLoad
  const { body } = req //đã dùng body thì nhớ định nghĩa
  // update user thông qua user_id với body đc cho
  const result = await usersService.updateMe(user_id, body)
  return res.json({
    message: USERS_MESSAGES.UPDATE_ME_SUCCESS,
    result
  })
}

export const getProfileController = async (req: Request<GetProfileReqParams>, res: Response) => {
  // muốn lấy thông tin của user thì cần username
  const { username } = req.params
  // tiến hành vào db tìm và lấy thông tin user
  const user = await usersService.getProfile(username)
  return res.json({
    message: USERS_MESSAGES.GET_PROFILE_SUCCESS,
    result: user
  })
}
