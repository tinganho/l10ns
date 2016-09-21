
/// <reference path='Types.ts'/>
/// <reference path='DiagnosticMessages.Generated.ts'/>

namespace L10ns {
    interface Option {
        option: string;
        description: string;
        alias?: string;
        hasValue?: boolean;
    }

    const helpOption: Option = {
        option: '--help',
        alias: '-h',
        description: 'Show help section. More details with `l10ns [action] --help`.',
    }

    // const commandLineOptions: Option[] = [
    // 	helpOption,
    // 	{
    // 		option: '--version',
    // 		description: 'Show current l10ns version.',
    // 	}
    // ];

    type ActionString = 'sync' | 'compile';

    interface Action {
        action: string;
        description: string;
        options?: Option[];
    }

    const commandLineActions: Action[] = [
        {
            action: 'sync',
            description: 'Sync localization keys with storage.',
            options: [
                helpOption,
                {
                    option: '--key',
                    alias: '-k',
                    hasValue: true,
                },
                {
                    option: '--value',
                    alias: '-v',
                    hasValue: true,
                },
                {
                    option: '--index',
                    alias: '-i',
                    hasValue: true,
                },
                {
                    option: '--search-index',
                    alias: '-si',
                    hasValue: true,
                }
            ] as Option[],
        },
        {
            action: 'compile',
            description: 'Compile localizations.',
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

    function getActionsOptions(action: ActionString): Option[] | undefined {
        for (let a of commandLineActions) {
            if (a.action === action) {
                return a.options;
            }
        }

        throw Error(`Unknown action ${action}`);
    }

    function actionHasOption(action: ActionString, option: string): boolean {
        for (const a of commandLineActions) {
            if (a.action === action) {
                if (!a.options) {
                    continue;
                }
                for (const o of a.options) {
                    if (o.option === option) {
                        return true;
                    }
                }
            }
        }

        return false;
    }

    export function parseCommandLine(args: string[]): ParsedCommandLine {
        const errors: Diagnostic[] = [];

        let action: ActionString | undefined;
        let actionOptions: Option[] | undefined = [];
        for (let i = 2; i < args.length; i++) {
            const arg = args[i];
            if (arg.startsWith('-')) {
                if (action) {
                    if (!actionHasOption(action, arg)) {
                        errors.push(createCompilerDiagnostic(Diagnostics.The_action_0_does_not_have_the_command_line_option_1, action, arg));
                        break;
                    }
                }
            }
            else {
                if (i !== 2) {
                    errors.push(createCompilerDiagnostic(Diagnostics.The_action_0_must_be_the_second_command_line_argument, arg));
                    break;
                }
                if (isValidAction(arg)) {
                    action = arg;
                    actionOptions = getActionsOptions(arg);
                }
            }
        }

        if (errors) {
            errors.forEach(error => {
                console.error(`Error L${error.code}: ${error.messageText}`);
            });
        }

        return {
            errors,
        }
    }
}

if (require.main === module) {
    L10ns.parseCommandLine(process.argv);
}