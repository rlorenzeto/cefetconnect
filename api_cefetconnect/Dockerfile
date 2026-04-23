# Usa uma imagem do Node
FROM node:20

# Pasta onde o código vai morar no container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o resto do código
COPY . .

# Expõe a porta que o seu backend usa
EXPOSE 3000

# Comando para rodar
CMD ["npm", "run", "start:dev"]