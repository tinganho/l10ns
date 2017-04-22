
export enum Token {
    CallExpressionIdentifier,
    Comma,
    OpenBrace,
    CloseBrace,
    OpenParen,
    CloseParen,
    StringLiteral,
    WhiteSpace,
    TextTrivia,
    Identifier,
    EndOfFile,
}

export function t(t: number) {
    return Token[t];
}

/* @internal */
export const enum CharCode {
    NullCharacter = 0,
    MaxAsciiCharacter = 0x7F,

    LineFeed = 0x0A,              // \n
    CarriageReturn = 0x0D,        // \r
    LineSeparator = 0x2028,
    ParagraphSeparator = 0x2029,
    NextLine = 0x0085,

    // Unicode 3.0 space characters
    Space = 0x0020,   // " "
    NonBreakingSpace = 0x00A0,   //
    EnQuad = 0x2000,
    EmQuad = 0x2001,
    EnSpace = 0x2002,
    EmSpace = 0x2003,
    ThreePerEmSpace = 0x2004,
    FourPerEmSpace = 0x2005,
    SixPerEmSpace = 0x2006,
    FigureSpace = 0x2007,
    PunctuationSpace = 0x2008,
    ThinSpace = 0x2009,
    HairSpace = 0x200A,
    ZeroWidthSpace = 0x200B,
    NarrowNoBreakSpace = 0x202F,
    IdeographicSpace = 0x3000,
    MathematicalSpace = 0x205F,
    Ogham = 0x1680,

    _ = 0x5F,
    $ = 0x24,

    _0 = 0x30,
    _1 = 0x31,
    _2 = 0x32,
    _3 = 0x33,
    _4 = 0x34,
    _5 = 0x35,
    _6 = 0x36,
    _7 = 0x37,
    _8 = 0x38,
    _9 = 0x39,

    a = 0x61,
    b = 0x62,
    c = 0x63,
    d = 0x64,
    e = 0x65,
    f = 0x66,
    g = 0x67,
    h = 0x68,
    i = 0x69,
    j = 0x6A,
    k = 0x6B,
    l = 0x6C,
    m = 0x6D,
    n = 0x6E,
    o = 0x6F,
    p = 0x70,
    q = 0x71,
    r = 0x72,
    s = 0x73,
    t = 0x74,
    u = 0x75,
    v = 0x76,
    w = 0x77,
    x = 0x78,
    y = 0x79,
    z = 0x7A,

    A = 0x41,
    B = 0x42,
    C = 0x43,
    D = 0x44,
    E = 0x45,
    F = 0x46,
    G = 0x47,
    H = 0x48,
    I = 0x49,
    J = 0x4A,
    K = 0x4B,
    L = 0x4C,
    M = 0x4D,
    N = 0x4E,
    O = 0x4F,
    P = 0x50,
    Q = 0x51,
    R = 0x52,
    S = 0x53,
    T = 0x54,
    U = 0x55,
    V = 0x56,
    W = 0x57,
    X = 0x58,
    Y = 0x59,
    Z = 0x5a,

    Ampersand = 0x26,             // &
    Asterisk = 0x2A,              // *
    At = 0x40,                    // @
    Backslash = 0x5C,             // \
    Backtick = 0x60,              // `
    Bar = 0x7C,                   // |
    Caret = 0x5E,                 // ^
    CloseBrace = 0x7D,            // }
    CloseBracket = 0x5D,          // ]
    CloseParen = 0x29,            // )
    Colon = 0x3A,                 // :
    Comma = 0x2C,                 // ,
    Dot = 0x2E,                   // .
    DoubleQuote = 0x22,           // "
    Equals = 0x3D,                // =
    Exclamation = 0x21,           // !
    GreaterThan = 0x3E,           // >
    Hash = 0x23,                  // #
    LessThan = 0x3C,              // <
    Minus = 0x2D,                 // -
    OpenBrace = 0x7B,             // {
    OpenBracket = 0x5B,           // [
    OpenParen = 0x28,             // (
    Percent = 0x25,               // %
    Plus = 0x2B,                  // +
    Question = 0x3F,              // ?
    Semicolon = 0x3B,             // ;
    SingleQuote = 0x27,           // '
    Slash = 0x2F,                 // /
    Tilde = 0x7E,                 // ~

    Backspace = 0x08,             // \b
    FormFeed = 0x0C,              // \f
    ByteOrderMark = 0xFEFF,
    Tab = 0x09,                   // \t
    VerticalTab = 0x0B,           // \v
}

interface PositionStart {
    pos: number;
    start: number;
}

interface Record extends PositionStart {
    pos: number;
    start: number;
    charCode: CharCode;
}

