
import fs = require('fs');
import { createScanner, Token } from './Scanner';

interface Key {
    name: string;
    params: string[];
}

export function extractKeysFromFile(file: string, callExpressionIdentifiers: string[]): Key[] {
    const text = fs.readFileSync(file).toString();
    const scanner = createScanner(text, callExpressionIdentifiers);
    const keys: Key[] = [];

    work();

    function scan() {
        return scanner.scan();
    }

    // function value() {
    //     return scanner.value;
    // }

    function literal() {
        return scanner.literal;
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
                    scanner.save();
                    if (nextTokenIs(Token.OpenParen)) {
                        if (nextTokenIs(Token.StringLiteral)) {
                            const name = literal();
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
