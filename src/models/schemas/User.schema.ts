import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'

// tại sao phải cần mô hình hóa user?
//  table của mình có rất nhiều collections và mình ph code trên trùng cái collections đó
//  và khi mà mình lấy dữ liệu từ 1 table(user) thì khi lấy dữ liệu từ user về thì js không
//  hiểu nó đang lấy những gì nên khi chấm nó không sổ ra nh thông tin cơ bản của user
//  cho nên phải dùng schema vì nó giúp cho máy tính hiểu đc cái đối tượng mới lấy từ trên
//  server về nó có nh cái thuộc tính gì, trông như nào
// =>Mô tả nh user nó có những cái gì
// =>User schema nó là một cái hình mẫu về 1 user, định nghĩa cho máy tính hiểu là 1
//user nó có nh thuộc tính như nào, 1 hình mẫu như nào => Models

//đặt interface vì theo chuẩn ts thôi, chứ làm thực tế thì khác
interface UserType {
  _id?: ObjectId
  name: string //required
  email: string //bắt buộc phải mô tả
  date_of_birth?: Date
  password: string //bắt buộc phải mô tả
  created_at?: Date //optinal là ?
  updated_at?: Date //lúc mới tạo chưa có gì thì nên cho bằng create_at
  email_verify_token?: string // jwt hoặc '' nếu đã xác thực email
  forgot_password_token?: string // jwt hoặc '' nếu đã xác thực email
  verify?: UserVerifyStatus

  bio?: string // optional
  location?: string // optional
  website?: string // optional
  username?: string // optional
  avatar?: string // optional
  cover_photo?: string // optional
}

// class user dùng để đóng khuôn, để tạo
export default class User {
  _id?: ObjectId //mongo tự tạo cái này
  name: string
  email: string
  date_of_birth: Date
  password: string
  created_at: Date
  updated_at: Date
  email_verify_token: string
  forgot_password_token: string
  verify: UserVerifyStatus

  bio: string
  location: string
  website: string
  username: string
  avatar: string
  cover_photo: string

  // constructor yêu cầu đưa mô tả
  constructor(user: UserType) {
    const date = new Date() //tạo này cho ngày created_at updated_at bằng nhau
    this._id = user._id || new ObjectId() // tự tạo id
    this.name = user.name || '' // nếu người dùng tạo mà k truyền ta sẽ để rỗng
    this.email = user.email
    this.date_of_birth = user.date_of_birth || new Date()
    this.password = user.password
    this.created_at = user.created_at || date
    this.updated_at = user.updated_at || date
    this.email_verify_token = user.email_verify_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified

    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.username = user.username || ''
    this.avatar = user.avatar || ''
    this.cover_photo = user.cover_photo || ''
  }
}
