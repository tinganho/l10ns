

export interface TextWriter {
    write(s: string): void;
    writeLine(text?: string): void;
    increaseIndent(): void;
    decreaseIndent(): void;
    getText(): string;
    rawWrite(s: string): void;
    writeLiteral(s: string): void;
    getTextPos(): number;
    getLine(): number;
    getColumn(): number;
    getIndent(): number;
    record(): void;
    revertToLastRecord(): void;
    writeFormattedText(text: string): void;
}

export function createTextWriter(): TextWriter {
    const newLine = '\n';
    let output = '';
    let indent = 0;
    let lineStart = true;
    let lineCount = 0;
    let linePos = 0;

    let lastRecord = {
        output,
        indent,
        lineStart,
        lineCount,
        linePos,
    };

    function write(s: string) {
        if (s && s.length) {
            if (lineStart) {
                output += getIndentString(indent);
                lineStart = false;
            }
            output += s;
        }
    }

    function rawWrite(s?: string) {
        if (s !== undefined) {
            if (lineStart) {
                lineStart = false;
            }
            output += s;
        }
    }

    function writeLiteral(s: string) {
        if (s && s.length) {
            write(s);
            const lineStartsOfS = computeLineStarts(s);
            if (lineStartsOfS.length > 1) {
                lineCount = lineCount + lineStartsOfS.length - 1;
                linePos = output.length - s.length + lastOrUndefined(lineStartsOfS)!;
            }
        }
    }

    function writeLine(text?: string) {
        if (text) {
            write(text);
        }
        if (!lineStart) {
            output += newLine;
            lineCount++;
            linePos = output.length;
            lineStart = true;
        }
    }

    function record() {
        lastRecord = {
            output,
            indent,
            lineStart,
            lineCount,
            linePos,
        };
    }

    function revertToLastRecord() {
        output = lastRecord.output;
        indent = lastRecord.indent;
        lineStart = lastRecord.lineStart;
        lineCount = lastRecord.lineCount;
        linePos = lastRecord.linePos;
    }

    function writeFormattedText(text: string) {
        const lines = text.split('\n');
        lines.forEach((line, index) => {
            line = line.trim();
            if (line === '') {
                return;
            }
            if (line === '}') {
                indent--;
            }
            if (index < lines.length - 1) {
                writeLine(line);
            }
            else {
                write(line);
            }
            if (line[line.length - 1] === '{') {
                indent++;
            }
        });
    }

    return {
        write,
        rawWrite,
        writeLiteral,
        writeLine,
        increaseIndent: () => indent++,
        decreaseIndent: () => {
            if (indent === 0) {
                throw new Error('You cannot decrease indent less than 0.');
            }
            indent--;
        },
        getIndent: () => indent,
        getTextPos: () => output.length,
        getLine: () => lineCount + 1,
        getColumn: () => lineStart ? indent * getIndentSize() + 1 : output.length - linePos + 1,
        getText: () => output,
        record,
        revertToLastRecord,
        writeFormattedText,
    };
}

const indentStrings: (string | undefined)[] = ['', '    '];
function getIndentString(level: number): string {
    if (indentStrings[level] === undefined) {
        indentStrings[level] = getIndentString(level - 1) + indentStrings[1];
    }
    return indentStrings[level]!;
}

function getIndentSize() {
    return indentStrings[1]!.length;
}

function computeLineStarts(text: string): number[] {
    const result: number[] = new Array();
    let pos = 0;
    let lineStart = 0;
    while (pos < text.length) {
       const ch = text.charCodeAt(pos++);
       switch (ch) {
            case CharCode.CarriageReturn:
                if (text.charCodeAt(pos) === CharCode.LineFeed) {
                    pos++;
                }
            case CharCode.LineFeed:
                result.push(lineStart);
                lineStart = pos;
                break;
            default:
                if (ch > CharCode.MaxAsciiCharacter && isLineBreak(ch)) {
                    result.push(lineStart);
                    lineStart = pos;
                }
                break;
        }
    }
    result.push(lineStart);
    return result;
}

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

    ampersand = 0x26,             // &
    asterisk = 0x2A,              // *
    at = 0x40,                    // @
    backslash = 0x5C,             // \
    backtick = 0x60,              // `
    bar = 0x7C,                   // |
    caret = 0x5E,                 // ^
    closeBrace = 0x7D,            // }
    closeBracket = 0x5D,          // ]
    closeParen = 0x29,            // )
    colon = 0x3A,                 // :
    comma = 0x2C,                 // ,
    dot = 0x2E,                   // .
    doubleQuote = 0x22,           // "
    equals = 0x3D,                // =
    exclamation = 0x21,           // !
    greaterThan = 0x3E,           // >
    hash = 0x23,                  // #
    lessThan = 0x3C,              // <
    minus = 0x2D,                 // -
    openBrace = 0x7B,             // {
    openBracket = 0x5B,           // [
    openParen = 0x28,             // (
    percent = 0x25,               // %
    plus = 0x2B,                  // +
    question = 0x3F,              // ?
    semicolon = 0x3B,             // ;
    singleQuote = 0x27,           // '
    slash = 0x2F,                 // /
    tilde = 0x7E,                 // ~

    backspace = 0x08,             // \b
    formFeed = 0x0C,              // \f
    byteOrderMark = 0xFEFF,
    tab = 0x09,                   // \t
    verticalTab = 0x0B,           // \v
}

function isLineBreak(ch: number): boolean {
    return ch === CharCode.LineFeed ||
        ch === CharCode.CarriageReturn ||
        ch === CharCode.LineSeparator ||
        ch === CharCode.ParagraphSeparator;
}

function lastOrUndefined<T>(array: T[]): T | undefined {
    if (array.length === 0) {
        return undefined;
    }

    return array[array.length - 1];
}
