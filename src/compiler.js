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
    this.compileExpression();
    this.codeBuilder.emitOprWrt();
  }

  compileExpression() {
    let shouldEmitNeg = false;
    // 単項演算子の処理
    switch (this.token.kind) {
      case "+":
        this.nextToken();
        break;
      case "-":
        shouldEmitNeg = true;
        this.nextToken();
        break;
      default:
        break;
    }
    this.compileTerm();
    if (shouldEmitNeg) {
      this.codeBuilder.emitOprNeg();
    }
    // 中置演算子の処理
    while (true) {
      if (this.token.kind === "+") {
        this.nextToken();
        this.compileTerm();
        this.codeBuilder.emitOprAdd();
        continue;
      }
      if (this.token.kind === "-") {
        this.nextToken();
        this.compileTerm();
        this.codeBuilder.emitOprSub();
        continue;
      }
      break;
    }
  }

  compileTerm() {
    this.compileFactor();
    while (true) {
      if (this.token.kind === "*") {
        this.nextToken();
        this.compileFactor();
        this.codeBuilder.emitOprMul();
        continue;
      }
      if (this.token.kind === "/") {
        this.nextToken();
        this.compileFactor();
        this.codeBuilder.emitOprDiv();
        continue;
      }
      break;
    }
  }

  compileFactor() {
    // 数値
    if (this.token.kind === "number") {
      this.codeBuilder.emitLit(this.token.value);
      this.nextToken();
      return;
    }
    // 括弧で囲まれた式
    if (this.token.kind === "(") {
      this.nextToken();
      this.compileExpression();
      if (this.token.kind !== ")") {
        throw new Error("構文エラー: 括弧が閉じていない");
      }
      this.nextToken();
      return;
    }
    // それ以外はエラー
    throw new Error("構文エラー");
  }
}

export function compile(str) {
  const source = new Source(str);
  const compiler = new Compiler(source);
  return compiler.compile();
}