import "reflect-metadata";
import {
  Module,
  Injectable,
  Inject,
} from "../../../src/core/di/container-decorator";
import { getMetadata } from "../../../src/core/metadata";

describe("Container Decorators", () => {
  describe("@Module", () => {
    it("deve definir metadata para um módulo vazio", () => {
      @Module()
      class TestModule {}

      const metadata = getMetadata(TestModule);

      expect(metadata).toBeDefined();
      expect(metadata).toEqual({});
    });

    it("deve definir metadata com controllers", () => {
      class TestController {}

      @Module({
        controllers: [TestController],
      })
      class TestModule {}

      const metadata = getMetadata(TestModule);

      expect(metadata).toBeDefined();
      expect(metadata.controllers).toEqual([TestController]);
    });

    it("deve definir metadata com providers", () => {
      class TestService {}

      @Module({
        providers: [TestService],
      })
      class TestModule {}

      const metadata = getMetadata(TestModule);

      expect(metadata).toBeDefined();
      expect(metadata.providers).toEqual([TestService]);
    });

    it("deve definir metadata com imports", () => {
      @Module()
      class ImportedModule {}

      @Module({
        imports: [ImportedModule],
      })
      class TestModule {}

      const metadata = getMetadata(TestModule);

      expect(metadata).toBeDefined();
      expect(metadata.imports).toEqual([ImportedModule]);
    });

    it("deve definir metadata completa", () => {
      class TestController {}
      class TestService {}

      @Module()
      class ImportedModule {}

      @Module({
        controllers: [TestController],
        providers: [TestService],
        imports: [ImportedModule],
      })
      class TestModule {}

      const metadata = getMetadata(TestModule);

      expect(metadata).toBeDefined();
      expect(metadata.controllers).toEqual([TestController]);
      expect(metadata.providers).toEqual([TestService]);
      expect(metadata.imports).toEqual([ImportedModule]);
    });
  });

  describe("@Injectable", () => {
    it("deve marcar uma classe como injetável", () => {
      @Injectable()
      class TestService {}

      const metadata = getMetadata(TestService);

      expect(metadata).toBeDefined();
      expect(metadata.injectable).toBe(true);
    });

    it("deve funcionar com múltiplas classes", () => {
      @Injectable()
      class ServiceA {}

      @Injectable()
      class ServiceB {}

      const metadataA = getMetadata(ServiceA);
      const metadataB = getMetadata(ServiceB);

      expect(metadataA.injectable).toBe(true);
      expect(metadataB.injectable).toBe(true);
    });
  });

  describe("@Inject", () => {
    it("deve definir metadata de injeção de dependência", () => {
      class DependencyService {}

      class TestService {
        constructor(@Inject(DependencyService) dependency: DependencyService) {}
      }

      const paramTypes = Reflect.getMetadata("design:paramtypes", TestService);

      expect(paramTypes).toBeDefined();
      expect(paramTypes[0]).toBe(DependencyService);
    });

    it("deve lidar com múltiplas injeções", () => {
      class ServiceA {}
      class ServiceB {}

      class TestService {
        constructor(
          @Inject(ServiceA) serviceA: ServiceA,
          @Inject(ServiceB) serviceB: ServiceB,
        ) {}
      }

      const paramTypes = Reflect.getMetadata("design:paramtypes", TestService);

      expect(paramTypes).toBeDefined();
      expect(paramTypes[0]).toBe(ServiceA);
      expect(paramTypes[1]).toBe(ServiceB);
    });
  });
});
