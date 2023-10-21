// file này dùng cho việc kết nối là nhiều
import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@tweetprojectk18f3.3lz8ews.mongodb.net/?retryWrites=true&w=majority`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri)

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      await this.db.command({ ping: 1 })
      // command là ping tới db, nếu thành công sẽ trả về 1
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  // accessor property(getter)
  // mỗi lần truy cập vào cái này lập tức nhận đc cái collections
  // không nên để tên collection vì ng ta sẽ biết trong database có table user
  get users(): Collection<User> {
    // nếu không có 'Collection<User>' máy không hiểu mình lấy collection nào
    // nên khi mà mình xài thì nó sẽ không sổ ra thuộc tính nên là mình ph mô tả nó luôn
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
    //máy mình không bik đây là kiểu string hay undefine nên mình phải thêm
    // 'as string' cho nó hiếu
  }
}

const databaseService = new DatabaseService()
export default databaseService
