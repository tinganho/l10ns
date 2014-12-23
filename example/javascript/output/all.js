;(function() {
  var timezones = {"Europe/Stockholm":{"types":["d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","d"],"untils":[323830799000,323830800000,338950799000,338950800000,354675599000,354675600000,370400399000,370400400000,386125199000,386125200000,401849999000,401850000000,417574799000,417574800000,433299599000,433299600000,449024399000,449024400000,465353999000,465354000000,481078799000,481078800000,496803599000,496803600000,512528399000,512528400000,528253199000,528253200000,543977999000,543978000000,559702799000,559702800000,575427599000,575427600000,591152399000,591152400000,606877199000,606877200000,622601999000,622602000000,638326799000,638326800000,654656399000,654656400000,670381199000,670381200000,686105999000,686106000000,701830799000,701830800000,717555599000,717555600000,733280399000,733280400000,749005199000,749005200000,764729999000,764730000000,780454799000,780454800000,796179599000,796179600000,811904399000,811904400000,828233999000,828234000000,846377999000,846378000000,859683599000,859683600000,877827599000,877827600000,891133199000,891133200000,909277199000,909277200000,922582799000,922582800000,941331599000,941331600000,954032399000,954032400000,972781199000,972781200000,985481999000,985482000000,1004230799000,1004230800000,1017536399000,1017536400000,1035680399000,1035680400000,1048985999000,1048986000000,1067129999000,1067130000000,1080435599000,1080435600000,1099184399000,1099184400000,1111885199000,1111885200000,1130633999000,1130634000000,1143334799000,1143334800000,1162083599000,1162083600000,1174784399000,1174784400000,1193533199000,1193533200000,1206838799000,1206838800000,1224982799000,1224982800000,1238288399000,1238288400000,1256432399000,1256432400000,1269737999000,1269738000000,1288486799000,1288486800000,1301187599000,1301187600000,1319936399000,1319936400000,1332637199000,1332637200000,1351385999000,1351386000000,1364691599000,1364691600000,1382835599000,1382835600000,1396141199000,1396141200000,1414285199000,1414285200000,1427590799000,1427590800000,1445734799000,1445734800000,1459040399000,1459040400000,1477789199000,1477789200000,1490489999000,1490490000000,1509238799000,1509238800000,1521939599000,1521939600000,1540688399000,1540688400000,1553993999000,1553994000000,1572137999000,1572138000000,1585443599000,1585443600000,1603587599000,1603587600000,1616893199000,1616893200000,1635641999000,1635642000000,1648342799000,1648342800000,1667091599000,1667091600000,1679792399000,1679792400000,1698541199000,1698541200000,1711846799000,1711846800000,1729990799000,1729990800000,1743296399000,1743296400000,1761440399000,1761440400000,1774745999000,1774746000000,1792889999000,1792890000000,1806195599000,1806195600000,1824944399000,1824944400000,1837645199000,1837645200000,1856393999000,1856394000000,1869094799000,1869094800000,1887843599000,1887843600000,1901149199000,1901149200000,1919293199000,1919293200000,1932598799000,1932598800000,1950742799000,1950742800000,1964048399000,1964048400000,1982797199000,1982797200000,1995497999000,1995498000000,2014246799000,2014246800000,2026947599000,2026947600000,2045696399000,2045696400000,2058397199000,2058397200000,2077145999000,2077146000000,2090451599000,2090451600000,2108595599000,2108595600000,2121901199000,2121901200000,2140045199000,2140045200000,2147397247000,2147483647000],"offsets":[-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-120,-120,-60,-60,-60]},"America/Los_Angeles":{"types":["d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","s","s","d","d","d"],"untils":[9971999000,9972000000,25693199000,25693200000,41421599000,41421600000,57747599000,57747600000,73475999000,73476000000,89197199000,89197200000,104925599000,104925600000,120646799000,120646800000,126698399000,126698400000,152096399000,152096400000,162381599000,162381600000,183545999000,183546000000,199274399000,199274400000,215600399000,215600400000,230723999000,230724000000,247049999000,247050000000,262778399000,262778400000,278499599000,278499600000,294227999000,294228000000,309949199000,309949200000,325677599000,325677600000,341398799000,341398800000,357127199000,357127200000,372848399000,372848400000,388576799000,388576800000,404902799000,404902800000,420026399000,420026400000,436352399000,436352400000,452080799000,452080800000,467801999000,467802000000,483530399000,483530400000,499251599000,499251600000,514979999000,514980000000,530701199000,530701200000,544615199000,544615200000,562150799000,562150800000,576064799000,576064800000,594205199000,594205200000,607514399000,607514400000,625654799000,625654800000,638963999000,638964000000,657104399000,657104400000,671018399000,671018400000,688553999000,688554000000,702467999000,702468000000,720003599000,720003600000,733917599000,733917600000,752057999000,752058000000,765367199000,765367200000,783507599000,783507600000,796816799000,796816800000,814957199000,814957200000,828871199000,828871200000,846406799000,846406800000,860320799000,860320800000,877856399000,877856400000,891770399000,891770400000,909305999000,909306000000,923219999000,923220000000,941360399000,941360400000,954669599000,954669600000,972809999000,972810000000,986119199000,986119200000,1004259599000,1004259600000,1018173599000,1018173600000,1035709199000,1035709200000,1049623199000,1049623200000,1067158799000,1067158800000,1081072799000,1081072800000,1099213199000,1099213200000,1112522399000,1112522400000,1130662799000,1130662800000,1143971999000,1143972000000,1162112399000,1162112400000,1173607199000,1173607200000,1194166799000,1194166800000,1205056799000,1205056800000,1225616399000,1225616400000,1236506399000,1236506400000,1257065999000,1257066000000,1268560799000,1268560800000,1289120399000,1289120400000,1300010399000,1300010400000,1320569999000,1320570000000,1331459999000,1331460000000,1352019599000,1352019600000,1362909599000,1362909600000,1383469199000,1383469200000,1394359199000,1394359200000,1414918799000,1414918800000,1425808799000,1425808800000,1446368399000,1446368400000,1457863199000,1457863200000,1478422799000,1478422800000,1489312799000,1489312800000,1509872399000,1509872400000,1520762399000,1520762400000,1541321999000,1541322000000,1552211999000,1552212000000,1572771599000,1572771600000,1583661599000,1583661600000,1604221199000,1604221200000,1615715999000,1615716000000,1636275599000,1636275600000,1647165599000,1647165600000,1667725199000,1667725200000,1678615199000,1678615200000,1699174799000,1699174800000,1710064799000,1710064800000,1730624399000,1730624400000,1741514399000,1741514400000,1762073999000,1762074000000,1772963999000,1772964000000,1793523599000,1793523600000,1805018399000,1805018400000,1825577999000,1825578000000,1836467999000,1836468000000,1857027599000,1857027600000,1867917599000,1867917600000,1888477199000,1888477200000,1899367199000,1899367200000,1919926799000,1919926800000,1930816799000,1930816800000,1951376399000,1951376400000,1962871199000,1962871200000,1983430799000,1983430800000,1994320799000,1994320800000,2014880399000,2014880400000,2025770399000,2025770400000,2046329999000,2046330000000,2057219999000,2057220000000,2077779599000,2077779600000,2088669599000,2088669600000,2109229199000,2109229200000,2120119199000,2120119200000,2140678799000,2140678800000,2147397247000,2147483647000],"offsets":[480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,420,420,480,480,480]}};

  function roundTo(number, to) {
    return Math.round(number / to) * to;
  }

  function toSignficantDigits(number, minimumSignificantDigits, maximumSignificantDigits) {
    var multiple = Math.pow(10, maximumSignificantDigits - Math.floor(Math.log(number) / Math.LN10) - 1);
    number = Math.round(number * multiple) / multiple + '';
    var difference = maximumSignificantDigits - minimumSignificantDigits;
    if(difference > 0 && /\./.test(difference)) {
      number = number.replace(new RegExp('0{1,' + difference + '}$'), '');
    }
    var subtract = 0;
    if(/^0\./.test(number)) {
      subtract = 2;
    }
    else if(/\./.test(number)) {
      subtract = 1;
    }
    while(number.length - subtract < minimumSignificantDigits) {
      number += '0';
    }

    return number;
  }

  function toExponentDigits(number, it) {
    var minimumMantissaIntegerDigits = 1
      , maximumMantissaIntegerDigits = Infinity
      , exponentGrouping = 1
      , minimumMantissaSignificantDigits
      , maximumMantissaSignificantDigits
      , exponentNumber = 0;

    if(it.type === 'floating') {
      if(it.maximumIntegerDigits === it.minimumIntegerDigits) {
        minimumMantissaIntegerDigits = maximumMantissaIntegerDigits = it.minimumIntegerDigits;
      }
      else {
        maximumMantissaIntegerDigits = it.maximumIntegerDigits;
        exponentGrouping = it.maximumIntegerDigits;
      }

      minimumMantissaSignificantDigits = 1;
      maximumMantissaSignificantDigits = it.minimumIntegerDigits + it.maximumFractionDigits;
    }
    else {
      minimumMantissaIntegerDigits = maximumMantissaIntegerDigits = 1;
      minimumMantissaSignificantDigits = it.minimumSignificantDigits;
      maximumMantissaSignificantDigits = it.maximumSignificantDigits
    }

    if(number >= 1) {
      var divider = Math.pow(10, exponentGrouping)
        , integerLength = (number + '').replace(/\.\d+/, '').length;
      while((integerLength < minimumMantissaIntegerDigits || integerLength > maximumMantissaIntegerDigits) &&
            (exponentNumber + '').length === it.exponent.digits) {
        number = number / divider;
        exponentNumber += exponentGrouping;
        integerLength = (number + '').replace(/\.\d+/, '').length;
      }
      if((exponentNumber + '').length !== it.exponent.digits) {
        exponentNumber--;
        number = number * divider;
      }
    }
    else {
      var multiplier = Math.pow(10, exponentGrouping)
        , integerLength = (number + '').replace(/^0\.\d+/, '').replace(/\.\d+/, '').length;
      while((integerLength < minimumMantissaIntegerDigits || integerLength > maximumMantissaIntegerDigits) &&
            (Math.abs(exponentNumber) + '').length === it.exponent.digits) {
        number = number * multiplier;
        exponentNumber -= exponentGrouping;
        integerLength = (number + '').replace(/^0\.\d+/, '').replace(/\.\d+/, '').length;
      }
      if((Math.abs(exponentNumber) + '').length !== it.exponent.digits) {
        exponentNumber++;
        number = number / multiplier;
      }
    }

    var mantissa = toSignficantDigits(number, minimumMantissaSignificantDigits, maximumMantissaSignificantDigits)
      , mantissa = mantissa.split('.')
      , exponent = it.symbols.exponential;
    if(it.exponent.plusSign && exponentNumber > 0) {
      exponent += it.symbols.plusSign;
    }
    exponent += exponentNumber;

    if(it.type === 'floating') {
      if(it.minimumFractionDigits > 0) {
        if(typeof mantissa[1] === 'undefined') {
          mantissa[1] = '';
        }
        while(mantissa[1].length < it.minimumFractionDigits) {
          mantissa[1] += '0';
        }
      }
    }

    return {
      integer: mantissa[0],
      fraction: mantissa[1],
      exponent: exponent
    };
  };

  function formatNumber(it) {
    if(typeof it.number !== 'number') {
      return it.symbols.nan;
    }
    if(it.number === Infinity) {
      return it.symbols.plusSign + it.symbols.infinity;
    }
    if(it.number === -Infinity) {
      return it.symbols.minusSign + it.symbols.infinity;
    }

    var number = Math.abs(it.number)
      , prefix = it.prefix
      , suffix = it.suffix
      , currencySymbol =
        '([\\u0024\\u00A2-\\u00A5\\u058F\\u060B\\u09F2\\u09F3\\u09FB\\u0AF1\\\
           \\u0BF9\\u0E3F\\u17DB\\u20A0-\\u20BD\\uA838\\uFDFC\\uFE69\\uFF04\\\
           \\uFFE0\\uFFE1\\uFFE5\\uFFE6])'
      , startsWithCurrencySymbolSyntax = new RegExp('^' + currencySymbol)
      , endsWithCurrencySymbolSyntax = new RegExp(currencySymbol + '$');

    if(it.percentage) {
      prefix = prefix.replace('%', it.symbols.percentSign);
      suffix = suffix.replace('%', it.symbols.percentSign);
      number = number * 100;
    }
    else if(it.permille) {
      prefix = prefix.replace('‰', it.symbols.perMille);
      suffix = suffix.replace('‰', it.symbols.perMille);
      number = number * 1000;
    }

    if(it.exponent) {
      var exponent = toExponentDigits(number, it);
      integerDigits = exponent.integer;
      fractionDigits = exponent.fraction || '';
      exponent = exponent.exponent;
    }
    else if(it.type === 'significant') {
      number = toSignficantDigits(number, it.minimumSignificantDigits, it.maximumSignificantDigits);
    }
    else {
      number = roundTo(number, it.roundTo);
    }

    if(!it.exponent) {
      var numberSplit = (number + '').split('.')
        , integerDigits = numberSplit[0]
        , integerDigitsLength = integerDigits.length
        , fractionDigits = numberSplit[1] || ''
        , fractionDigitsLength = fractionDigits.length;

      if(it.type === 'floating' && integerDigitsLength < it.minimumIntegerDigits) {
        var missingIntegerDigits = it.minimumIntegerDigits - integerDigitsLength;
        for(var index = 0; index < missingIntegerDigits; index++) {
          integerDigits = '0' + integerDigits;
        }
        integerDigitsLength = it.minimumIntegerDigits;
      }
      if(it.groupSize) {
        var newIntegerDigits = '';
        for(var index = integerDigitsLength - 1; index >= 0; index--) {
          var primaryIndex = integerDigitsLength - it.groupSize.primary - 1;
          if(index === primaryIndex) {
            newIntegerDigits += it.symbols.group;
          }
          else if(index < primaryIndex && (primaryIndex - index) % it.groupSize.secondary === 0) {
            newIntegerDigits += it.symbols.group;
          }

          newIntegerDigits += integerDigits.charAt(index);
        }
        integerDigits = newIntegerDigits.split('').reverse().join('');
      }

      if(it.type === 'floating') {
        if(fractionDigitsLength > it.maximumFractionDigits) {
          fractionDigits = fractionDigits.substring(0, it.maximumFractionDigits);
        }
        else if(fractionDigitsLength < it.minimumFractionDigits) {
          var missingFractionDigits = it.minimumFractionDigits - fractionDigitsLength;
          for(var index = 0; index < missingFractionDigits; index++) {
            fractionDigits += '0';
          }
        }

        if(fractionDigits.length > it.minimumFractionDigits) {
          fractionDigits = fractionDigits.replace(/[0]+$/, '');
        }
      }
    }

    if(it.currency) {
      if(!endsWithCurrencySymbolSyntax.test(it.currency.symbol)) {
        prefix = prefix + ' ';
      }
      if(!startsWithCurrencySymbolSyntax.test(it.currency.symbol)) {
        suffix = ' ' + suffix;
      }
      prefix = prefix.replace(/¤+/, it.currency.symbol);
      suffix = suffix.replace(/¤+/, it.currency.symbol);
    }

    var result = '';
    result += prefix;
    result += integerDigits;
    if(fractionDigits.length > 0) {
      result += it.symbols.decimal + fractionDigits;
    }
    if(exponent) {
      result += exponent;
    }
    result += suffix;

    if(it.paddingCharacter) {
      var resultLength = result.length - 2;
      result = result.replace(new RegExp('\\*\\' + it.paddingCharacter), function(match) {
        var replacement = '';
        while(resultLength < it.patternLength) {
          replacement += it.paddingCharacter;
          resultLength++;
        }

        return replacement;
      });
    }

    return result;
  }

  var localizations = {
    'da-DK': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n === 1 || t !== 0 && i === 0 && i === 1) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': '.',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': '.'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'Amerikansk dollar',
          'text': {
            'local': null,
            'global': {
              'one': 'Amerikansk dollar',
              'other': 'Amerikanske dollar'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['da-DK'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['da-DK'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'de-DE': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(i === 1 && v === 0) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': '.',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '·',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'US-Dollar',
          'text': {
            'local': null,
            'global': {
              'one': 'US-Dollar',
              'other': 'US-Dollar'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['de-DE'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['de-DE'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'en-US': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(i === 1 && v === 0) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n % 10 === 1 && n % 100 !== 11) {
          return 'one';
        }
        else if(n % 10 === 2 && n % 100 !== 12) {
          return 'two';
        }
        else if(n % 10 === 3 && n % 100 !== 13) {
          return 'few';
        }
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'US Dollar',
          'text': {
            'local': {
              'one': 'dollar',
              'other': 'dollars'
            },
            'global': {
              'one': 'US dollar',
              'other': 'US dollars'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var date;
        var dateString = '';
        var year;
        var month;
        var date_;
        var hours;
        var minutes;
        var seconds;
        var milliseconds;
        var toTimezoneOffset;
        if(it.floor instanceof Date) {
          if(it.floor instanceof Date) {
            date = it.floor;
          }
          else if(it.floor.time instanceof Date){
            date = new Date(it.floor);
          }
          toTimeZoneOffset = date.getTimezoneOffset();
        }
        else {
          if(typeof it.floor.toTimezone === 'undefined') {
            throw new TypeError('You must define a \'toTimezone\' property for floor');
          }

          if(!(it.floor.toTimezone in timezones)) {
            throw new TypeError('Timezone \'' + it.floor.toTimezone + '\' is not defined. Please define it in your l10ns.json file.');
          }

          if(typeof it.floor.time === 'undefined') {
            throw new TypeError('You must define a time property for floor');
          }

          if(!(it.floor.time instanceof Date)) {
            throw new TypeError('Property time must be of type Date.');
          }

          date = new Date(it.floor.time.getTime());
          var currentMinutes = date.getMinutes();
          var currentTimezoneOffset = -(date.getTimezoneOffset());
          var timezoneInfo = timezones[it.floor.toTimezone];
          var unixTime = date.getTime();
          var index;
          if(unixTime > timezoneInfo.untils[timezoneInfo.untils.length - 1] || unixTime < timezoneInfo.untils[0]) {
            toTimezoneOffset = -1 * timezoneInfo.offsets.reduce(function (previous, current) {
              return (Math.abs(current - 0) < Math.abs(previous - 0) ? current : previous);
            });
          }
          else {
            for(var index = 0; index < timezoneInfo.untils.length; index++) {
              if(unixTime < timezoneInfo.untils[index]) {
                index = index - 1;
                break;
              }
            }
            toTimezoneOffset = -(timezoneInfo.offsets[index]);
          }
          date.setMinutes(currentMinutes + (toTimezoneOffset - currentTimezoneOffset));
        }
        var year = date.getFullYear() + '';
        var yearString = '';
        if(year.length >= 4) {
          yearString = year;
        }
        else {
          var difference = 4 - year.length;
          for(var i = 0; i < difference; i++) {
            yearString += '0';
          }
          yearString += year;
        }
        dateString += yearString;
        dateString += '-';
        var month = date.getMonth();
        var monthStrings = [
          '01',
          '02',
          '03',
          '04',
          '05',
          '06',
          '07',
          '08',
          '09',
          '10',
          '11',
          '12'
        ];
        dateString += monthStrings[month];
        dateString += '-';
        var dayOfMonthString = date.getDate() + '';
        if(dayOfMonthString.length === 1) {
          dayOfMonthString = '0' + dayOfMonthString;
        }
        dateString += dayOfMonthString;
        dateString += ' ';
        var hours = date.getHours();
        if(hours < 10) {
          hours = '0' + hours;
        }
        dateString += hours;
        dateString += ':';
        var minutes = date.getMinutes();
        if(minutes < 10) {
          minutes = '0' + minutes;
        }
        dateString += minutes;
        dateString += ':';
        var seconds = date.getSeconds();
        if(seconds < 10) {
          seconds = '0' + seconds;
        }
        dateString += seconds;

        string += dateString;
        return string;
      }
    },
    'es-ES': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n === 1) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': '.',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'dólar estadounidense',
          'text': {
            'local': null,
            'global': {
              'one': 'dólar estadounidense',
              'other': 'dólares estadounidenses'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['es-ES'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['es-ES'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'es-MX': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n === 1) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': '.',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'dólar estadounidense',
          'text': {
            'local': null,
            'global': {
              'one': 'dólar estadounidense',
              'other': 'dólares estadounidenses'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 1,
            prefix: '',
            suffix: 'k',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: null,
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 1,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['es-MX'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 2
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 1,
            prefix: '-',
            suffix: 'k',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: null,
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 1,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['es-MX'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 2
          });
        }
        string += numberString;
        return string;
      }
    },
    'fi-FI': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(i === 1 && v === 0) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': ' ',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '−',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'epäluku',
          'timeSeparator': '.'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'Yhdysvaltain dollari',
          'text': {
            'local': null,
            'global': {
              'one': 'Yhdysvaltain dollari',
              'other': 'Yhdysvaltain dollaria'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['fi-FI'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['fi-FI'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'fr-CA': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(i === 0 && i === 1) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n === 1) {
          return 'one';
        }
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': ' ',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {},
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 1,
            prefix: '',
            suffix: ' G',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: null,
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 1,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['fr-CA'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 3
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 1,
            prefix: '-',
            suffix: ' G',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: null,
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 1,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['fr-CA'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 3
          });
        }
        string += numberString;
        return string;
      }
    },
    'is-IS': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(t === 0 && i % 10 === 1 && i % 100 !== 11 || t !== 0) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': '.',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'Bandaríkjadalur',
          'text': {
            'local': null,
            'global': {
              'one': 'Bandaríkjadalur',
              'other': 'Bandaríkjadalir'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['is-IS'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['is-IS'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'ja-JP': {
      '__getPluralKeyword': function(cardinal) {
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': '米ドル',
          'text': {
            'local': null,
            'global': {
              'other': '米ドル'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['ja-JP'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['ja-JP'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'ko-KR': {
      '__getPluralKeyword': function(cardinal) {
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': '미국 달러',
          'text': {
            'local': null,
            'global': {
              'other': '미국 달러'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['ko-KR'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['ko-KR'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'sv-SE': {
      '__getPluralKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(i === 1 && v === 0) {
          return 'one';
        }
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        var cardinal = cardinal + ''
          , n = cardinal
          , i = parseInt(cardinal, 10)
          , v = 0
          , w = 0
          , f = 0
          , t = 0;

        var hasFractionalDigitsSyntax = /\.(\d+)/;

        if(hasFractionalDigitsSyntax.test(cardinal)) {
          f = hasFractionalDigitsSyntax.exec(cardinal)[1];
          v = f.length;
          t = cardinal.replace(/0+$/, '');
          t = hasFractionalDigitsSyntax.exec(t)[1];
          w = t.length;
        }
        if(n % 10 === 1 && n % 10 === 2 && n % 100 !== 11 && n % 100 !== 12) {
          return 'one';
        }
        return 'other';
      },
      '__numberSymbols': {
        'latn': {
          'decimal': ',',
          'group': ' ',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '−',
          'exponential': '×10^',
          'superscriptingExponent': '·',
          'perMille': '‰',
          'infinity': '∞',
          'nan': '¤¤¤',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': 'US-dollar',
          'text': {
            'local': null,
            'global': {
              'one': 'US-dollar',
              'other': 'US-dollar'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'one': '{0} {1}',
        'other': '{0} {1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['sv-SE'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['sv-SE'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'zh-CN': {
      '__getPluralKeyword': function(cardinal) {
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'hanidec': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        },
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': '美元',
          'text': {
            'local': null,
            'global': {
              'other': '美元'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'other': '{0}{1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['zh-CN'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['zh-CN'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    },
    'zh-HK': {
      '__getPluralKeyword': function(cardinal) {
        return 'other';
      },
      '__getOrdinalKeyword': function(cardinal) {
        return 'other';
      },
      '__numberSymbols': {
        'hanidec': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        },
        'latn': {
          'decimal': '.',
          'group': ',',
          'list': ';',
          'percentSign': '%',
          'plusSign': '+',
          'minusSign': '-',
          'exponential': 'E',
          'superscriptingExponent': '×',
          'perMille': '‰',
          'infinity': '∞',
          'nan': 'NaN',
          'timeSeparator': ':'
        }
      },
      '__currencies': {
        'USD': {
          'name': '美元',
          'text': {
            'local': null,
            'global': {
              'other': '美元'
            }
          },
          'symbol': {
            'local': '$',
            'global': 'US$',
            'reverseGlobal': '$US'
          }
        }
      },
      '__currencyUnitPattern': {
        'other': '{0}{1}'
      },
      'INDEX1': function(it) {
        var string = '';
        var numberString = '';
        if(it.floor >= 0) {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['zh-HK'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        else {
          numberString += formatNumber({
            number: it.floor,
            type: 'floating',
            roundTo: 0.001,
            prefix: '-',
            suffix: '',
            percentage: null,
            permille: null,
            currency: null,
            groupSize: {
              primary: 3,
              secondary: 3
            },
            exponent: null,
            minimumIntegerDigits: 1,
            maximumIntegerDigits: 4,
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            minimumSignificantDigits: 0,
            maximumSignificantDigits: 0,
            symbols: localizations['zh-HK'].__numberSymbols['latn'],
            paddingCharacter: null,
            patternLength: 9
          });
        }
        string += numberString;
        return string;
      }
    }
  };

  function requireLocalizations(locale) {
    return (function(locale) {
      return function l(key) {
        if(!(locale in localizations)) {
          return 'LOCALE_NOT_IN_LOCALIZATIONS: ' + locale;
        }
        if(!(key in localizations[locale])) {
          return 'KEY_NOT_IN_LOCALIZATIONS: ' + key;
        }
        return localizations[locale][key].call(undefined, arguments[1]);
      };
    })(locale);
  };

  if(typeof require === "function" && typeof exports === 'object' && typeof module === 'object') {
    module.exports = requireLocalizations;
  }
  else if (typeof define === "function" && define.amd) {
    define(function() {
      return requireLocalizations;
    });
  }
  else {
    window.requireLocalizations = requireLocalizations;
  }
})();
