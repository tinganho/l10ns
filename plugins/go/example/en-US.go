package gt

type translation func() string
type translationWithVars func(map[string]string) string

var t = map[string]translation {
    "hello" : func() string {
        return "ollon"
    },
}

var t2 = map[string]translationWithVars {
    "hello2" : func(vars map[string]string) string {
        if vars["bajs"] > vars["ollon"] {
            return "ollewon" + vars["bajs"]
        } else {
            return "bajsollon"
        }

    },
}

func Get(key string) string {
    return t[key]()
}

func GetWithVars(key string, vars map[string]string) string {
    return t2[key](vars)
}

