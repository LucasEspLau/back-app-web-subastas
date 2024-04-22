import * as AuctionModel from '../models/auction.mjs';

// Función para actualizar el estado de una subasta específica
export const updateAuctionState = (req, res) => {
    const { id } = req.params; // ID de la subasta a actualizar
    const { FK_Estado, id_client, price } = req.body; // Obtiene el nuevo estado, el ID del cliente ganador y el precio actual de la subasta del cuerpo de la solicitud

    // Llama al modelo para actualizar la subasta con los nuevos valores
    AuctionModel.finalizeAuctionAndUpdateUser(id, FK_Estado, id_client, price, (err) => {
        if (err) {
            console.error('Error updating auction:', err);
            return res.status(500).json({ message: 'Error updating auction' });
        }
        // Si la actualización es exitosa, devuelve una confirmación y emite un evento a través de socket.io si es necesario
        res.status(200).json({ message: 'Auction updated successfully' });
        console.log('preview auction update')
        req.io.emit('auctionUpdate', { message: 'Auction updated' });
    });
};
export const createAuction = (req, res) => {
    // Recoge los datos necesarios del cuerpo de la solicitud
    const { FK_Product, initialPrice, FK_Box_Auction } = req.body;

    // Llama a la función del modelo para crear la subasta
    AuctionModel.createAuction({ FK_Product, initialPrice, FK_Box_Auction }, (err, auctionId) => {
        if (err) {
            console.error('Error creating auction:', err);
            return res.status(500).json({ message: 'Error creating auction' });
        }

        // Si la subasta se crea con éxito, devuelve el ID de la subasta creada
        res.status(201).json({ message: 'Auction created successfully', auctionId: auctionId });

        // Opcionalmente, puedes emitir un evento a través de socket si necesitas notificar a otros clientes
        req.io.emit('auctionCreated', { message: 'New auction created', auctionId: auctionId });
    });
};