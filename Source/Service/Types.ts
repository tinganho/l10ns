
namespace L10ns {
    export interface Map<T> {
        [index: string]: T;
    }

    export type Path = string & { __pathBrand: any };

    export interface TextRange {
        pos: number;
        end: number;
    }

    export interface Identifier extends Node {
        text: string; // Text of identifier (with escapes converted to characters)
    }

    export interface Declaration extends Node {
        _declarationBrand: any;
        name?: Identifier;
    }

    export const enum SyntaxKind {
        OpenBrace,
        ClosingBrace,
        Comma,

        Identifier,
    }

    export interface ParsedCommandLine {
        errors: Diagnostic[];
    }

    export const enum NodeFlags {
        None = 0,
    }

    export interface NodeArray<T> extends Array<T>, TextRange {
    }

    export interface Node extends TextRange {
        kind: SyntaxKind;
        flags: NodeFlags;
        parent?: Node; // Parent node (initialized by binding)
    }

    // Source files are declarations when they are external modules.
    // @kind(SyntaxKind.SourceFile)
    export interface SourceFile extends Declaration {
        endOfFileToken: Node;

        fileName: string;
        path: Path;
        text: string;

        // this map is used by transpiler to supply alternative names for dependencies (i.e. in case of bundling)
        /* @internal */
        renamedDependencies?: Map<string>;
    }

    export interface DiagnosticMessage {
        key: string;
        category: DiagnosticCategory;
        code: number;
        message: string;
    }

    export interface Diagnostic {
        file?: SourceFile;
        start?: number;
        length?: number;
        messageText: string | DiagnosticMessageChain;
        category: DiagnosticCategory;
        code: number;
    }

    /**
     * A linked list of formatted diagnostic messages to be used as part of a multiline message.
     * It is built from the bottom up, leaving the head to be the "main" diagnostic.
     * While it seems that DiagnosticMessageChain is structurally similar to DiagnosticMessage,
     * the difference is that messages are all preformatted in DMC.
     */
    export interface DiagnosticMessageChain {
        messageText: string;
        category: DiagnosticCategory;
        code: number;
        next?: DiagnosticMessageChain;
    }

    export const enum DiagnosticCategory {
        Warning,
        Error,
        Message,
    }
}
