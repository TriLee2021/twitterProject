import jwt from 'jsonwebtoken'
import { config } from 'dotenv'
import { TokenPayLoad } from '~/models/request/User.requests'
config()

// làm hàm nhận vào payload, privateKey, options từ đó ký tên
// ký tên rất có khả năng bug(đây là chuyện bth),
// dành riêng callback để xử lý lỗi trong quá trình ký tên
// server luôn trả cho mình resolve nhưng ký tên thì bắt buộc ph
// có reject nếu bị lỗi

// giống như 1 serversite, trong quá trình ký tên thì phải đợi
// để tránh ng dùng truyền dữ liệu lung tung thì nên biến
// cái này thành obj
export const signToken = ({
  payload, //
  privateKey = process.env.JWT_SECRET as string,
  options = { algorithm: 'HS256' }
}: {
  payload: string | object | Buffer
  privateKey?: string
  options?: jwt.SignOptions
}) => {
  //promise của cái token này đc đưa về chuỗi

  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      //xử lý lỗi
      if (err) reject(err)
      resolve(token as string)
    })
  })
}

export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SECRET as string
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  return new Promise<TokenPayLoad>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) throw reject(err)
      resolve(decoded as TokenPayLoad)
    })
  })
}
