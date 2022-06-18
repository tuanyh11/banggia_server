import pool from '../Connection/ConnectServer'
import { Request, Response } from 'express'
import {RowDataPacket}  from 'mysql2'
import uniqid from 'uniqid'
import moment from 'moment'

interface Body {
    id: string,
    nameProduct: string,
    price: number,
    unit: string,
    updatedAt: string
}

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await pool?.query(`select * from product`) as RowDataPacket
        
        return res.status(200).json({success: true, data: products?.[0]})
    } catch (error) {
        console.log(error)
        res.status(404).json({message: error, success: false})   
    }
}

export const getProduct = async (req: Request, res: Response) => {
    try {
        const [product ]: any= await pool?.query(`select * from product where id = ?`, [req.params.id]) as RowDataPacket
        return res.status(200).json({success: true, data: product[0]})
    } catch (error) {
        res.status(404).json({message: 'lỗi server', success: false})
        console.log(error)
    }
}

export const createProduct = async(req: Request, res: Response) => {
    try {
        if(Object.keys(req.body ).length !== 0)

            req.body.id = uniqid() 

            const {id, nameProduct, price, unit}:Body = req.body

            const exitProduct = await pool?.query(`select nameProduct from product where nameProduct = ?`, [nameProduct]) as RowDataPacket

            if(exitProduct?.[0]?.length) return res.status(403).json({message: 'tên sản phẩm đã tồn tại', success: false})

            await pool?.query(
                `insert into product(id, price, unit, nameProduct) values(? , ?, ?, ?)`, [id, price, unit, nameProduct]
            )

            const [newProduct]:any = await pool?.query(`select * from product where id = ?`, [id]) as RowDataPacket
            if(newProduct[0]) {
               return res.status(200).json({success: true, data: newProduct[0]})
            }

            res.status(404).json({message: 'lỗi server', success: false})
    } catch (error) {
            res.status(404).json({message: 'lỗi server', success: false})
    }
}

export const updateProduct = async(req: Request, res: Response) => {
    try {
        req.body.updateAt = moment().format('YYYY-MM-DD HH:mm:ss')
        const {id} = req.params
        const { price, unit, nameProduct, updatedAt}:Body = req.body
        await pool?.query(`update product set price = ?, unit = ?, nameProduct = ?, updatedAt = ? where id = ?`, [price, unit, nameProduct, updatedAt, id])
        res.status(200).json({success: true, message: 'cập nhật sản phẩm thành công'})
         
    } catch (error) {
        res.status(404).json({message: 'lỗi server', success: false})
        console.log(error)
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        await pool?.query(`delete from product where id = ?`, [req.params.id])

         res.status(200).json({success: true, message: 'xóa thành công'})

    } catch (error) {
        res.status(404).json({message: 'lỗi server', success: false})
        console.log(error)

    }
} 

export const searchProduct = async (req: Request, res: Response) => {
    try {
         const resp = await pool?.query(`select * from product where nameProduct like "%${req.query.q}%"`, )
            res.status(200).json(resp)
        console.log(resp?.[0])
    } catch (error) {
        console.log(error)
    }
}