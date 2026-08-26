# Estágio 1: Construir o projeto com Java 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Compila o projeto ignorando os testes para ser mais rápido
RUN mvn clean package -DskipTests

# Estágio 2: Rodar o projeto
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copia o arquivo .jar gerado no estágio anterior
COPY --from=build /app/target/*.jar app.jar
# A porta que o Spring Boot usa
EXPOSE 8080
# Comando para iniciar o Java
ENTRYPOINT ["java", "-jar", "app.jar"]