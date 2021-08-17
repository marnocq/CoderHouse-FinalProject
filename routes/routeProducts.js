import express from 'express';
import fs from 'fs';
import moment from 'moment';

const ADMIN = false;

export default (io) => {
    const router = express.Router();

    router.use(function (req, res, next) {
        if(['agregar', 'borrar', 'actualizar'].some(e => req.originalUrl.includes(e)) && !ADMIN){
            return res.redirect('/error');
        }
        next();
    });


    try{
        fs.readFileSync('./data/productos.json');
    }
    catch(error){
        fs.writeFileSync('./data/productos.json', JSON.stringify([])); 
    }    

    let productos = JSON.parse(fs.readFileSync('./data/productos.json'));

    router.get('/:id?', function(req, res) {
       if(req.params.id){
            const producto = productos.filter((producto) => producto.id == req.params.id)
            if(producto.length == 0){
                res.status(404).send({error:'producto no encontrado'})
            }else{
                res.send(producto)    
            }    
       }else{
            if(productos.length == 0){
                res.status(404).send({error:'no hay productos cargados'})
            }else{
                res.send(productos)
            }      
       }
    });

    router.post('/agregar', function(req, res) {
        const newProducto = req.body
        newProducto.id = productos.length +1
        newProducto.timestamp = moment().format('DD/MM/YYYY HH:mm:ss')
        productos.push(newProducto)     
        //fs.writeFileSync('./data/productos.json', JSON.stringify(productos));   
        //res.send(newProducto)
        res.send('success');
    });

    router.put('/actualizar/:id', function(req, res) {
        for (let i=0; i < productos.length; i++) {
            console.log(`for ${i}`)
            if (productos[i].id == req.params.id) {
               //console.log(req.body)
                productos[i] = req.body
                productos[i].id = req.params.id
                productos[i].timestamp = moment().format('DD/MM/YYYY HH:mm:ss')
                //console.log(productos)
                var productoAct = productos[i]
            }
        }
        res.send(productoAct)
    });

    router.get('/borrar/:id', function(req, res) {
        const productoDel = productos.filter((producto) => producto.id == req.params.id)
        productos = productos.filter((producto) => producto.id != req.params.id)    
        res.send(productoDel)
    });

    return router;
};