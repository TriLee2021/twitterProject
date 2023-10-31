// file này dùng để định nghĩa lại req truyền lên từ client
// dùng để định nghĩa lại module
import { Request } from 'express'
import User from './models/schemas/User.schema'
import { TokenPayLoad } from './models/request/User.requests'
// dùng để định nghĩa lại những thuộc tính có sẵn
declare module 'express' {
  //trong 1 req có thể có user nên định nghĩa lại
  interface Request {
    user?: User //trong 1 req có thể có hoặc không có user
    decoded_authorization?: TokenPayLoad
    decoded_refresh_token?: TokenPayLoad
  }
}
