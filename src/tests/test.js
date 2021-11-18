import { VirtualMachine } from '../virtualMachine'
import { compile } from '../compiler'
import { Source } from '../source'

test("jestが動く", () => {
  expect(2 * 3).toBe(6);
});

test("空のプログラムをコンパイルして実行できる", () => {
  const source = ".";
  const code = compile(source);
  const vm = new VirtualMachine(code);
  vm.run();
  expect(vm.output).toBe("");
});

test("メインブロックで実行するretが動く", () => {
  const code = [{ kind: 'ret', level: 0, numParams: 0 }]
  const vm = new VirtualMachine(code)
  vm.run();
  expect(vm.pc).toBe(0);
  expect(vm.stack[0]).toBe(0);
  expect(vm.display[0]).toBe(0);
});

test("write 123. をコンパイルして実行できる", () => {
  const source = "write 123.";
  const code = compile(source);
  const vm = new VirtualMachine(code);
  vm.run();
  expect(vm.output).toBe("123");
});

test("write 123. を字句解析できる", () => {
  const source = new Source("write 123.");
  expect(source.nextToken()).toEqual({ kind: "write" });
  expect(source.nextToken()).toEqual({ kind: "number", value: 123 });
  expect(source.nextToken()).toEqual({ kind: "." });
  expect(source.nextToken()).toEqual(null);
  expect(source.nextToken()).toEqual(null);
});

test("opr(wrt)が動く", () => {
  const code = [
    { kind: "lit", value: 123 },
    { kind: "opr", operator: "wrt" },
    { kind: "ret", level: 0, numParams: 0 },
  ];
  const vm = new VirtualMachine(code);
  vm.run();
  expect(vm.pc).toBe(0);
  expect(vm.output).toBe("123");
});

test("加算と乗算を含む式をコンパイルして実行できる", () => {
  const source = "write 1 + 2 * 3.";
  const code = compile(source);
  const vm = new VirtualMachine(code);
  vm.run();
  expect(vm.output).toBe("7");
});

test("減算と括弧を含む式をコンパイルして実行できる", () => {
  const source = "write - (3 - 5).";
  const code = compile(source);
  const vm = new VirtualMachine(code);
  vm.run();
  expect(vm.output).toBe("2");
});

test("除算と単項プラスを含む式をコンパイルして実行できる", () => {
  const source = "write + 10 / 2.";
  const code = compile(source);
  const vm = new VirtualMachine(code);
  vm.run();
  expect(vm.output).toBe("5");
});

test("演算子は左結合になっている", () => {
  const source = "write 10 - 5 - 3.";
  const code = compile(source);
  const vm = new VirtualMachine(code);
  vm.run();
  expect(vm.output).toBe("2");
});

test("掛け算の右辺にマイナスを置ける", () => {
  const source = "write -2 * (-3).";
  const code = compile(source);
  const vm = new VirtualMachine(code);
  vm.run();
  expect(vm.output).toBe("6");
});

test("+ - * / ( ) . を字句解析できる", () => {
  const source = new Source("+ - * / ( ) .");
  expect(source.nextToken()).toEqual({ kind: "+" });
  expect(source.nextToken()).toEqual({ kind: "-" });
  expect(source.nextToken()).toEqual({ kind: "*" });
  expect(source.nextToken()).toEqual({ kind: "/" });
  expect(source.nextToken()).toEqual({ kind: "(" });
  expect(source.nextToken()).toEqual({ kind: ")" });
  expect(source.nextToken()).toEqual({ kind: "." });
  expect(source.nextToken()).toEqual(null);
});

test("opr(neg)が動く", () => {
  const code = [
    { kind: "lit", value: 123 },
    { kind: "opr", operator: "neg" },
    { kind: "opr", operator: "wrt" },
    { kind: "ret", level: 0, numParams: 0 },
  ];
  const vm = new VirtualMachine(code);
  vm.run();
  expect(vm.pc).toBe(0);
  expect(vm.output).toBe("-123");
});

test("opr(pls),opr(mns),opr(mul),opr(div)が動く", () => {
  function createVmAndRun(op) {
    const code = [
      { kind: "lit", value: 10 },
      { kind: "lit", value: 5 },
      { kind: "opr", operator: op },
      { kind: "opr", operator: "wrt" },
      { kind: "ret", level: 0, numParams: 0 },
    ];
    const vm = new VirtualMachine(code);
    vm.run();
    return vm;
  }
  expect(createVmAndRun("pls").output).toBe("15");
  expect(createVmAndRun("mns").output).toBe("5");
  expect(createVmAndRun("mul").output).toBe("50");
  expect(createVmAndRun("div").output).toBe("2");
});