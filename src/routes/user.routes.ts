import {
  forgotPasswordController,
  getMeController,
  getProfileController,
  resetPasswordController,
  updateMeController,
  verifyForgotPasswordTokenController
} from './../controllers/users.controllers'
import { access } from 'fs'
import {
  accessTokenValidator,
  emailVerifyTokenValidator,
  forgotPasswordValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator,
  resetPasswordValidator,
  updateMeValidator,
  verifiedUserValidator,
  verifyForgotPasswordTokenValidator
} from './../middlewares/users.middlewares'
import { Router } from 'express'
import {
  emailVerifyTokenController,
  loginController,
  logoutController,
  resendEmailVerifyController
} from '~/controllers/users.controllers'
import { registerController } from '~/controllers/users.controllers'
import { wrapAsync } from '~/utils/handlers'
import { wrap } from 'module'
import { filterMiddleware } from '~/middlewares/common.middlewares'
import { UpdateMeReqBody } from '~/models/request/User.requests'
const usersRouter = Router() //khai báo Router
//lưu những bộ api lên quan đến users,

// folder route chứa những bộ api liên quan đến function

//usersRouter sử dụng 1 middleware
// usersRouter.use(
//   (req, res, next) => {
//     //next chứng tỏ mdw
//     console.log('Time: ', Date.now())
//     return res.status(200).send('Đồ ngu')
//     next()
//   },
// )

// usersRouter.use(loginValidator)
// không nên xài như v vì bất cứ khi nào route/user thì lúc nào cũng chạy cái
//      mdw validator, chạy bất chấp, như v không có đúng

// route thực hiện chức năng định tuyến dẫn đường cho những rq đến nơi
// mà ta muốn nó đến

//mỗi lần route chạy './login' thì sẽ tạo cho mình 1 cái rq,
//rq đi qua mdw, mdw kiểm tra rq có những thuộc tính này hay không, nó có giá trị hay không, không thành công thì bị chặn,
//thành công thì chạy qua Controller
usersRouter.post('/login', loginValidator, wrapAsync(loginController))
// register họ sẽ đẩy dữ liệu lên nên để .post
// register sẽ check validator của những cái dữ liệu đc truyền lên
usersRouter.post('/register', registerValidator, wrapAsync(registerController))
// khi 1 người dùng mà truy cập register, họ sẽ gửi cho mình 1 rq và
// rq đó sẽ bao gồm email và password mình sẽ xủ lý validate và vô controller
// và lấy 2 cái biến đó nhét vào dtb của mình để lưu lại cái user đó
// nếu lưu thành công hay thất bại sẽ và trả ra những kq tương ứng
// trong quá trình đó thì mình xài try catch
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapAsync(logoutController))

usersRouter.get('/me', accessTokenValidator, wrapAsync(getMeController))
/*
des: verify email token
khi ng dùng đăng ký, họ nhận đc link mail dạng
http://localhost:3000/users/verify-email?token
nếu nhấp vào link thì sẽ tạo ra req dửi lên email_verify_token lên server
server kiểm rta email_verify_token có hợp lệ không
nếu hợp lệ thì từ cái decoded-email_verify_token lấy ra user_id
và vào user_id đó để update email_verify_token thành '', verify = 1, update_atthành ngày hiện tại
path: /users/verify-email
method: POST
body: {email_verify_token: string
}
*/
usersRouter.post('/verify-email', emailVerifyTokenValidator, wrapAsync(emailVerifyTokenController))

/*
des: khi resend email
khi thất lạc , hoặc email_verify_token hết hạn, thì ng dùng có nhu cấu redend email_verify_token

method: post
path: /users/resend-verified-email-token
headers: {Authorization: "Bearer <access_token>"} //đăng nhập mới đc resend
body: {}
*/
/* 
des: khi người dùng quên mật khẫu, họ gửi email để xin mình tạo cho họ forgor-password
*/

usersRouter.post('/forgot-password', forgotPasswordValidator, wrapAsync(forgotPasswordController))

usersRouter.post('/resend-verify-email', accessTokenValidator, wrapAsync(resendEmailVerifyController))
/* 
des: khi người dùng nhấp vào link trong email để reset passworf
họ sẽ gửi lên 1 req kèm forgot passworf token lên server
server sẽ keim64 tra forgot_password_token có hợp lệ không?
sau đó chuyển hướng ng dùng đến trang reset password
path: /users/verify-forgot-passworf
method: Post
body: {forgot_password_token: string}
*/
usersRouter.post(
  '/verify-forgot-password',
  verifyForgotPasswordTokenValidator,
  wrapAsync(verifyForgotPasswordTokenController)
)

usersRouter.post('/reset-password', resetPasswordValidator, wrapAsync(resetPasswordController))

usersRouter.patch(
  '/me',
  accessTokenValidator,
  verifiedUserValidator,
  filterMiddleware<UpdateMeReqBody>([
    'name',
    'date_of_birth',
    'bio',
    'location',
    'website',
    'avatar',
    'username',
    'cover_photo'
  ]),
  updateMeValidator,
  wrapAsync(updateMeController)
)

usersRouter.get(':/username', wrapAsync(getProfileController))
export default usersRouter
