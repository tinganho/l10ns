module.exports = {

  basicSourceUpdateItem : {
    'test' : {
      'vars' : [],
      'files' : []
    }
  },

  basicTranslationItemString : '{ "key" : "test",\n"vars" : [],\n"value" : "It can have",\n"text" : "It can have",\n"timestamp": 1361261618370,"id": "MXejjjx6FyR" }\n\n',

  basicTranslationItem : {
    'test' : {
      'key' : 'test',
      'vars' : [],
      'value' : 'It can have',
      'text' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'MXejjjx6FyR'
    }
  },

  oldBasicTranslationItem : {
    'test' : {
      'vars' : [],
      'value' : 'test',
      'text' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  basicTranslation : {
    'en-US' : {
      'test' : {
        'vars' : [],
        'value' : '',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'a73dec3930758129dce45293f0cc5083',
        'files' : ['test.js']
      }
    }
  },

  oldBasicTranslation : {
    'en-US' : {
      'test' : {
        'key' : 'test',
        'vars' : [],
        'value' : 'test',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'a73dec3930758129dce45293f0cc5083',
        'files' : ['test.js']
      }
    }
  },

  deletedTranslations : {
    'test' : {
      'vars' : [],
      'value' : 'test',
      'text' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083',
      'files' : ['test.js']
    }
  },

  deletedBasicTranslation : {
    'en-US' : {
      'test1' : {
        'vars' : [],
        'value' : 'test',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'a73dec3930758129dce45293f0cc5083',
        'files' : ['test.js']
      }
    }
  },

  ifElseConditions : {
    'test' : {
      'vars' : ["test1"],
      'value' : [
        [
          "if",
          "test1",
          "===",
          "test1",
          "yes it can"
        ],
        [
          "else",
          "no it can not"
        ]
      ],
      'text' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  ifElseifElseConditions : {
    'test' : {
      'vars' : ["test1"],
      'value' : [
        [
          "if",
          "test1",
          "===",
          "test1",
          "yes it can"
        ],
        [
          "else if",
          "test1",
          "===",
          "test1",
          "no it can not"
        ],
        [
          "else",
          "no it can not"
        ]
      ],
      'text' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  additionalConditionAnd : {
    'test' : {
      'vars' : ["test1"],
      'value' : [
        [
          "if",
          "test1",
          "===",
          "test1",
          "&&",
          "test1",
          "===",
          "test1",
          "yes it can"
        ],
        [
          "else",
          "no it can not"
        ]
      ],
      'text' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  additionConditionOr : {
    'test' : {
      'vars' : ["test1"],
      'value' : [
        [
          "if",
          "test1",
          "===",
          "test1",
          "||",
          "test1",
          "===",
          "test1",
          "yes it can"
        ],
        [
          "else",
          "no it can not"
        ]
      ],
      'text' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  multipleAdditionConditions : {
    'test' : {
      'vars' : ["test1"],
      'value' : [
        [
          "if",
          "test1",
          "===",
          "test1",
          "||",
          "test1",
          "===",
          "test1",
          "&&",
          "test1",
          "===",
          "test1",
          "yes it can"
        ],
        [
          "else",
          "no it can not"
        ]
      ],
      'text' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  readTranslationJSON : {
    'en-US' : {
      'test' : {
        'key' : 'test',
        'vars' : ['test1', 'test2'],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      }
    },
    'zh-CN' : {
      'test' : {
        'key' : 'test',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      }
    }
  },

  readTranslationArray : {
    'en-US' : [
      {
        'key' : 'test',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      }
    ],
    'zh-CN' : [
      {
        'key' : 'test',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      }
    ]
  },
  readTranslationArray_long : {
    'en-US' : [
      {
        'key' : 'test1',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      },
      {
        'key' : 'test2',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      },
      {
        'key' : 'test3',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      },
      {
        'key' : 'test4',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      },
      {
        'key' : 'test5',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      },
      {
        'key' : 'test6',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      },
      {
        'key' : 'test7',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      },
      {
        'key' : 'test8',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      },
      {
        'key' : 'test9',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      },
      {
        'key' : 'test10',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      }

    ],
    'zh-CN' : [
      {
        'key' : 'test',
        'vars' : [],
        'value' : 'It can have',
        'text' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'MXejjjx6FyR'
      }
    ]
  }

};
