import express from 'express'
import {createProduct, getProducts, deleteProduct, getProduct, updateProduct, searchProduct} from '../Controller/ProductCtl'
import { Response, Request } from 'express'
import authentication from '../Middelware/Auth'

const userAuth = (req: Request, res: Response) => {
    
}

const router = express.Router()

router.get('/', getProducts)

router.post('/',authentication, createProduct)

router.route("/:id")
    .delete( deleteProduct)
    .patch( updateProduct)
    .get(getProduct)

router.get('/search/name', searchProduct)

export default router