import express from 'express'
import {signin, signup, getUsers, getUser, deleteUser, updateUser} from '../Controller/UserCtl'
import { Response, Request } from 'express'
import authentication from '../Middelware/Auth'


const router = express.Router()

router.post('/signin', signin)

router.get('/', getUsers)

router.get('/:id', getUser)

router.post('/signup',authentication, signup)

router.delete('/:id',authentication, deleteUser)

router.patch('/:id' ,authentication, updateUser)

export default router 