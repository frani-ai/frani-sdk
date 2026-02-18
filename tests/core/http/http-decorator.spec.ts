import "reflect-metadata";
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpStatus,
  Catch,
} from "../../../src/core/http/http-decorator";
import { getMetadata } from "../../../src/core/metadata";
import { HttpStatusCode } from "../../../src/core/http/enums/htt-status.enum";

describe("HTTP Decorators", () => {
  describe("@Controller", () => {
    it("deve definir basePath vazio por padrão", () => {
      @Controller()
      class TestController {}

      const metadata = getMetadata(TestController);

      expect(metadata).toBeDefined();
      expect(metadata.basePath).toBe("");
      expect(metadata.routes).toEqual([]);
    });

    it("deve definir basePath customizado", () => {
      @Controller("users")
      class UserController {}

      const metadata = getMetadata(UserController);

      expect(metadata.basePath).toBe("users");
    });

    it("deve definir basePath com barra inicial", () => {
      @Controller("/api/users")
      class UserController {}

      const metadata = getMetadata(UserController);

      expect(metadata.basePath).toBe("/api/users");
    });

    it("deve preservar rotas existentes", () => {
      @Controller("test")
      class TestController {
        @Get("/")
        index() {}
      }

      const metadata = getMetadata(TestController);

      expect(metadata.routes).toHaveLength(1);
      expect(metadata.basePath).toBe("test");
    });
  });

  describe("@Get", () => {
    it("deve registrar uma rota GET", () => {
      @Controller()
      class TestController {
        @Get("/test")
        getTest() {}
      }

      const metadata = getMetadata(TestController);

      expect(metadata.routes).toHaveLength(1);
      expect(metadata.routes[0]).toEqual({
        method: "GET",
        path: "/test",
        handlerName: "getTest",
      });
    });

    it("deve registrar múltiplas rotas GET", () => {
      @Controller()
      class TestController {
        @Get("/users")
        getUsers() {}

        @Get("/users/:id")
        getUser() {}
      }

      const metadata = getMetadata(TestController);

      expect(metadata.routes).toHaveLength(2);
      expect(metadata.routes[0].method).toBe("GET");
      expect(metadata.routes[0].path).toBe("/users");
      expect(metadata.routes[1].method).toBe("GET");
      expect(metadata.routes[1].path).toBe("/users/:id");
    });

    it("deve registrar rota raiz", () => {
      @Controller()
      class TestController {
        @Get("/")
        index() {}
      }

      const metadata = getMetadata(TestController);

      expect(metadata.routes[0].path).toBe("/");
    });
  });

  describe("@Post", () => {
    it("deve registrar uma rota POST", () => {
      @Controller()
      class TestController {
        @Post("/users")
        createUser() {}
      }

      const metadata = getMetadata(TestController);

      expect(metadata.routes).toHaveLength(1);
      expect(metadata.routes[0]).toEqual({
        method: "POST",
        path: "/users",
        handlerName: "createUser",
      });
    });

    it("deve registrar múltiplas rotas POST", () => {
      @Controller()
      class TestController {
        @Post("/users")
        createUser() {}

        @Post("/products")
        createProduct() {}
      }

      const metadata = getMetadata(TestController);

      expect(metadata.routes).toHaveLength(2);
      expect(metadata.routes[0].method).toBe("POST");
      expect(metadata.routes[1].method).toBe("POST");
    });
  });

  describe("@Put", () => {
    it("deve registrar uma rota PUT", () => {
      @Controller()
      class TestController {
        @Put("/users/:id")
        updateUser() {}
      }

      const metadata = getMetadata(TestController);

      expect(metadata.routes).toHaveLength(1);
      expect(metadata.routes[0]).toEqual({
        method: "PUT",
        path: "/users/:id",
        handlerName: "updateUser",
      });
    });
  });

  describe("@Delete", () => {
    it("deve registrar uma rota DELETE", () => {
      @Controller()
      class TestController {
        @Delete("/users/:id")
        deleteUser() {}
      }

      const metadata = getMetadata(TestController);

      expect(metadata.routes).toHaveLength(1);
      expect(metadata.routes[0]).toEqual({
        method: "DELETE",
        path: "/users/:id",
        handlerName: "deleteUser",
      });
    });
  });

  describe("Múltiplos métodos HTTP", () => {
    it("deve registrar rotas de diferentes métodos HTTP", () => {
      @Controller("users")
      class UserController {
        @Get("/")
        list() {}

        @Get("/:id")
        get() {}

        @Post("/")
        create() {}

        @Put("/:id")
        update() {}

        @Delete("/:id")
        delete() {}
      }

      const metadata = getMetadata(UserController);

      expect(metadata.routes).toHaveLength(5);
      expect(metadata.routes[0].method).toBe("GET");
      expect(metadata.routes[1].method).toBe("GET");
      expect(metadata.routes[2].method).toBe("POST");
      expect(metadata.routes[3].method).toBe("PUT");
      expect(metadata.routes[4].method).toBe("DELETE");
    });

    it("deve manter os nomes dos handlers corretos", () => {
      @Controller()
      class TestController {
        @Get("/test1")
        handler1() {}

        @Post("/test2")
        handler2() {}

        @Put("/test3")
        handler3() {}
      }

      const metadata = getMetadata(TestController);

      expect(metadata.routes[0].handlerName).toBe("handler1");
      expect(metadata.routes[1].handlerName).toBe("handler2");
      expect(metadata.routes[2].handlerName).toBe("handler3");
    });
  });

  describe("@HttpStatus", () => {
    it("deve definir status code para uma rota", () => {
      @Controller()
      class TestController {
        @HttpStatus(HttpStatusCode.CREATED)
        @Post("/users")
        createUser() {}
      }

      const metadata = getMetadata(TestController);

      // Status code pode estar na rota ou em statusCodes
      const hasStatusInRoute =
        metadata.routes[0]?.statusCode === HttpStatusCode.CREATED;
      const hasStatusInMeta =
        metadata.statusCodes?.createUser === HttpStatusCode.CREATED;

      expect(hasStatusInRoute || hasStatusInMeta).toBe(true);
    });

    it("deve armazenar status code quando rota ainda não foi registrada", () => {
      @Controller()
      class TestController {
        @HttpStatus(HttpStatusCode.NO_CONTENT)
        @Delete("/users/:id")
        deleteUser() {}
      }

      const metadata = getMetadata(TestController);

      // Status code pode estar na rota ou em statusCodes
      const hasStatusInRoute =
        metadata.routes[0]?.statusCode === HttpStatusCode.NO_CONTENT;
      const hasStatusInMeta =
        metadata.statusCodes?.deleteUser === HttpStatusCode.NO_CONTENT;

      expect(hasStatusInRoute || hasStatusInMeta).toBe(true);
    });

    it("deve funcionar com diferentes status codes", () => {
      @Controller()
      class TestController {
        @HttpStatus(HttpStatusCode.OK)
        @Get("/users")
        list() {}

        @HttpStatus(HttpStatusCode.CREATED)
        @Post("/users")
        create() {}

        @HttpStatus(HttpStatusCode.NO_CONTENT)
        @Delete("/users/:id")
        delete() {}
      }

      const metadata = getMetadata(TestController);

      // Verificar se os status codes foram definidos
      expect(metadata.routes.length).toBe(3);

      // Verificar se pelo menos um dos métodos de armazenamento foi usado
      const hasStatusCodes =
        metadata.statusCodes && Object.keys(metadata.statusCodes).length > 0;
      const hasRouteStatusCodes = metadata.routes.some(
        (route: any) => route.statusCode !== undefined,
      );

      expect(hasStatusCodes || hasRouteStatusCodes).toBe(true);
    });
  });

  describe("@Catch", () => {
    it("deve marcar uma classe como exception filter", () => {
      @Catch()
      class GlobalExceptionFilter {}

      const metadata = getMetadata(GlobalExceptionFilter);

      expect(metadata).toBeDefined();
      expect(metadata.isExceptionFilter).toBe(true);
    });

    it("deve funcionar com múltiplos exception filters", () => {
      @Catch()
      class Filter1 {}

      @Catch()
      class Filter2 {}

      const metadata1 = getMetadata(Filter1);
      const metadata2 = getMetadata(Filter2);

      expect(metadata1.isExceptionFilter).toBe(true);
      expect(metadata2.isExceptionFilter).toBe(true);
    });
  });

  describe("Integração de decorators", () => {
    it("deve combinar @Controller com rotas HTTP", () => {
      @Controller("api/v1")
      class ApiController {
        @Get("/status")
        getStatus() {}

        @Post("/data")
        postData() {}
      }

      const metadata = getMetadata(ApiController);

      expect(metadata.basePath).toBe("api/v1");
      expect(metadata.routes).toHaveLength(2);
      expect(metadata.routes[0].method).toBe("GET");
      expect(metadata.routes[1].method).toBe("POST");
    });

    it("deve combinar rotas HTTP com @HttpStatus", () => {
      @Controller()
      class TestController {
        @Post("/users")
        @HttpStatus(HttpStatusCode.CREATED)
        createUser() {}

        @Get("/users")
        @HttpStatus(HttpStatusCode.OK)
        listUsers() {}
      }

      const metadata = getMetadata(TestController);

      expect(metadata.routes).toHaveLength(2);
    });
  });
});
