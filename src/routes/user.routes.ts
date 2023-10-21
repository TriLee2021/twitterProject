import { loginValidator, registerValidator } from './../middlewares/users.middlewares'
import { Router } from 'express'
import { loginController } from '~/controllers/users.controllers'
import { registerController } from '~/controllers/users.controllers'
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
usersRouter.get('/login', loginValidator, loginController)
// register họ sẽ đẩy dữ liệu lên nên để .post
// register sẽ check validator của những cái dữ liệu đc truyền lên
usersRouter.post('/register', registerValidator, registerController)
// khi 1 người dùng mà truy cập register, họ sẽ gửi cho mình 1 rq và
// rq đó sẽ bao gồm email và password mình sẽ xủ lý validate và vô controller
// và lấy 2 cái biến đó nhét vào dtb của mình để lưu lại cái user đó
// nếu lưu thành công hay thất bại sẽ và trả ra những kq tương ứng
// trong quá trình đó thì mình xài try catch

export default usersRouter
