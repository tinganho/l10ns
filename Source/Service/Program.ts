
/// <reference path='Types.ts'/>
/// <reference path='DiagnosticMessages.Generated.ts'/>

namespace L10ns {
    const helpOption: OptionDeclaration = {
        name: '--help',
        alias: '-h',
        description: 'Show help section. More details with `l10ns [action] --help`.',
    }

    const defaultCommandLineOptions: OptionDeclaration[] = [
    	helpOption,
    	{
    		name: '--version',
    		description: 'Show current l10ns version.',
    	}
    ];

    const commandLineActions: Action[] = [
        {
            action: 'update',
            description: 'Sync localization keys with storage.',
            options: [
                helpOption,
                {
                    name: '--key',
                    alias: '-k',
                    hasValue: true,
                },
                {
                    name: '--value',
                    alias: '-v',
                    hasValue: true,
                },
                {
                    name: '--index',
                    alias: '-i',
                    hasValue: true,
                },
                {
                    name: '--search-index',
                    alias: '-si',
                    hasValue: true,
                }
            ] as OptionDeclaration[],
        },
        {
            action: 'compile',
            description: 'Compile localizations.',
            options: [
                helpOption,
            ],
        },
        {
            action: 'log',
            description: 'See the latest added localizations.',
            options: [
                helpOption,
            ],
        }
    ];

    function isValidAction(action: string): action is ActionString {
        for (let a of commandLineActions) {
            if (a.action === action) {
                return true;
            }
        }

        return false;
    }

    function getOption(option: string, action?: ActionString | null): OptionDeclaration | null {
        if (action) {
            for (const a of commandLineActions) {
                if (action && a.action === action) {
                    if (!a.options) {
                        continue;
                    }
                    for (const o of a.options) {
                        if (o.name === option) {
                            return o;
                        }
                    }
                }
            }
        }
        else {
            for (const o of defaultCommandLineOptions) {
                if (o.name === option) {
                    return o;
                }
            }
        }

        return null;
    }

    export function run(): void {
        const session = parseCommandLine(process.argv);
        if (session.errors.length > 0) {
            printErrors(session.errors);
            return;
        }
        switch (session.action) {
            case 'export-ast':
        }
    }

    function parseCommandLine(args: string[]): ParsedCommandLine {
        const errors: Diagnostic[] = [];
        const options: Option[] = [];
        let lastOptionHasValue = false; // Flag to check if it the current loop is to capture an option value.
        let lastOption: Option | undefined;
        let action: ActionString | null = null;
        for (let i = 2; i < args.length; i++) {
            const arg = args[i];
            let option: OptionDeclaration | null = null;
            if (arg.startsWith('-')) {
                option = getOption(arg, action);
                if (action) {
                    if (!option) {
                        errors.push(createCompilerDiagnostic(Diagnostics.The_action_0_does_not_have_the_command_line_option_1, action, arg));
                        break;
                    }
                }
                else if (!option) {
                    errors.push(createCompilerDiagnostic(Diagnostics.The_option_0_is_not_a_default_option, arg));
                    break;
                }
                const parsedOption = { name: option.name } as Option;
                options.push(parsedOption);
                if (option.hasValue) {
                    lastOption = parsedOption;
                    lastOptionHasValue = true;
                    continue;
                }
            }
            else {
                if (lastOptionHasValue) {
                    if (lastOption) {
                        lastOption.value = arg; 
                    }
                    continue;
                }
                if (isValidAction(arg)) {
                    if (i !== 2) {
                        errors.push(createCompilerDiagnostic(Diagnostics.The_action_0_must_be_the_second_command_line_argument, arg));
                        break;
                    }
                    action = arg;
                    continue;
                }
            }
            lastOption = undefined;
            lastOptionHasValue = false;
        }

        return {
            action,
            options,
            errors,
        }
    }
}
