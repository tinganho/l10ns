
using System.Collections.Generic;

namespace Program {

	struct Diagnostic {
		public readonly string id;
		public readonly string message;
		public int start;
		public int end;

		public Diagnostic(string id, string message, int start, int end) {
			this.id = id;
			this.message = message;
			this.start = start;
			this.end = end;
		}
	}


	struct CommandOptions {
		public readonly bool help;
		public readonly string action;

		public CommandOptions(bool help, string action) {
			this.help = help;
			this.action = action;
		}
	}

	struct ProgramSession {
		public readonly CommandOptions commandOptions;
		public readonly Diagnostic[] diagnostics;

		public ProgramSession(CommandOptions commandOptions, Diagnostic[] diagnostics) {
			this.commandOptions = commandOptions;
			this.diagnostics = diagnostics;
		}
	}

	class CommandLineParser {

		public static CommandOptions Parse(string[] args) {
			string action = null;
			bool help = false;
			List<Diagnostic> diagnostics = new List<Diagnostic>();
			foreach (var a in args) {
				switch (a) {
					case "--help":
						goto outer;
					case "init":
					case "update":
					case "compile":
					case "set":
						action = a;
						break;
					default:
						diagnostics.Add(new Diagnostic());
						break;
				}
			}
			outer:

			return new CommandOptions(help: help, action: action);
		}
	}
}
