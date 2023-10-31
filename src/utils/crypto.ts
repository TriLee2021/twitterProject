// file crypto dùng để mã hóa password
import { config } from 'dotenv'
import { createHash } from 'crypto'
config()

// viết 1 cái hàm nhận vào 1 chuỗi và mã hóa SHA256
function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

// viết 1 hàm nhận vào pwd v2 mã hóa
export function hashPassword(password: string) {
  return sha256(password + (process.env.PASSWORD_SECRET as string))
}
