#!/bin/bash
echo "Iniciando configuração do Banco de Dados..."

CONTAINER_NAME="cefet_db"
ROOT_PASS="SenhaRootForte2026!"
APP_USER="cefet_app"
APP_PASS="SenhaAppSegura123*"
DB_NAME="cefetconnect"

# 1. Aguarda o banco de dados ligar completamente
echo "Aguardando o MySQL ficar pronto (15s)..."
sleep 15

# 2. Cria o banco, o usuário da aplicação e isola os privilégios (Exigência de Segurança)
echo "Criando usuário da aplicação e configurando acessos..."
docker exec -i $CONTAINER_NAME mysql -u root -p"$ROOT_PASS" <<EOF
CREATE DATABASE IF NOT EXISTS $DB_NAME;
CREATE USER IF NOT EXISTS '$APP_USER'@'%' IDENTIFIED BY '$APP_PASS';
GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$APP_USER'@'%';
FLUSH PRIVILEGES;
EOF

# 3. Importa as tabelas e dados iniciais (Seed)
echo "Importando o arquivo cefetconnectbanco.sql..."
docker exec -i $CONTAINER_NAME mysql -u root -p"$ROOT_PASS" $DB_NAME < cefetconnectbanco.sql

echo "Banco de dados configurado com sucesso!"