FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Expõe a porta do Vite
EXPOSE 5173

# O host 0.0.0.0 é necessário para o Docker conseguir acessar o Vite
CMD ["npm", "run", "dev", "--", "--host"]