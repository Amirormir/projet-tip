# backend/Dockerfile
FROM node:18-alpine
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers
COPY . .

# Vérification des fichiers et permissions
RUN ls -la && \
    chmod -R 755 . && \
    echo "Contenu du répertoire /app:" && \
    ls -la && \
    echo "Contenu de index.js:" && \
    cat index.js

EXPOSE 5000
CMD ["node", "index.js"]
