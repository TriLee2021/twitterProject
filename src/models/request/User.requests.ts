import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enums'
import { logoutController } from '~/controllers/users.controllers'
export interface RegisterReqBody {
  // sau này có req nào cần định nghĩa cái body thì vào đây
  name: string
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface logoutReqBody {
  refresh_token: string
}

export interface TokenPayLoad extends JwtPayload {
  user_id: string
  token_type: TokenType
}
