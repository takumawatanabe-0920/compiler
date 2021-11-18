export class CodeBuilder {
  constructor() {
    this.code = [];
    this.currentIndex = 0;
  }

  getCode() {
    return this.code;
  }

  emit(code) {
    const index = this.currentIndex++;
    this.code[index] = code;
    return index;
  }

  emitRet(level, numParams) {
    return this.emit({ kind: "ret", level, numParams });
  }

  emitLit(value) {
    return this.emit({ kind: "lit", value });
  }

  emitOprWrt() {
    return this.emit({ kind: "opr", operator: "wrt" });
  }
}