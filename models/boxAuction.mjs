import { pool,sql } from '../conexion.mjs'; // Asegúrate de importar correctamente el pool

export const getAllBoxAuctions = async (callback) => {
    try {
        const result = await new sql.Request(pool).query(`
            SELECT 
            ba.id, 
            ba.auctions, 
            ba.counter, 
            ba.FK_Estado,
            (
                SELECT 
                    a.id, 
                    a.FK_Product, 
                    a.FK_Client, 
                    a.FK_Estado, 
                    a.counter_auc, 
                    a.price, 
                    a.FK_Box_Auction,
                    (
                        SELECT 
                            p.name, 
                            p.imageUrl
                        FROM Product p
                        WHERE p.id = a.FK_Product
                        FOR JSON PATH
                    )  as Product,
                    (
                        SELECT
                            c.id,c.userclient
                        FROM Client c
                        WHERE c.id=a.FK_Client
                        FOR JSON PATH
                    ) as Client
                FROM Auction a 
                WHERE a.FK_Box_Auction = ba.id 
                FOR JSON PATH
            ) as Auctions
            FROM Box_Auction ba
            FOR JSON PATH;
        `);
        const boxAuctions = JSON.parse(result.recordset[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']); // Asumiendo que la salida es una única cadena JSON
        callback(null, boxAuctions);
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        callback(err, null);
    }
};

export const getBoxAuctionById = async (id, callback) => {
    try {
        const result = await new sql.Request(pool)
            .input('BoxAuctionId', id)
            .query(`
                SELECT 
                    ba.id, 
                    ba.counter, 
                    ba.FK_Estado,
                    (
                        SELECT 
                            a.id, 
                            a.FK_Product, 
                            a.FK_Client, 
                            a.FK_Estado, 
                            a.counter_auc, 
                            a.price, 
                            a.FK_Box_Auction,
                            (
                                SELECT 
                                    p.name, 
                                    p.imageUrl
                                FROM Product p
                                WHERE p.id = a.FK_Product
                                FOR JSON PATH
                            ) as Product,
                            (
                                SELECT
                                    c.id,c.userclient
                                FROM Client c
                                WHERE c.id = a.FK_Client
                                FOR JSON PATH
                            ) as Client,
                            (
                                SELECT 
                                    b.id, 
                                    b.amount, 
                                    b.timebet,
                                    b.modality,
                                    b.FK_Client,
                                    c.userclient
                                FROM Bet b
                                LEFT JOIN Client c ON b.FK_Client = c.id
                                WHERE b.FK_Auction = a.id
                                ORDER BY b.timebet DESC
                                FOR JSON PATH
                            ) as Bets
                        FROM Auction a 
                        WHERE a.FK_Box_Auction = @BoxAuctionId
                        FOR JSON PATH
                    ) as Auctions
                FROM Box_Auction ba
                WHERE ba.id = @BoxAuctionId
                FOR JSON PATH;
            `);
        const boxAuction = JSON.parse(result.recordset[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']); // Asumiendo que la salida es una única cadena JSON
        callback(null, boxAuction);
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        callback(err, null);
    }
};
