module.exports = {

  basicSourceUpdateItem : {
    'test' : {
      'vars' : [],
      'files' : []
    }
  },

  basicTranslationItem : {
    'test' : {
      'vars' : [],
      'translations' : '',
      'query_translation' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  oldBasicTranslationItem : {
    'test' : {
      'vars' : [],
      'translations' : 'test',
      'query_translation' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  basicTranslation : {
    'en-US' : {
      'test' : {
        'vars' : [],
        'translations' : '',
        'query_translation' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'a73dec3930758129dce45293f0cc5083',
        'files' : ['test.js']
      }
    }
  },

  oldBasicTranslation : {
    'en-US' : {
      'test' : {
        'vars' : [],
        'translations' : 'test',
        'query_translation' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'a73dec3930758129dce45293f0cc5083'
      }
    }
  },

  deletedBasicTranslation : {
    'en-US' : {
      'test1' : {
        'vars' : [],
        'translations' : 'test',
        'query_translation' : 'It can have',
        'timestamp': 1361261618370,
        'id': 'a73dec3930758129dce45293f0cc5083',
        'files' : ['test.js']
      }
    }
  },

  ifElseConditions : {
    'test' : {
      'vars' : [],
      'translations' : [
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
      'query_translation' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  ifElseifElseConditions : {
    'test' : {
      'vars' : [],
      'translations' : [
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
      'query_translation' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  additionalConditionAnd : {
    'test' : {
      'vars' : [],
      'translations' : [
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
      'query_translation' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  additionConditionOr : {
    'test' : {
      'vars' : [],
      'translations' : [
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
      'query_translation' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  },

  multipleAdditionConditions : {
    'test' : {
      'vars' : [],
      'translations' : [
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
      'query_translation' : 'It can have',
      'timestamp': 1361261618370,
      'id': 'a73dec3930758129dce45293f0cc5083'
    }
  }

};
