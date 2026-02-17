import "reflect-metadata";
import { DependencyContainer } from "../../../src/core/di/container";
import { Injectable } from "../../../src/core/di/container-decorator";

describe("DependencyContainer", () => {
  let container: DependencyContainer;

  beforeEach(() => {
    container = new DependencyContainer();
  });

  describe("register", () => {
    it("deve registrar uma instância com um token", () => {
      class TestService {}
      const instance = new TestService();

      container.register(TestService, instance);

      expect(container["instances"].has(TestService)).toBe(true);
      expect(container["instances"].get(TestService)).toBe(instance);
    });

    it("deve sobrescrever uma instância existente", () => {
      class TestService {}
      const instance1 = new TestService();
      const instance2 = new TestService();

      container.register(TestService, instance1);
      container.register(TestService, instance2);

      expect(container["instances"].get(TestService)).toBe(instance2);
    });
  });

  describe("resolve", () => {
    it("deve retornar uma instância já registrada", () => {
      class TestService {}
      const instance = new TestService();

      container.register(TestService, instance);
      const resolved = container.resolve(TestService);

      expect(resolved).toBe(instance);
    });

    it("deve criar e registrar uma nova instância se não existir", () => {
      @Injectable()
      class TestService {}

      const resolved = container.resolve(TestService);

      expect(resolved).toBeInstanceOf(TestService);
      expect(container["instances"].has(TestService)).toBe(true);
    });

    it("deve resolver dependências automaticamente", () => {
      @Injectable()
      class DependencyService {
        getValue() {
          return "dependency value";
        }
      }

      @Injectable()
      class TestService {
        constructor(public dependency: DependencyService) {}
      }

      Reflect.defineMetadata(
        "design:paramtypes",
        [DependencyService],
        TestService,
      );

      const resolved = container.resolve(TestService);

      expect(resolved).toBeInstanceOf(TestService);
      expect(resolved.dependency).toBeInstanceOf(DependencyService);
      expect(resolved.dependency.getValue()).toBe("dependency value");
    });

    it("deve resolver múltiplas dependências", () => {
      @Injectable()
      class ServiceA {
        getName() {
          return "ServiceA";
        }
      }

      @Injectable()
      class ServiceB {
        getName() {
          return "ServiceB";
        }
      }

      @Injectable()
      class ServiceC {
        constructor(
          public serviceA: ServiceA,
          public serviceB: ServiceB,
        ) {}
      }

      Reflect.defineMetadata(
        "design:paramtypes",
        [ServiceA, ServiceB],
        ServiceC,
      );

      const resolved = container.resolve(ServiceC);

      expect(resolved).toBeInstanceOf(ServiceC);
      expect(resolved.serviceA).toBeInstanceOf(ServiceA);
      expect(resolved.serviceB).toBeInstanceOf(ServiceB);
      expect(resolved.serviceA.getName()).toBe("ServiceA");
      expect(resolved.serviceB.getName()).toBe("ServiceB");
    });

    it("deve retornar a mesma instância em múltiplas resoluções (singleton)", () => {
      @Injectable()
      class TestService {}

      const resolved1 = container.resolve(TestService);
      const resolved2 = container.resolve(TestService);

      expect(resolved1).toBe(resolved2);
    });

    it("deve lidar com classes sem dependências", () => {
      @Injectable()
      class SimpleService {
        getValue() {
          return 42;
        }
      }

      const resolved = container.resolve(SimpleService);

      expect(resolved).toBeInstanceOf(SimpleService);
      expect(resolved.getValue()).toBe(42);
    });
  });
});
