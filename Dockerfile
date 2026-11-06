# Multi-stage production Dockerfile for Tours360 WebXR Platform
# ============================================================
# Stage 1: Build statically compiled Go binary with embedded assets
# ============================================================
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Install ca-certificates
RUN apk --no-cache add ca-certificates

# Copy go module definitions
COPY go.mod ./

# Copy all source code including static/ directory for go:embed
COPY main.go ./
COPY static/ ./static/

# Compile completely static, stripped binary with zero external runtime dependencies
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -ldflags="-s -w" -o tours360 .

# ============================================================
# Stage 2: Minimal Production Image (~15MB total)
# ============================================================
FROM alpine:3.19

# Security: add non-root user & ca-certificates
RUN apk --no-cache add ca-certificates tzdata && \
    addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/tours360 .

# Ensure app runs as non-root user
USER appuser

# Expose default HTTP port
EXPOSE 8080

# Environment variables
ENV PORT=8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

ENTRYPOINT ["./tours360"]
