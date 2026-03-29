FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -o /bin/server ./cmd/server

FROM alpine:3.22

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY --from=builder /bin/server /app/server
COPY --from=builder /app/api /app/api
COPY --from=migrate/migrate:v4.18.3 /usr/local/bin/migrate /app/migrate
COPY --from=builder /app/migrations /app/migrations

EXPOSE 8080

CMD ["/app/server"]
