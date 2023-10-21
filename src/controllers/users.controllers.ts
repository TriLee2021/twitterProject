// file chứa tất cả các controllers liên quan đến users
// nơi xử lý logic
//nếu không import Express thì nó đang xài interface của fetch API
import { Request, Response } from 'express'
import { RegisterReqBody } from '~/models/request/User.requests'
import { ParamsDictionary } from 'express-serve-static-core'

import usersService from '~/services/users.services'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body //đây chính là cái rq
  //phải vô trong database mới log ra và kiểm tra chứ không phải như này

  if (email === 'test@gmail.com' && password === '123456') {
    //đây chính là cái response
    return res.json({
      message: 'loginSuccessful',
      data: [
        { fname: 'Điệp', yob: 1999 },
        { fname: 'Hùng', yob: 2003 },
        { fname: 'Được', yob: 1994 }
      ]
    })
  }
  //nếu mà không có thì phải luôn trả ra 1 cái response có status là 401
  return res.status(401).json({
    error: 'login failed'
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  // nhét db
  // hành động mà nhét như v dễ bị bug(rớt mạng,...), nên xài catch
  // Controller không nên nhảy 1 phát vô db, rất nguy hiểm
  try {
    const result = await usersService.register(req.body)
    res.json({
      message: 'Register successfully',
      result
    })
  } catch (error) {
    res.status(400).json({
      message: 'resgiter failed',
      error
    })
  }
}
