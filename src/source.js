import {
  isDigit,
  isIdentifierChar,
  isIdentifierStartChar,
  isWhiteSpace,
  numberOfDigit,
} from "./utils";

export class Source {
  constructor(str) {
    this.str = str;
    this.index = 0;
    this.nextChar();
  }

  /**
   * ストリームの次の文字を取り出す
   */
  nextChar() {
    if (this.index >= this.str.length) {
      this.ch = null;
    }
    // console.log({str: this.str, ch: this.ch, index})
    this.ch = this.str[this.index++];
  }

  /**
   * 空白文字を読み飛ばす
   */
  skipSpaces() {
    while (isWhiteSpace(this.ch)) {
      this.nextChar();
    }
  }

  /**
   * ソース文字列の次のトークンを取り出す
   */
  nextToken() {
    // 空白文字を読み飛ばす
    this.skipSpaces();

    // 数字で始まるのは数値トークン
    if (isDigit(this.ch)) {
      return this.nextNumberToken();
    }

    // アルファベットで始めるのは識別子の場合とキーワードの場合がある
    if (isIdentifierStartChar(this.ch)) {
      return this.nextIdentifierOrKeywordToken();
    }

    if (isSymbolToken(this.ch)) {
      const kind = this.ch;
      this.nextChar();
      return { kind };
    }
    return null;
  }

  /**
   * 数値トークンを読んで返す
   */
  nextNumberToken() {
    let value = 0;
    while (isDigit(this.ch)) {
      value = value * 10 + numberOfDigit(this.ch);
      this.nextChar();
    }
    return { kind: "number", value };
  }

  /**
   * 識別子かキーワードのトークンを読んで返す
   */
  nextIdentifierOrKeywordToken() {
    let value = "";
    while (isIdentifierChar(this.ch)) {
      value += this.ch;
      this.nextChar();
    }
    if (value === "write") {
      return { kind: "write" };
    }
    return { kind: "identifier", value };
  }
}

const isSymbolToken = (() => {
  const symbolTable = {};
  [".", "+", "-", "*", "/", "(", ")"].forEach((str) => {
    symbolTable[str] = true;
  });
  return (str) => {
    return symbolTable[str] === true;
  };
})();