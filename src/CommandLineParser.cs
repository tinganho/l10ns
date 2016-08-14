
using System;

namespace Library {

	public enum EAction {
		InitializeProject,
		OpenWebEditor,
		Set,
	}

	public class Program {
		private static Program _Instance;

		public static Program create() {
			if (_Instance == null)
			{
				_Instance = new Program();
			}
			return _Instance;
		}

		public static void init(string[] args)
		{
			var program = Program.create();
			string waitForValue = null;
			foreach (string arg in args)
			{
				switch (arg)
				{
					case "set":
						program.Action = EAction.Set;
						break;
					case "edit":
						program.Action = EAction.OpenWebEditor;
						break;
					case "init":
						program.Action = EAction.InitializeProject;
						Console.WriteLine("ddddddd");
						break;

					case "--verbose":
						program.IsVerbose = true;
						break;
					case "-l":
					case "--language":
					case "--key":
					case "-k":
						waitForValue = arg;
						break;

					default:
						if (waitForValue != null) {
							switch (waitForValue) {
								case "-l":
								case "--language":
									program.Language = arg;
									break;
								case "-k":
								case "--key":
									program.Key = arg;
									break;
							}
						}
						waitForValue = null;
						break;
				}
			}
		}

		public bool IsVerbose = false;
		public string Language;
		public string Key;

		public EAction Action;

	}
}
