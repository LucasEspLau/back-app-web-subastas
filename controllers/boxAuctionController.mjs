// controllers/boxAuctionController.js
import * as BoxAuction from '../models/boxAuction.mjs';



export const fetchAllBoxAuctions = (req, res) => {
    BoxAuction.getAllBoxAuctions((err, data) => {
        if (err) {
            console.error('Error al obtener todos los BoxAuction con subastas:', err);
            return res.status(500).send('Error al obtener los datos');
        }

        res.json(data);
    });
};
// Nuevo controlador para obtener un BoxAuction por id
export const fetchBoxAuctionById = (req, res) => {
    const { id } = req.params; // Extrae el id de los parámetros de la ruta

    BoxAuction.getBoxAuctionById(id, (err, data) => {
        if (err) {
            console.error(`Error al obtener el BoxAuction con id ${id}:`, err);
            return res.status(500).send('Error al obtener los datos');
        }

        // Si no se encontró el BoxAuction, devuelve un 404
        if (!data || data.length === 0) {
            return res.status(404).send('BoxAuction no encontrado');
        }

        res.json(data);
    });
};