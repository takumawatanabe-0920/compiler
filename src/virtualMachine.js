export class VirtualMachine {
  // code type 
  // type code = {
    // kind: string トークンの種別
    // level: number
    // numParams: number
  //}
  constructor(code) {
    this.code = code
    this.output = ""
  }

  run() {
    this.pc = 0;
    this.stack = [0, 0];
    this.top = this.stack.length;
    this.display = [0];

    while (true) {
      const inst = this.code[this.pc++];
      switch (inst.kind) {
        case "ret":
          this.runRet(inst);
          break;
        case "lit":
          this.runLit(inst);
          break;
        case "opr":
          this.runOpr(inst);
          break;
        default:
          throw new Error("不明な命令の種類");
      }

      // PCが0の場合実行を停止する
      if (this.pc === 0) {
        break;
      }
    }
  }

  runRet(inst) {
    // 結果を退避する
    const result = this.stack[this.top - 1];
    // top, display, level を呼び出し前に戻す
    this.top = this.display[inst.level];
    this.display[inst.level] = this.stack[this.top];
    this.pc = this.stack[this.top + 1];
    // 積んだ引数分 top を戻す
    this.top -= inst.numParams;
    // 結果をスタックに積む
    this.stack[this.top++] = result;
  }

  runLit(inst) {
    this.stack[this.top++] = inst.value;
  }

  runOpr(inst) {
    console.log({inst})
    switch (inst.operator) {
      case "wrt":
        this.runOprWrt();
        break;
      case "neg":
        this.runOprNeg();
        break;
      case "pls":
        this.runOprPls();
        break;
      case "mns":
        this.runOprMns();
        break;
      case "div":
        this.runOprDiv();
        break;
      case "mul":
        this.runOprMul();
        break;
      default:
        throw new Error(`不明な命令: ${inst.operator}`);
    }
  }

  pushStack(value) {
    this.stack[this.top++] = value;
  }

  popStack() {
    return this.stack[--this.top];
  }

  // stackから取り出して出力
  runOprWrt() {
    const value = this.stack[--this.top];
    this.output += String(value);
  }

  runOprNeg() {
    const rhs = this.popStack(); 
    this.pushStack(rhs * -1);
  }

  runOprPls() {
    const rhs = this.popStack();
    const lhs = this.popStack();
    this.pushStack(lhs + rhs);
  }

  runOprMns() {
    const rhs = this.popStack();
    const lhs = this.popStack();
    this.pushStack(lhs - rhs);
  }

  runOprMul() {
    const rhs = this.popStack();
    const lhs = this.popStack();
    this.pushStack(lhs * rhs);
  }

  runOprDiv() {
    const rhs = this.popStack();
    const lhs = this.popStack();
    this.pushStack(lhs / rhs);
  }
}