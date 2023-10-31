//controller xài service nhiều hơn
// những cái hàm mà cần kết nối với user và chui vô db lấy dữ liệu
// thì mình cần tạo ra 1 file riêng, xài database của thằng service
// và controller truy cập vào file này để sử dụng

// những lỗi liên quan đến access token thường là lỗi 401
import User from '~/models/schemas/User.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/request/User.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt.'
import { TokenType } from '~/constants/enums'
import { config } from 'dotenv'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/message'
config()

class UsersService {
  // nếu không để string thì mình nó sẽ lỗi vì nó sẽ hiện any
  // khi xài ngta k b cái nào email pwd nên biến nó thành obj
  // payload là cái gói mà nó đưa, đặt tên gì cũng đc
  async register(payload: RegisterReqBody) {
    const result = await databaseService.users.insertOne(
      new User({
        ...payload,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    // Lấy user_id  từ user mới tạo
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signAccessTokenAndsignRefreshToken(user_id)

    // lưu refresh token vào db
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )

    return { access_token, refresh_token }
  }

  //check trùng email
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }

  // viết hàm nhận vào user_id để bỏ vào payload tạo access token
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN }
    })
  }

  // hàm nhận vào user_id và bỏ vào payload để tạo refresh_token
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN }
    })
  }

  private signAccessTokenAndsignRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessTokenAndsignRefreshToken(user_id)
    // lưu rf vào database

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )
    return { access_token, refresh_token }
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return { message: USERS_MESSAGES.LOGOUT_SUCCESS }
  }
}

const usersService = new UsersService()
export default usersService
