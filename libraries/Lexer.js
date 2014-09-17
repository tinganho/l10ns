
var EOF = -1;
/**
 * Lexer class
 *
 * @class
 */

function Lexer(string) {
  this.string = string;
  this.currentIndex = 0;
  this.currentToken = '';
};

/**
 * Get token
 *
 * @return {String}
 * @api public
 */

Lexer.prototype.getNextToken = function() {
  this.currentIndex++;
  if(this.currentIndex > this.string.length) {
    return EOF;
  }
  else {
    return this.string[this.currentIndex - 1]
  }
};

/**
 * Peak at next token
 *
 * @return {String}
 * @api public
 */

Lexer.prototype.nextToken = function() {
  if((this.currentIndex) >= this.string.length) {
    return EOF;
  }
  else {
    return this.string[this.currentIndex];
  }
};

/**
 * Get latest tokens log. Show users where the error have occurred by
 * outputting the latest tokens log.
 *
 * @return {String}
 * @api public
 */

Lexer.prototype.getLatestTokensLog = function(length) {
  length = length || program.LATEST_TOKENS_LOG_LENGTH;
  if(this.currentIndex >= length) {
    return this.string.substring(this.currentIndex - length, this.currentIndex);
  }
  else {
    return this.string.substring(0, this.currentIndex);
  }
};

module.exports = Lexer;
