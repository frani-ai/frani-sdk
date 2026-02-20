# 🌐 HttpClientModule - Frani SDK

Módulo HTTP baseado em **Axios** para realizar requisições com `baseURL` e headers padrão configuráveis via **Config** (variáveis de ambiente ou opções no registro do módulo).

## Instalação

O módulo já inclui a dependência `axios`. Basta importar:

```typescript
import { HttpClientModule, HttpClientService } from "@frani/sdk";
```

## Configuração

### 1. Via variáveis de ambiente (Config)

Configure o **ConfigModule** antes e use **forRootAsync**:

```typescript
import { Module, ConfigModule, HttpClientModule } from "@frani/sdk";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    HttpClientModule.forRootAsync(),
  ],
})
export class AppModule {}
```

**Variáveis de ambiente:**

| Variável               | Descrição                | Exemplo                                          |
| ---------------------- | ------------------------ | ------------------------------------------------ |
| `HTTP_CLIENT_BASE_URL` | URL base das requisições | `https://api.example.com/v1`                     |
| `HTTP_CLIENT_HEADERS`  | Headers padrão (JSON)    | `{"Authorization":"Bearer xxx","X-App":"myapp"}` |
| `HTTP_CLIENT_TIMEOUT`  | Timeout em ms            | `15000`                                          |

**Exemplo `.env`:**

```env
HTTP_CLIENT_BASE_URL=https://api.example.com/v1
HTTP_CLIENT_TIMEOUT=15000
HTTP_CLIENT_HEADERS={"Authorization":"Bearer token","Content-Type":"application/json"}
```

### 2. Via opções no registro (forRoot)

```typescript
import { Module, HttpClientModule } from "@frani/sdk";

@Module({
  imports: [
    HttpClientModule.forRoot({
      baseURL: "https://api.example.com/v1",
      timeout: 15000,
      headers: {
        Authorization: "Bearer meu-token",
        "X-Custom-Header": "valor",
      },
    }),
  ],
})
export class AppModule {}
```

### 3. Factory customizada (forRootAsync)

```typescript
import { Module, ConfigModule, HttpClientModule } from "@frani/sdk";

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ".env" }),
    HttpClientModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        baseURL: config.get("API_BASE_URL"),
        timeout: config.getNumber("API_TIMEOUT", 10000),
        headers: {
          Authorization: `Bearer ${config.get("API_TOKEN")}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
```

## Uso do HttpClientService

Injete o serviço e use os métodos HTTP (get, post, put, patch, delete):

```typescript
import { Injectable } from "@frani/sdk";
import { HttpClientService } from "@frani/sdk";

@Injectable()
export class UserApiService {
  constructor(private readonly http: HttpClientService) {}

  async getUsers() {
    const { data } = await this.http.get("/users");
    return data;
  }

  async getUser(id: string) {
    const { data } = await this.http.get(`/users/${id}`);
    return data;
  }

  async createUser(body: { name: string; email: string }) {
    const { data } = await this.http.post("/users", body);
    return data;
  }

  async updateUser(id: string, body: Partial<{ name: string; email: string }>) {
    const { data } = await this.http.patch(`/users/${id}`, body);
    return data;
  }

  async deleteUser(id: string) {
    const { data } = await this.http.delete(`/users/${id}`);
    return data;
  }
}
```

Se você configurou `baseURL`, as URLs nos métodos são relativas a ela (ex.: `get("/users")` → `baseURL + "/users"`).

## API do HttpClientService

- `get<T>(url, config?)` – GET
- `post<T>(url, data?, config?)` – POST
- `put<T>(url, data?, config?)` – PUT
- `patch<T>(url, data?, config?)` – PATCH
- `delete<T>(url, config?)` – DELETE
- `request<T>(config)` – requisição genérica (AxiosRequestConfig)
- `getInstance()` – retorna a instância do Axios (interceptors, etc.)

## Interceptors (Axios)

Para usar interceptors, pegue a instância do Axios:

```typescript
constructor(private readonly http: HttpClientService) {
  const axios = this.http.getInstance();
  axios.interceptors.request.use((config) => {
    config.headers["X-Request-Time"] = new Date().toISOString();
    return config;
  });
  axios.interceptors.response.use(
    (res) => res,
    (err) => {
      // tratar erro global
      return Promise.reject(err);
    }
  );
}
```

## Resumo

- **HttpClientModule.forRoot(options)** – configuração estática (baseURL, headers, timeout).
- **HttpClientModule.forRootAsync()** – lê `HTTP_CLIENT_BASE_URL`, `HTTP_CLIENT_HEADERS` (JSON), `HTTP_CLIENT_TIMEOUT` do Config.
- **HttpClientModule.forRootAsync({ useFactory, inject })** – configuração via factory e Config/dependências.
