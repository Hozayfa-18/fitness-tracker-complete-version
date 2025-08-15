FROM maven:latest AS build
WORKDIR /backend
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim
WORKDIR /backend
COPY --from=build backend/target/backend.jar backend.jar
ENTRYPOINT ["java","-jar","backend.jar"]
EXPOSE 8080