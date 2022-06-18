import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const {HOST, USER, DATABASE, PASSWORD} = process.env


const pool = mysql.createPool({
    host: HOST,
    user: USER,
    database: DATABASE,
    connectionLimit: 10,
    password: PASSWORD,
    multipleStatements: false
})


const connection = ()  => { 

    pool.getConnection(err => {

        if(err) console.log(err) 
        
        else console.log('connect database successfully')

    })

}

connection()




export default pool.promise()