export function createScanner(text: string, callExpressionIdentifiers: string[]) {
    const end = text.length;
    const lastRecord: Record = { pos: 0, start: 1 } as Record;
    let pos = 0;
    let start = 1;
    let isTextTrivia = true;
    let lastCallExpressionIdentifier: PositionStart | undefined;
    let ch: number;

    function scan(): Token {
        start = pos;
        while (true) {
            if (pos >= end) {
                return Token.EndOfFile;
            }
            nextChar();
            if (isTextTrivia) {
                while (!nextCharacterSequenceIsACallExpressionIdentifier()) {
                    nextChar();
                }
                isTextTrivia = false;
                return Token.TextTrivia;
            }
            if (lastCallExpressionIdentifier) {
                forwardToLastCallExressionIdentifier();
                return Token.CallExpressionIdentifier;
            }
            if (isWhiteSpace(ch)) {
                while (isWhiteSpace(ch)) {
                    nextChar();
                }
                pos--;
                return Token.WhiteSpace;
            }
            switch (ch) {
                case CharCode.Comma:
                    return Token.Comma;
                case CharCode.OpenParen:
                    return Token.OpenParen;
                case CharCode.CloseParen:
                    return Token.CloseParen;
                case CharCode.OpenBrace:
                    return Token.OpenBrace;
                case CharCode.CloseBrace:
                    return Token.CloseBrace;
                case CharCode.SingleQuote:
                case CharCode.DoubleQuote:
                    scanStringLiteral();
                    return Token.StringLiteral;
                default:
                    if (isIdentifier(ch)) {
                        return scanIdentifier(), Token.Identifier;
                    }
            }
        }
    }

    function scanStringLiteral() {
        const currentQuote = ch;
        let shouldEscape = false;
        while (nextChar() !== currentQuote && !shouldEscape) {
            if (ch === CharCode.Slash) {
                shouldEscape = true;
                continue;
            }
            shouldEscape = false;
        }
    }

    function isLineBreak(ch: number): boolean {
        // ES5 7.3:
        // The ECMAScript line terminator characters are listed in Table 3.
        //     Table 3: Line Terminator Characters
        //     Code Unit Value     Name                    Formal Name
        //     \u000A              Line Feed               <LF>
        //     \u000D              Carriage Return         <CR>
        //     \u2028              Line separator          <LS>
        //     \u2029              Paragraph separator     <PS>
        // Only the characters in Table 3 are treated as line terminators. Other new line or line
        // breaking characters are treated as white space but not as line terminators.

        return ch === CharCode.LineFeed ||
            ch === CharCode.CarriageReturn ||
            ch === CharCode.LineSeparator ||
            ch === CharCode.ParagraphSeparator;
    }

    function isWhiteSpace(ch: number): boolean {
        return isWhiteSpaceSingleLine(ch) || isLineBreak(ch);
    }

    /** Does not include line breaks. For that, see isWhiteSpaceLike. */
    function isWhiteSpaceSingleLine(ch: number): boolean {
        // Note: nextLine is in the Zs space, and should be considered to be a whitespace.
        // It is explicitly not a line-break as it isn't in the exact set specified by EcmaScript.
        return ch === CharCode.Space ||
            ch === CharCode.Tab ||
            ch === CharCode.VerticalTab ||
            ch === CharCode.FormFeed ||
            ch === CharCode.NonBreakingSpace ||
            ch === CharCode.NextLine ||
            ch === CharCode.Ogham ||
            ch >= CharCode.EnQuad && ch <= CharCode.ZeroWidthSpace ||
            ch === CharCode.NarrowNoBreakSpace ||
            ch === CharCode.MathematicalSpace ||
            ch === CharCode.IdeographicSpace ||
            ch === CharCode.ByteOrderMark;
    }

    function save() {
        lastRecord.pos = pos;
        lastRecord.start = start;
        lastRecord.charCode = ch;
    }

    function revert() {
        pos = lastRecord.pos;
        start = lastRecord.start;
        ch = lastRecord.charCode;
    }

    function nextCharacterSequenceIsACallExpressionIdentifier(): boolean {
        save();
        for (const c of callExpressionIdentifiers) {
            let p = 0;
            const e = c.length;
            while (c.charCodeAt(p) === ch && (p < e || pos < end)) {
                p++;
                if (p === e) {
                    lastCallExpressionIdentifier = {
                        pos,
                        start,
                    };
                    revert();
                    return true;
                }
                nextChar();
            }
            revert();
        }
        return false;
    }

    function forwardToLastCallExressionIdentifier() {
        if (!lastCallExpressionIdentifier) {
            throw new Error('You have not checked for call expression identifiers.');
        }
        pos = lastCallExpressionIdentifier.pos;
        start = lastCallExpressionIdentifier.start;
        ch = text.charCodeAt(pos);
        lastCallExpressionIdentifier = undefined;
    }

    function nextChar(): CharCode {
        return ch = text.charCodeAt(pos++);
    }

    function isIdentifier(ch: number): boolean {
        return ch >= CharCode.A && ch <= CharCode.Z || ch >= CharCode.a && ch <= CharCode.z ||
            ch >= CharCode._0 && ch <= CharCode._9 || ch === CharCode.$ || ch === CharCode._;
    }

    function scanIdentifier(): string {
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
        return text.substring(start, pos);
    }

    return {
        start,
        end,
        scan,
        save,
        revert,
        get value() { return text.substring(start, pos); },
        get literal() { return text.substring(start + 1, pos - 1); },
    };
}
