

namespace Library {

	public enum EAction {
		InitializeProject,
		ShowInterface,
		Update,
	}

	public class CommandLineOption {
		public string Value;
		public string Name;
	}

	public class Program {

		public static Program _Instance;
		public static Program Instance {
			get
			{
				if (_Instance == null)
				{
					_Instance = new Program();
				}
				return _Instance;
			}
			set {
				_Instance = value;
			}
		}

		public static void init(string[] args)
		{
			var program = Program.Instance;
			string waitForValue = null;
			foreach (string arg in args)
			{
				switch (arg)
				{
					case "edit":
						program.Action = EAction.Update;
						break;
					case "interface":
						program.Action = EAction.ShowInterface;
						break;
					case "init":
						program.Action = EAction.InitializeProject;
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
