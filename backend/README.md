# AgroLink API (Backend Foundation)

Spring Boot 3 / Java 21 modular monolith foundation. **No business modules yet.**

## Stack

- Spring Boot 3.4
- Java 21
- Maven
- MongoDB (Spring Data)
- Spring Security + JWT
- Validation / Lombok / MapStruct
- springdoc OpenAPI
- Actuator

## Run

```bash
cd backend
mvn spring-boot:run
```

Requires MongoDB at `mongodb://localhost:27017/agrolink` (override with `MONGODB_URI`).

- Health: `GET http://localhost:8080/api/v1/health`
- Swagger UI: `http://localhost:8080/swagger-ui.html`

## Package layout (clean architecture)

```text
com.agrolink
├── config/                 # Mongo, CORS, OpenAPI, properties
├── security/               # SecurityFilterChain, UserPrincipal, JWT
├── common/
│   ├── api/                # ApiResponse, BaseResponse, PageResponse, ProblemDetails
│   ├── exception/          # GlobalExceptionHandler + domain exceptions
│   ├── persistence/        # BaseDocument, BaseMongoRepository, AuditorAware
│   ├── validation/         # ValidationUtils
│   ├── mapper/             # MapStructConfig
│   ├── service/            # ApplicationService marker
│   ├── util/
│   └── logging/            # CorrelationId + MDC
└── system/                 # Foundation health controller only
```

Business modules (`identity`, `catalog`, `demand`, …) will be added later under the same root.
