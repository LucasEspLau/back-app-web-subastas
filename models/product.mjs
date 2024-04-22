import { sql,pool } from "../conexion.mjs";
import { uploadImageAndGetUrl } from "../service/imgStorage.mjs";

export const getAllProducts = async (callback) => {
    try {
        const result = await new sql.Request(pool)
            .query(`
                SELECT * FROM Product FOR JSON PATH;
            `);
        console.log(result.recordset[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B'])
        const products = JSON.parse(result.recordset[0]['JSON_F52E2B61-18A1-11d1-B105-00805F49916B']); // Asumiendo que la salida es una única cadena JSON
        
        callback(null, products);
    } catch (err) {
        console.error('Error al ejecutar la consulta:', err);
        callback(err, null);
    }
};



export const updateProduct = async (productId, productData, callback) => {
    const transaction = new sql.Transaction(pool);

    try {
        await transaction.begin();

        let imageUrl = productData.imageUrl;
        if (productData.newImage) {
            // Asume que `productData.newImage` es un buffer o un stream de la nueva imagen
            // y que `productData.imageName` contiene el nombre de la nueva imagen.
            // Es importante asegurarse de que este nombre sea único para evitar conflictos.
            imageUrl = await uploadImageAndGetUrl(productData.newImageBuffer, productData.imageName);
        }

        const request = new sql.Request(transaction);
        request.input('Id', sql.Int, productId);
        request.input('Name', sql.VarChar, productData.name);
        request.input('ImageUrl', sql.VarChar, imageUrl);

        await request.query(`
            UPDATE Product
            SET name = @Name, imageUrl = @ImageUrl
            WHERE id = @Id;
        `);

        await transaction.commit();
        callback(null, { message: 'Product updated successfully' });
    } catch (err) {
        console.error('Error updating product:', err);
        await transaction.rollback();
        callback(err);
    }
};


export const createProduct = async (productData, callback) => {
    const transaction = new sql.Transaction(pool);
    try {
        // Inicia una transacción para asegurarte de que todas las operaciones se completen con éxito antes de confirmar los cambios
        
        await transaction.begin();

        let imageUrl;
        if (productData.newImage) {
            // Supongamos que `productData.newImage` contiene el buffer de la nueva imagen
            // y `productData.imageName` contiene el nombre deseado para la imagen.
            // Asegúrate de que el nombre de la imagen sea único para evitar conflictos.
            imageUrl = await uploadImageAndGetUrl(productData.newImage, productData.imageName);
        } else {
            // Si no se proporciona una nueva imagen, puedes establecer una URL predeterminada o dejarla vacía
            imageUrl = productData.imageUrl || '';
        }

        // Prepara la consulta para insertar el nuevo producto en la base de datos
        const request = new sql.Request(transaction);
        request.input('Name', sql.VarChar, productData.name);
        request.input('ImageUrl', sql.VarChar, imageUrl);

        // Ejecuta la consulta
        const result = await request.query(`
            INSERT INTO Product (name, imageUrl)
            VALUES (@Name, @ImageUrl);
            SELECT SCOPE_IDENTITY() as id;
        `);

        // Si la inserción fue exitosa, commit la transacción
        await transaction.commit();

        // Devuelve el ID del producto recién creado, que se puede encontrar en result.recordset[0].id
        callback(null, { id: result.recordset[0].id, ...productData, imageUrl });
    } catch (err) {
        // Si hay un error, realiza rollback de la transacción
        console.error('Error creating product:', err);
        await transaction.rollback();
        callback(err);
    }
};