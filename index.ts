// Dependencias que necesitaremos en nuestra API
require('dotenv').config();
const express=require('express');
const app=express();
const sqlite3=require('sqlite3').verbose();
const path=require('path');
var cors = require('cors')

const jwt = require('jsonwebtoken');
import { isANumber, isAString } from './services/typeChecker';

app.use(cors())

app.use(express.json());

const db_name=path.join(__dirname,'db','database.db');
const db=new sqlite3.Database(db_name,(err: { message: any; })=>{
    if(err){
        return console.error(err.message);
    }else{
        console.log('Conectado a la base de datos SQlite.');
    }
});

// Crear una tabla
const sql_create=`CREATE TABLE IF NOT EXISTS products(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    stock INTERGER NOT NULL
);`;
db.run(sql_create,(err: { message: any; })=>{
    if(err){
        return console.error(err.message);
    }else{
        console.log('Tabla creada con éxito.');
    }
});

// Enrutamiento 

// Ruta para acceder al JWT

app.post('/auth',(req:any,res:any)=>{
    const username = req.body.username
    const user={name:username}
    const accesToken= jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    console.log('Token got: ',accesToken)
        res.json({status:'ok',data:accesToken});

    return ;
});

function authenticateToken(req: { headers: { [x: string]: any; }; user: any; },res: { sendStatus: (arg0: number) => any; },next: () => void){
    const token= req.headers['authorization']
    // const token = authHeader && authHeader.split(' ')[1]
    // console.log('Received by backend to check token: ',authHeader)
    if(token==null) return res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err:any,user:any)=>{
        if(err) return res.sendStatus(403)
        req.user=user
        next()
    })
    return
}




// waypoint para obtener todos los productos
app.get('/',authenticateToken,(req:any,res:any)=>{

    // solamente podrás acceder si ya tienes un token
    // if(!req.user){
    //     res.sendStatus(401);
    // return
    // }
        

//haremos una consulta a la base de datos
const sql='SELECT * FROM products';
db.all(sql,[],(err:any,rows:any)=>{
    if(err){
        throw err;
    }
    res.json({status:'ok',data:rows});

});    return;

});

// waypoint para obtener un producto por su ID

app.get('/:id',authenticateToken,(_req:any,res:any)=>{
    //usaermos el id para hacer una consulta a la base de datos
    const id=_req.params.id;
    const sql=`SELECT * FROM products WHERE id=?`;
    db.get(sql,[id],(err:any,row:any)=>{
        if(err){
            return console.error(err.message);
        }else{
            res.json(row);
        }
    }
    );    return;

});

// waypoint para insertar un dato en la base de datos
app.post('/',authenticateToken,(_req:any,res:any)=>{
    const sql='INSERT INTO products(name,stock) VALUES(?,?) RETURNING *';
    const name = _req.body.name
    const stock = _req.body.stock
    
    if(!isAString(name)){
        res.status(400).json({status:'error',message:'El nombre debe ser una cadena de texto'});
        return;
    }
    if(!isANumber(stock)){
        res.status(400).json({status:'error',message:'El stock debe ser un número'});
        return;
    }

    
    db.run(sql,[name,stock],(err:any)=>{
        if(err){
            return console.error(err.message);
        }else{
            res.json({status:'ok'});
        }
    });    return;

});

// waypoint para actualizar un dato en la base de datos
app.put('/:id',authenticateToken,(_req:any,res:any)=>{
    const id=_req.params.id;
    const sql='UPDATE products SET name=?,stock=? WHERE id=?';
    db.run(sql,[_req.body.name,_req.body.stock,id],(err:any)=>{
        if(err){
            return console.error(err.message);
        }else{
            res.json({status:'ok'});
        }
    });    return;

}
);

//waypoint para eliminar un dato de la base de datos
app.delete('/:id',authenticateToken,(_req:any,res:any)=>{
    const id=_req.params.id;
    const sql='DELETE FROM products WHERE id=?';
    db.run(sql,[id],(err:any)=>{
        if(err){
            return console.error(err.message);
        }else{
            res.json({status:'ok'});
        }
    });
    return;
}
);


app.listen(3000)

console.log('Server on port 3000');