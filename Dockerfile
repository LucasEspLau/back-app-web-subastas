# Utiliza la imagen oficial de Node.js como base
FROM node:20

# Crea el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json (si está disponible)
COPY package*.json ./

# Instala las dependencias de Node.js
RUN npm install

# Copia los archivos de tu proyecto al directorio de trabajo
COPY . .

# Expone el puerto que tu app utiliza
EXPOSE 3000

# Ejecuta la aplicación
CMD [ "node", "server.js" ]
