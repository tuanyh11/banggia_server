import { Request, Response, NextFunction } from "express"
import jwt from 'jsonwebtoken'
import ConnectServer from "../Connection/ConnectServer"
import dotenv from 'dotenv'

dotenv.config()

interface NewRequest extends Request {
    [key: string]: any
}

const authentication = (req: NewRequest, res: Response, next: NextFunction) => {
    const token = req.headers?.authorization?.split(" ")[1]

   try {
    if(token) {
        const user = jwt.verify(token, process?.env?.SECRET as string)
        req.user = user
        next()
    } else {
       res.status(403).json({message: 'lỗi xác thực', success: false})
    }
   } catch (error: any) {
       res.status(403).json({message: error?.message, success: false})
   }
}

export default authentication