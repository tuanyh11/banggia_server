import productRt from './ProductRt'
import userRt from './UserRt'
import { Application} from 'express'

const Routes = (app: Application) => {
    app.use('/api/product', productRt)
    app.use('/api/user', userRt)
}

export default Routes