
import pool from '../Connection/ConnectServer'
import uniqid from 'uniqid'

const ob = {
    id: {
        type: 'string',
        null: false,
    }
}

class Schemas {
    private fields: any
    private nameTable: string
    constructor(name: string, fields: any) {
        fields = {
            ...fields,
            createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
            updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '),
            id: {
                default: uniqid(),
            }
        }
        this.fields = fields
        this.nameTable = name
        fields.id ? new  Error('id was default'): this.createdTable()
    }
    
    async createdTable() {
        // try {
        //     const newTable = await pool?.query(

                // )
        // } catch (error) {
        //     console.log(error)
        // }
        this.stringDif()
    }

    stringDif(){
        let query:string = ''
        const conver = (object: any):string => {
            if(typeof object === 'object') {
                let query: string = ''
                for (const key in object) {
                    query = object[key]
                }
            } else {
                query = object
            }
            
            return query
        } 
        for(const property in this.fields) {
            query = property + conver(this.fields[property])
                
            console.log(property)
        }

        console.log(query)

    }
}

export default Schemas