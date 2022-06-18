import pool from '../Connection/ConnectServer'
import jwt from 'jsonwebtoken'
import {Response, Request} from 'express'
import bcrypt from 'bcrypt'
import uniqid from 'uniqid'
import {RowDataPacket}  from 'mysql2'
import dotenv from 'dotenv'
import moment from 'moment'

dotenv.config()

interface Req extends Request {
    [key: string]: any
}

export const signin = async(req: Request, res: Response) => {
    try {
        const {phone, password} = req.body

        if(/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone)) {
            
            const [userExisting]: any = await pool?.query(`select * from users where phone = ? `, [phone]) 
            
            if(!userExisting[0]) return res.status(401).json({message: 'không tồn tại user', success: false})
            
            const isPasswordCorrect = await bcrypt.compare(password, userExisting[0].passwords)

            const {passwords, ...user} = userExisting[0]

            if(!isPasswordCorrect) return res.status(400).json({message: 'mật khẩu hoặc số điện thoại không hợp lệ', success: false})

            const token = jwt.sign({...user}, process.env.SECRET as string, {expiresIn: '1h'})


            res.status(200).json({success: true, data: {...user, token}})

        } else {
            return res.status(403).json({message: 'số điện thoại không phù hợp', success: false})
        } 
    } catch (error) {
        res.status(404).json({message: error, success: false})
        console.log(error)
    }
}

export const signup = async(req: Request, res: Response) => {
    try {
        req.body.id = uniqid() 
        const {id, phone, passwords, comfirmPassword, nameUser} = req.body

        if( !nameUser || !phone) return res.status(403).json({message: 'các trường không được để trống', success: false})


        if(/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone)) {
            
            const [userExisting]: any = await pool?.query(`select * from users where phone = ? `, [phone]) 
            
            if(userExisting[0]) return res.status(403).json({message: 'người dùng đã tồn tại', success: false})

            if(passwords.length < 8) return res.status(403).json({message: 'mật khẩu phải lớn hơn 7 ký tự', success: false})

            if(passwords != comfirmPassword) return res.status(403).json({message: 'mật khẩu hoặc số điện thoại không hợp lệ', success: false})
            
            const hasPassword = await bcrypt.hash(passwords, 12)

            const result = await pool?.query(`insert into users (id, phone, passwords, nameUser) values(? , ?, ?, ?)`, [id, phone, hasPassword, nameUser])

            const [userInfo]: any = await pool?.query(`select * from users where phone = '${phone}' `) 

            res.status(200).json({success: true, data: userInfo[0]})

        } else {
            return res.status(403).json({message: 'số điện thoại không phù hợp', success: false})
        } 
    } catch (error) {
        return res.status(403).json({message: 'lỗi server', success: false})
    }
}

export const getUsers = async(req: Request, res: Response) => {
    try {
        const users = await pool?.query(`select * from users`) as RowDataPacket
        
        return res.status(200).json({success: true, data: users?.[0]})
    } catch (error) {
        res.status(404).json({message: 'lỗi server', success: false})
    }
}

export const getUser = async(req: Request, res: Response) => {
    try {
        const [user ]: any= await pool?.query(`select * from users where id = ?`, [req.params.id]) as RowDataPacket
        const {passwords, ...newUser} = user[0]
        return res.status(200).json({success: true, data: newUser})
    } catch (error) {
        res.status(404).json({message: 'lỗi server', success: false})
    }
}

export const deleteUser = async(req: Request, res: Response) => {
    try {
        await pool?.query(`delete from users where id = ?`, [req.params.id]) as RowDataPacket
        res.status(200).json({success: true, data: null})
    } catch (error) {
        res.status(404).json({message: 'lỗi server', success: false})
    }
}

export const updateUser = async(req: Req, res: Response) => {
    try {
        req.body.updateAt = moment().format('YYYY-MM-DD HH:mm:ss')

        const {id} = req.params

        const { nameUser, phone, passwords, updatedAt } = req.body

        if( !nameUser || !phone) return res.status(403).json({message: 'các trường không được để trống', success: false})

        if(/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone)) {
            if(!passwords) {
                const userExisting = await pool?.query(`select * from users where phone = ? `, [phone])  as RowDataPacket
    
                if(userExisting?.[0].length > 0 && userExisting?.[0][0].id !== id) return res.status(401).json({message: 'người dùng đã tồn tại', success: false})
    
                const updateUser = await pool?.query(`update users set nameUser = ?, phone = ?, updatedAt = ? where id = ?`, [nameUser, phone, updatedAt, id]) as RowDataPacket
    
                res.status(200).json({success: true, message: 'cập nhật user thành công'})
    
            } else {
                const hasPassword = await bcrypt.hash(passwords, 12)

                if(passwords.length < 8) return res.status(403).json({message: 'mật khẩu phải lớn hơn 7 ký tự', success: false})
    
                const updateUser = await pool?.query(`update users set nameUser = ?, phone = ?, passwords = ?, updatedAt = ? where id = ?`, [nameUser, phone, hasPassword, updatedAt, id]) as RowDataPacket
    
                res.status(200).json({success: true, message: 'cập nhật sản phẩm thành công'})
            }
        }

         
    } catch (error) {
        res.status(404).json({message: 'lỗi server', success: false})
    }
}