// Dependencias que necesitaremos en nuestra API

// 1. Se reclaman los modulos necesarios, así como la configuración de CORS, el paquete de jwt, y el servidor de express.

require('dotenv').config();
const express=require('express');
const app=express();
const sqlite3=require('sqlite3').verbose();
const path=require('path');
var cors = require('cors')

// 2. Se ejecutan las configuraciones de CORS y el servidor de express.


const jwt = require('jsonwebtoken');
import { isANumber, isAString } from './services/typeChecker';

app.use(cors())

app.use(express.json());


// 3. Se crea una base de datos siempre que no exista llamado y te conecta a ella.

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

// 4. Endpoint de auth, que recibe un usuario y devuelve un token de acceso.


app.post('/auth',(req:any,res:any)=>{
    const username = req.body.username
    const user={name:username}
    const accesToken= jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
    console.log('Token got: ',accesToken)
        res.json({status:'ok',data:accesToken});

    return ;
});

// 5. function que verifica el token de acceso, será llamada en cada endpoint que requiera autenticación.

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


// 6. Endpoint de devulta de todos los registros, requiere autenticación.


// endpoint para obtener todos los productos
app.get('/',authenticateToken,(req:any,res:any)=>{


//haremos una consulta a la base de datos
const sql='SELECT * FROM products';
db.all(sql,[],(err:any,rows:any)=>{
    if(err){
        throw err;
    }
    res.json({status:'ok',data:rows});

});    return;

});

// 7. Endpoint de devuelta de un solo registro, requiere un ID cogido de la url, requiere autenticación.

// endpoint para obtener un producto por su ID

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

// 8. endpoint de creación de un registro, requiere un json con el name y stock y un token de autenticación.

// endpoint para insertar un dato en la base de datos
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

// 9. Endpoint de actualización de un registro, requiere un json con el name y stock y un token de autenticación.

// endpoint para actualizar un dato en la base de datos
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

// 10. Endpoint de eliminación de un registro, requiere un ID cogido de la url y un token de autenticación.


//endpoint para eliminar un dato de la base de datos
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