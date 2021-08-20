import express from 'express';
import fs from 'fs';
import moment from 'moment';

export default (io) => {
    const router = express.Router();

    try{
        fs.readFileSync('./data/sCart.json');
    }
    catch(error){
        fs.writeFileSync('./data/sCart.json', JSON.stringify({id:1, timestamp:moment().format('DD/MM/YYYY HH:mm:ss'), productos:[]})); 
    }    
    
    let sCart = JSON.parse(fs.readFileSync('./data/sCart.json'));
    let productos = JSON.parse(fs.readFileSync('./data/productos.json'));
    
    router.get('/:id?', function(req, res) {
        if(req.params.id){            
            res.send(sCart.productos.find((producto) => producto.id == req.params.id) || {error:'producto no encontrado'})
        }else{
            if(sCart.productos.length == 0){
                res.status(404).send({error:'no hay productos cargados'})
            }else{
                res.send(sCart)
            }  
        }        
    });

    router.post('/agregar/:id', function(req, res) {
        let addProduct = productos.filter((producto) => producto.id == req.params.id)
        //addProduct = JSON.stringify(addProduct)       
        sCart.productos.push(addProduct)
        sCart.productos = sCart.productos.flat()
        fs.writeFileSync('./data/sCart.json', JSON.stringify(sCart));   
        res.send(addProduct)
    });

    router.delete('/borrar/:id', function(req, res) {
        const productoDel = productos.filter((producto) => producto.id == req.params.id)
        sCart.productos = sCart.productos.filter((producto) => producto.id != req.params.id)
        fs.writeFileSync('./data/sCart.json', JSON.stringify(sCart));
        res.send(productoDel)
    });

    return router;
};