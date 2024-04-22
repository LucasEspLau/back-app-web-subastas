import * as BetModel from '../models/bet.mjs';

export const createBet = (req, res) => {
    const { amount, FK_Client, FK_Auction,modality } = req.body;

    BetModel.createBetAndUpdateAuctionPrice({ amount, FK_Client, FK_Auction,modality }, (err, auctionUpdatedData) => {
        if (err) {
            console.error('Error al crear la apuesta y actualizar la subasta:', err);
            return res.status(500).json({ message: 'Error al procesar la apuesta' });
        }

        // Emite un evento a través de Socket.IO para informar a todos los clientes sobre la subasta actualizada
        req.io.emit('betCreated', auctionUpdatedData);

        res.status(201).json({ message: 'Apuesta procesada y precio de subasta actualizado con éxito', auction: auctionUpdatedData });
    });
};

export const getBetsForAuction = (req, res) => {
    const { id } = req.params; // Obtiene el ID de la subasta de los parámetros de la ruta

    BetModel.getBetsByAuctionId(id, (err, bets) => {
        if (err) {
            console.error('Error al obtener las apuestas para la subasta:', err);
            return res.status(500).json({ message: 'Error al obtener las apuestas para la subasta' });
        }

        res.status(200).json(bets); // Devuelve las apuestas como respuesta
    });
};

