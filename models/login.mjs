import { sql,pool } from "../conexion.mjs";

export const authenticateClient = async (loginDetails, callback) => {
    const { usernameOrEmail, password } = loginDetails;
    try {
        const result = await new sql.Request(pool)
            .input('UsernameOrEmail', usernameOrEmail)
            .input('Password', password)
            .query(`
                SELECT id, userclient, email, coins
                FROM dbMain.dbo.Client
                WHERE (userclient = @UsernameOrEmail OR email = @UsernameOrEmail) AND password = @Password
            `);
        if (result.recordset.length > 0) {
            callback(null, result.recordset[0]);
        } else {
            console.log('No user found with given credentials');
            callback(null, null); // No user found
        }
    } catch (err) {
        console.error('Error during the query execution:', err);
        callback(err, null);
    }
};

export const authenticateAdmin = async (loginDetails, callback) => {
    const { username, password } = loginDetails;
    try {
        const result = await new sql.Request(pool)
            .input('Username', username)
            .input('Password', password)
            .query(`
                SELECT id, username, password
                FROM dbMain.dbo.Admin
                WHERE username = @Username AND password = @Password
            `);
        if (result.recordset.length > 0) {
            callback(null, result.recordset[0]);
        } else {
            console.log('No admin found with given credentials');
            callback(null, null); // No admin found
        }
    } catch (err) {
        console.error('Error during the query execution:', err);
        callback(err, null);
    }
};
