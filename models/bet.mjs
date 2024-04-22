import { pool,sql } from '../conexion.mjs'; // Asume que 'pool' es una instancia de 'mssql.ConnectionPool'

export const createBetAndUpdateAuctionPrice = async (betData, callback) => {
    try {

        const insertBetQuery = `
            INSERT INTO dbMain.dbo.Bet (FK_Client, FK_Auction, amount, modality)
            VALUES (@FK_Client, @FK_Auction, @amount, @modality);
        `;
        await new sql.Request(pool)
                .input('FK_Client', betData.FK_Client)
                .input('FK_Auction', betData.FK_Auction)
                .input('amount', betData.amount)
                .input('modality', betData.modality)
                .query(insertBetQuery);

        const updateAuctionQuery = `
                UPDATE dbMain.dbo.Auction
                SET price = @amount, FK_Client = @FK_Client
                WHERE id = @FK_Auction;
            `;

        await new sql.Request(pool)
                .input('amount', betData.amount)
                .input('FK_Client', betData.FK_Client)
                .input('FK_Auction', betData.FK_Auction)
                .query(updateAuctionQuery);
        

        console.log('Transacción exitosa: Apuesta insertada y subasta actualizada.');
        callback(null, true);
    } catch (err) {
        console.error('Error en la transacción:', err);
        callback(err, null);
    }
};

export const getBetsByAuctionId = async (auctionId, callback) => {
    try {

        // Realiza la consulta utilizando FOR JSON PATH para formatear el resultado como JSON
        const result = await new sql.Request(pool)
            .input('AuctionId', auctionId)
            .query(`
                SELECT 
                    b.id, b.amount, b.timebet, b.modality, b.FK_Client, c.userclient
                FROM Bet b
                LEFT JOIN Client c ON b.FK_Client = c.id
                WHERE b.FK_Auction = @AuctionId
                ORDER BY b.timebet DESC
                FOR JSON PATH
            `);

        // El resultado de la consulta será una cadena JSON en la primera fila y columna del recordset
        if (result.recordset.length > 0 && result.recordset[0]) {
            const bets = JSON.parse(result.recordset[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']); // Asume que la columna no tiene nombre, ajusta según sea necesario
            console.log('Consulta completada, apuestas:', bets);
            callback(null, bets);
        } else {
            console.log('Consulta completada, sin apuestas');
            callback(null, []);
        }
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        callback(err, null);
    }
};