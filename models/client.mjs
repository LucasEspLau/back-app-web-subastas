import { sql,pool } from "../conexion.mjs";
export const getAllClients = async (callback) => {
    try {
        const result = await new sql.Request(pool).query(`
            SELECT id, userclient, email, password, coins, state
            FROM dbMain.dbo.Client
        `); // No es necesario FOR JSON PATH aquí, mssql maneja los resultados directamente
        callback(null, result.recordset);
    } catch (err) {
        console.error('Error fetching clients:', err);
        callback(err, null);
    }
};

export const updateClient = async (clientId, clientData, callback) => {
    try {
        await new sql.Request(pool)
            .input('Id', clientId)
            .input('Userclient', clientData.userclient)
            .input('Email', clientData.email)
            .input('Password', clientData.password)
            .input('Coins', clientData.coins)
            .input('State', clientData.state)
            .query(`
                UPDATE dbMain.dbo.Client
                SET userclient = @Userclient, email = @Email, password = @Password, coins = @Coins, state = @State
                WHERE id = @Id
            `);
        callback(null);
    } catch (err) {
        console.error('Error updating client:', err);
        callback(err);
    }
};

export const createClient = async (clientData, callback) => {
    try {
        const result = await new sql.Request(pool)
            .input('Userclient', clientData.userclient)
            .input('Email', clientData.email)
            .input('Password', clientData.password)
            .input('Coins', clientData.coins)
            .input('State', 'Active') // Suponiendo que todos los nuevos clientes son 'Active' por defecto
            .query(`
                INSERT INTO dbMain.dbo.Client (userclient, email, password, coins, state)
                OUTPUT INSERTED.id
                VALUES (@Userclient, @Email, @Password, @Coins, @State)
            `);
        const clientId = result.recordset[0].id;
        // Aquí puedes emitir el mensaje después de que la transacción se haya comprometido con éxito
        // Ejemplo: req.io.emit('clientCreated', { message: 'New client created', clientId });
        callback(null, { ...clientData, id: clientId });
    } catch (err) {
        console.error('Error creating client:', err);
        callback(err);
    }
};
