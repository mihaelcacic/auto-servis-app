# Postavljanje dev okruženja

1. Preduvjeti: Node 20+, Java 17+, Docker, Git.
2. Frontend:

cd ~src/frontend
npm install
npm run dev

3. Backend:

cd src/backend
./mvnw spring-boot:run

4. Baza (Docker):

docker run --name autoservis-db -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgres:16

5. Swagger UI: `http://localhost:8080/swagger-ui.html`
