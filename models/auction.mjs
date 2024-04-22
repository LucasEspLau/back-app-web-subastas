import { pool,sql } from '../conexion.mjs';

export const finalizeAuctionAndUpdateUser = async (id, FK_Estado, id_client, price, callback) => {
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        // Actualiza la subasta con el nuevo estado y el cliente ganador
        const updateAuctionQuery = `
            UPDATE dbMain.dbo.Auction
            SET FK_Estado = @NewState, FK_Client = @WinningClientId, price = @WinningPrice
            WHERE id = @AuctionId;
        `;
        let auctionRequest = new sql.Request(transaction);
        auctionRequest.input('AuctionId', sql.Int, id);
        auctionRequest.input('NewState', sql.Int, FK_Estado);
        auctionRequest.input('WinningClientId', sql.Int, id_client);
        auctionRequest.input('WinningPrice', sql.Decimal(10, 2), price);
        await auctionRequest.query(updateAuctionQuery);

        // Resta el precio ganador de los coins del cliente ganador solo si el estado no es 2
        if (FK_Estado == 2) {
            const updateUserCoinsQuery = `
                UPDATE dbMain.dbo.Client
                SET coins = coins - @WinningPrice
                WHERE id = @WinningClientId AND coins >= @WinningPrice;
            `;
            let clientRequest = new sql.Request(transaction);
            clientRequest.input('WinningClientId', sql.Int, id_client);
            clientRequest.input('WinningPrice', sql.Decimal(10, 2), price);
            await clientRequest.query(updateUserCoinsQuery);
        }

        // Si todo va bien, confirmar la transacción
        await transaction.commit();
        callback(null, { message: 'Auction finalized and user updated successfully' });
    } catch (err) {
        // Si algo sale mal, revertir la transacción
        console.error('Error finalizing auction and updating user:', err);
        await transaction.rollback();
        callback(err);
    }
};


export const createAuction = async (auctionData, callback) => {
    const transaction = new sql.Transaction(pool);
    try {
        const { FK_Product, initialPrice, FK_Box_Auction } = auctionData; // Asumiendo que estos datos se pasan al crear una subasta

        // Inicia una transacción
        
        await transaction.begin();

        // Prepara la consulta SQL para insertar la nueva subasta, asumiendo valores nulos o predeterminados para algunas columnas por ahora
        const sqlQuery = `
            INSERT INTO dbMain.dbo.Auction (FK_Product, price, FK_Box_Auction, FK_Client, FK_Estado, counter_auc)
            OUTPUT INSERTED.id 
            VALUES (@FK_Product, @Price, @FK_Box_Auction, NULL, 1,NULL);  
        `;

        // Ejecuta la consulta
        const request = new sql.Request(transaction);
        request.input('FK_Product', sql.Int, FK_Product);
        request.input('Price', sql.Decimal(10, 2), initialPrice);
        request.input('FK_Box_Auction', sql.Int, FK_Box_Auction);

        const { recordset } = await request.query(sqlQuery);

        // Confirma la transacción
        await transaction.commit();

        // Devuelve el ID de la subasta recién creada
        const auctionId = recordset[0].id;
        callback(null, auctionId);
    } catch (err) {
        console.error('Error creating auction:', err);
        await transaction.rollback();  // Si ocurre un error, revierte la transacción
        callback(err);
    }
};