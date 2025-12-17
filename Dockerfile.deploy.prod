FROM golang:1.25.4-alpine3.22 AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build \
  -ldflags="-s -w" \
  -trimpath \
  -o deploy \
  ./cmd/deploy

FROM gcr.io/distroless/static-debian12 AS main

WORKDIR /data
COPY --from=builder /app/env.json .
COPY --from=builder /app/deploy /usr/local/bin/deploy
USER nonroot:nonroot
CMD [ "/usr/local/bin/deploy" ]