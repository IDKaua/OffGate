# Estágio 1: Construir o React com Node 20
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio 2: Servir com Nginx
FROM nginx:alpine
# Copia a pasta 'dist' gerada pelo Vite para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# A porta padrão de sites
EXPOSE 80
# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]