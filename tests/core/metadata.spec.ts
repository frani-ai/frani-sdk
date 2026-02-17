import { defineMetadata, getMetadata } from "../../src/core/metadata";

describe("Metadata", () => {
  describe("defineMetadata", () => {
    it("deve definir metadata para uma função", () => {
      class TestClass {}
      const metadata = { test: "value" };

      defineMetadata(TestClass, metadata);
      const result = getMetadata(TestClass);

      expect(result).toEqual(metadata);
    });

    it("deve sobrescrever metadata existente", () => {
      class TestClass {}
      const metadata1 = { test: "value1" };
      const metadata2 = { test: "value2" };

      defineMetadata(TestClass, metadata1);
      defineMetadata(TestClass, metadata2);
      const result = getMetadata(TestClass);

      expect(result).toEqual(metadata2);
    });

    it("deve armazenar diferentes metadata para diferentes classes", () => {
      class ClassA {}
      class ClassB {}
      const metadataA = { name: "A" };
      const metadataB = { name: "B" };

      defineMetadata(ClassA, metadataA);
      defineMetadata(ClassB, metadataB);

      expect(getMetadata(ClassA)).toEqual(metadataA);
      expect(getMetadata(ClassB)).toEqual(metadataB);
    });

    it("deve aceitar objetos complexos como metadata", () => {
      class TestClass {}
      const metadata = {
        controllers: [class Controller1 {}, class Controller2 {}],
        providers: [class Service1 {}, class Service2 {}],
        imports: [class Module1 {}],
        config: {
          port: 3000,
          host: "localhost",
        },
      };

      defineMetadata(TestClass, metadata);
      const result = getMetadata(TestClass);

      expect(result).toEqual(metadata);
    });

    it("deve aceitar arrays como metadata", () => {
      class TestClass {}
      const metadata = ["item1", "item2", "item3"];

      defineMetadata(TestClass, metadata);
      const result = getMetadata(TestClass);

      expect(result).toEqual(metadata);
    });

    it("deve aceitar strings como metadata", () => {
      class TestClass {}
      const metadata = "simple string metadata";

      defineMetadata(TestClass, metadata);
      const result = getMetadata(TestClass);

      expect(result).toBe(metadata);
    });

    it("deve aceitar números como metadata", () => {
      class TestClass {}
      const metadata = 42;

      defineMetadata(TestClass, metadata);
      const result = getMetadata(TestClass);

      expect(result).toBe(metadata);
    });

    it("deve aceitar null como metadata", () => {
      class TestClass {}
      const metadata = null;

      defineMetadata(TestClass, metadata);
      const result = getMetadata(TestClass);

      expect(result).toBeNull();
    });
  });

  describe("getMetadata", () => {
    it("deve retornar undefined para classe sem metadata", () => {
      class TestClass {}

      const result = getMetadata(TestClass);

      expect(result).toBeUndefined();
    });

    it("deve retornar metadata definida", () => {
      class TestClass {}
      const metadata = { key: "value" };

      defineMetadata(TestClass, metadata);
      const result = getMetadata(TestClass);

      expect(result).toEqual(metadata);
    });

    it("não deve interferir entre diferentes instâncias da mesma classe", () => {
      class TestClass {}
      const metadata = { shared: true };

      defineMetadata(TestClass, metadata);

      const instance1 = new TestClass();
      const instance2 = new TestClass();

      // Metadata é associada à classe, não às instâncias
      expect(getMetadata(TestClass)).toEqual(metadata);
      expect(getMetadata(instance1.constructor)).toEqual(metadata);
      expect(getMetadata(instance2.constructor)).toEqual(metadata);
    });

    it("deve retornar undefined para objetos que não são funções", () => {
      const obj = {};
      const result = getMetadata(obj as any);

      expect(result).toBeUndefined();
    });
  });

  describe("Isolamento de metadata", () => {
    it("metadata de uma classe não deve afetar outra", () => {
      class ClassA {}
      class ClassB {}

      defineMetadata(ClassA, { name: "A" });

      expect(getMetadata(ClassA)).toEqual({ name: "A" });
      expect(getMetadata(ClassB)).toBeUndefined();
    });

    it("deve manter metadata após múltiplas operações", () => {
      class Class1 {}
      class Class2 {}
      class Class3 {}

      defineMetadata(Class1, { id: 1 });
      defineMetadata(Class2, { id: 2 });
      defineMetadata(Class3, { id: 3 });

      expect(getMetadata(Class1)).toEqual({ id: 1 });
      expect(getMetadata(Class2)).toEqual({ id: 2 });
      expect(getMetadata(Class3)).toEqual({ id: 3 });
    });
  });

  describe("Uso com decorators", () => {
    it("deve funcionar com decorators de classe", () => {
      function TestDecorator(metadata: any) {
        return function (target: any) {
          defineMetadata(target, metadata);
        };
      }

      @TestDecorator({ decorated: true })
      class DecoratedClass {}

      const result = getMetadata(DecoratedClass);

      expect(result).toEqual({ decorated: true });
    });

    it("deve permitir múltiplos decorators", () => {
      function Decorator1() {
        return function (target: any) {
          const existing = getMetadata(target) || {};
          defineMetadata(target, { ...existing, decorator1: true });
        };
      }

      function Decorator2() {
        return function (target: any) {
          const existing = getMetadata(target) || {};
          defineMetadata(target, { ...existing, decorator2: true });
        };
      }

      @Decorator1()
      @Decorator2()
      class MultiDecoratedClass {}

      const result = getMetadata(MultiDecoratedClass);

      expect(result).toEqual({ decorator1: true, decorator2: true });
    });
  });
});
