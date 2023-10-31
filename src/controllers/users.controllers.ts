import { NextFunction } from 'express'
// file chứa tất cả các controllers liên quan đến users
// nơi xử lý logic
//nếu không import Express thì nó đang xài interface của fetch API
import { Request, Response } from 'express'
import { LoginReqBody, RegisterReqBody, logoutReqBody } from '~/models/request/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'
import usersService from '~/services/users.services'
import User from '~/models/schemas/User.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/message'
import databaseService from '~/services/database.services'

// export const loginController = (req: Request, res: Response) => {
//   const { email, password } = req.body //đây chính là cái rq
//   //phải vô trong database mới log ra và kiểm tra chứ không phải như này

//   if (email === 'test@gmail.com' && password === '123456') {
//     //đây chính là cái response
//     return res.json({
//       message: 'loginSuccessful',
//       data: [
//         { fname: 'Điệp', yob: 1999 },
//         { fname: 'Hùng', yob: 2003 },
//         { fname: 'Được', yob: 1994 }
//       ]
//     })
//   }
//   //nếu mà không có thì phải luôn trả ra 1 cái response có status là 401
//   return res.status(401).json({
//     error: 'login failed'
//   })
// }

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  // nếu nó vào đây, tức là nó đã đăng nhập thành công
  const user = req.user as User //khi mà mình check login valid và Schema
  const user_id = user._id as ObjectId

  // server phải tạo ra access_token và refresh_token để đưa cho client
  const result = await usersService.login(user_id.toString())
  return res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESS,
    result
  })
}

// khi định nghĩa chức năng register thì body của nó phải trông như nào
// => tạo interface để định nghĩa cái body trông như nào

// Response Body: cái gói hàng mà server gửi về trông như nào
// RegisterReqBody: body của cái req mà ng dùng gửi lên cho mình
// |||||||||||||||||||||||||||||||||||||||||||Param|||||||||||Response Body||RegisterReqBody
export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  // nhét db
  // hành động mà nhét như v dễ bị bug(rớt mạng,...), nên xài catch
  // Controller không nên nhảy 1 phát vô db, rất nguy hiểm

  // throw new Error('error test')
  const result = await usersService.register(req.body)
  return res.json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result
  })
  // } catch (error) {
  //   // res.status(400).json({
  //   //   message: 'resgiter failed',
  //   //   error
  //   // })
  //   // next(error)
  // }
}

export const logoutController = async (req: Request<ParamsDictionary, any, logoutReqBody>, res: Response) => {
  // Lấy refresh token từ req.body
  // và vào database xóa refresh_token này
  const { refresh_token } = req.body
  const result = await usersService.logout(refresh_token)
  res.json(result)
}
