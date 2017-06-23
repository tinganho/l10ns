
import fs = require('fs');
import { createScanner, Token } from './Scanner';

export interface LocalizationGetter {
    name: string;
    params: string[];
    line: number;
    column: number;
}

export function extractKeysFromFile(file: string, callExpressionIdentifiers: string[]): LocalizationGetter[] {
    const text = fs.readFileSync(file).toString();
    const scanner = createScanner(text, callExpressionIdentifiers);
    const keys: LocalizationGetter[] = [];

    work();

    function scan() {
        return scanner.scan();
    }

    function getColumn() {
        return scanner.column;
    }

    function getLine() {
        return scanner.line;
    }

    // function value() {
    //     return scanner.value;
    // }

    function getStringLiteral() {
        return scanner.stringLiteral;
    }

    function nextTokenIs(token: Token): boolean {
        return scanner.scan() === token;
    }

    function work() {
        outer: while (true) {
            const to = scan();
            switch (to) {
                case Token.TextTrivia:
                    continue;
                case Token.EndOfFile:
                    break outer;
                case Token.CallExpressionIdentifier:
                    const line = getLine();
                    const column = getColumn();
                    if (nextTokenIs(Token.OpenParen)) {
                        if (nextTokenIs(Token.StringLiteral)) {
                            const name = getStringLiteral();
                            let params: string[] = [];
                            switch (scan()) {
                                case Token.CloseParen:
                                    break;
                                case Token.Comma:
                                    params = extractParams();
                                    break;
                            }
                            keys.push({
                                name,
                                params,
                                line,
                                column,
                            });
                            continue;
                        }
                    }
            }
            // console.log(t(to));
        }
    }

    function extractParams(): string[] {
        if (nextTokenIs(Token.OpenBrace)) {
            return [];
        }
        return [];
    }

    return keys;
}
