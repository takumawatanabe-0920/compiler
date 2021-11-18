import { CodeBuilder } from './codeBuilder'
import { Source } from './source'
export class Compiler {
  constructor(source) {
    this.source = source;
    this.nextToken();
  }

  nextToken() {
    this.token = this.source.nextToken();
  }

  compile() {
    this.codeBuilder = new CodeBuilder();
    this.compileBlock();
    if (this.token.kind !== ".") {
      throw new Error("構文エラー: 最後の.が足りない");
    }
    return this.codeBuilder.getCode();
  }

  compileBlock() {
    this.compileStatement();
    this.codeBuilder.emitRet(0, 0);
  }

  compileStatement() {
    switch (this.token.kind) {
      case "write":
        this.nextToken();
        this.compileWrite();
        break;
      default:
        // 空文
        break;
    }
  }

  compileWrite() {
    if (this.token.kind !== "number") {
      throw new Error("構文エラー: writeの後ろに数値が必要");
    }
    this.codeBuilder.emitLit(this.token.value);
    this.codeBuilder.emitOprWrt();
    this.nextToken();
  }
}

export function compile(str) {
  const source = new Source(str);
  const compiler = new Compiler(source);
  return compiler.compile();
}