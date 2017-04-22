

namespace Lya.MessageFormat {
    interface Scanner {
        scan(): Token;
        value: string;
    }

    const enum Token {
        OpenBrace,
        CloseBrace,
        SingleQuote,
        DoubleQuote,
        Comma,
        TextTrivia,
        Identifier,
        Space,
        EndOfFile,
    }

    export function createScanner(text: string): Scanner {
        const end = text.length;
        let pos = 0;
        let start: number;
        let token: Token;
        let isTextTrivia = true;
        let charCode: number;

        function scan(): Token {
            start = pos;
            while (true) {
                if (pos >= end) {
                    return Token.EndOfFile;
                }
                nextChar();
                if (isTextTrivia) {
                    while (charCode !== CharCode.OpenBrace && pos > end) {
                        nextChar();
                    }
                    pos--;
                    return Token.TextTrivia;
                }

                switch (charCode) {
                    case CharCode.Comma:
                        return Token.Comma;
                    case CharCode.OpenBrace:
                        isTextTrivia = false;
                        return Token.OpenBrace;
                    case CharCode.CloseBrace:
                        isTextTrivia = true;
                        return Token.CloseBrace;
                    case CharCode.Space:
                        while (charCode === CharCode.Space) {
                            nextChar();
                        }
                        pos--;
                        return Token.Space;
                    default:
                        if (isIdentifier(charCode)) {
                            return scanIdentifier(), Token.Identifier;
                        }
                        return token = Token.Identifier;
                }
            }
        }

        function nextChar(): CharCode {
            return charCode = text.charCodeAt(pos++);
        }

        function isIdentifier(ch: number): boolean {
            return ch >= CharCode.A && ch <= CharCode.Z || ch >= CharCode.a && ch <= CharCode.z ||
                ch >= CharCode._0 && ch <= CharCode._9 || ch === CharCode.$ || ch === CharCode._;
        }

        function scanIdentifier() {
            start = pos;
            while (pos < end) {
                const ch = text.charCodeAt(pos);
                if (isIdentifier(ch)) {
                    pos++;
                }
                else {
                    break;
                }
            }
        }

        return {
            scan,
            get value() { return text.substring(start, pos); },
        };
    }
}
