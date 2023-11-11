import express, { NextFunction, Request, Response } from 'express'

import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/error.middlewares'
import usersRouter from './routes/user.routes'
const app = express()
//index là file tổng
//post man dùng để test api

//nếu không có dòng này thì server bị lỗi 500, do là route không biết kiểu mà mình
//trả ra là gì, và app của mình thì luôn ném về 1 cái json, nên kêu thằng app của mình nên trả
//kết quả dưới dạng json là đc
app.use(express.json())

const port = 3000
// run(databaseService).catch(console.dir) //chỗ sử dụng
databaseService.connect()
// app.get('/', (req, res) => {
//   res.send('hello world')
// })

app.use('/users', usersRouter) //chứa các bộ api liên quan đến user

app.use(defaultErrorHandler)

app.listen(port, () => {
  console.log(`Project twitter này đang chạy trên post ${port}`)
})
//app tổng sẽ dùng usersRouter trên nên ta sẽ có 1 đường dẫn là /api/tweets
//nên lúc muốn xài api tweets thì ta phải truy cập bằng
//localhost:3000/api/tweets
