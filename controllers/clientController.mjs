import * as ClientModel from '../models/client.mjs';

// Función para obtener todos los clientes
export const getAllClients = (req, res) => {
    ClientModel.getAllClients((err, clients) => {
        if (err) {
            console.error('Error fetching clients:', err);
            return res.status(500).json({ message: 'Error fetching clients' });
        }
        res.status(200).json(clients);
    });
};


export const updateClient = (req, res) => {
    const { id } = req.params; // Obtiene el ID del cliente desde los parámetros de la ruta
    const clientData = req.body; // Obtiene los datos actualizados del cliente desde el cuerpo de la solicitud

    // Llama a la función updateClient del modelo, pasando el ID del cliente, los datos actualizados y una función de callback
    ClientModel.updateClient(id, clientData, (err) => {
        if (err) {
            console.error('Error updating client:', err);
            return res.status(500).json({ message: 'Error updating client' });
        }
   
        res.status(200).json({ message: 'Client updated successfully' });
    });
};

export const createClient = (req, res) => {
    const clientData = req.body; // Obtiene los datos del cliente desde el cuerpo de la solicitud

    // Llama a la función createClient del modelo, pasando los datos del cliente y una función de callback
    ClientModel.createClient(clientData, (err, client) => {
        if (err) {
            console.error('Error creating client:', err);
            return res.status(500).json({ message: 'Error creating client' });
        }
        // Si el cliente se crea correctamente, devuelve una respuesta exitosa con los datos del cliente
        res.status(201).json({
            message: 'Client created successfully',
            client: client
        });
        req.io.emit('clientCreateAdmin', { message: 'Client list updated' });
    });
};