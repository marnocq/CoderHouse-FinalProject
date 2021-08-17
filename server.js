// Libraries
import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';

// Routes
import routeProducts from './routes/routeProducts.js';
import routeScart from './routes/routeScart.js';

const app = express();
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
const server = http.createServer(app);

const PUERTO = process.env.PORT || 8080;

server.listen(PUERTO, () => {
    console.log(`Servidor iniciado en el puerto: ${server.address().port}`);
});
server.on('error', error => console.log(`Error al iniciar el servidor: ${error}`));

app.use('/api/productos', routeProducts());
app.use('/api/carrito', routeScart());

app.get('/error', (req, res) => {
    res.send('Autorization failed');
});