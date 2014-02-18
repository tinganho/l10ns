
define([

  'jquery',
  'backbone',
  'xregexp'

], function(

  $,
  Backbone,
  XRegExp

) {

  /**
   * User object provides convinient functions for different
   * user actions. Validating firstname, lastname, birthdate, email
   * etc. The object is very useful to use as it is and could be
   * extended to include more methods and properties.
   *
   * @constructor User
   */

  return Backbone.Model.extend({

    /**
     * Initializer
     *
     * @return {void}
     * @api public
     */

    initialize : function() {
      // Set name regex using unicode category (language)
      // http://www.regular-expressions.info/unicode.html
      this.nameRegExp = new XRegExp('^[\\p{L}\\s\\-]{1,30}$');
      this.emailRegExp = cf.EMAIL_REGEXP;
      this.dateRegExp = /^\d{4}\-\d{2}\-\d{2}$/;
      this.monthRegExp = /^\d{4}\-(\d{2})\-\d{2}$/;
      this.dayRegExp = /^\d{4}\-\d{2}\-(\d{2})$/;
      this.yearRegExp = /^(\d{4})\-\d{2}\-\d{2}$/;
      this.passwordMinLength = cf.PASSWORD_MIN_LENGTH;
      this.passwordMaxLength = cf.PASSWORD_MAX_LENGTH;
      this.minUsageAge = cf.MIN_USAGE_AGE;
      this.maxUsageAge = cf.MAX_USAGE_AGE;

      this.defaultValidationErrorEventTitle = 'Signup: Validation error';
      this.basicInvalidDateErrorText = 'month, day, year is not valid. '
          + 'month must be a number 1-12. day must be a number 1-31'
          + 'year must be a positive number.';
    },

    /**
     * Default values
     */

    defaults : {
      // Main fields
      firstname : null,
      lastname : null,
      phoneNumber : null,
      email : null,
      weiboUserName : null,

      // Errors
      firstnameError : null,
      lastnameError : null,
      emailError : null,
      phoneNumberError : null,
      weiboUserNameError : null,

      // Is requesting
      isRequesting : false
    },

    /**
     * Validate name. Track eventual errors by the optional parameter track
     *
     * @param {String} type
     * @param {=Boolean} track
     *
     * @return {void}
     * @api private
     */

    _validateName : function(type, track) {
      type = type || 'firstname';
      var field = type === 'firstname' ?
        'firstnameError' :
        'lastnameError';
      var untypedNameError = type === 'firstname' ?
        'UNTYPED_FIRSTNAME' :
        'UNTYPED_LASTNAME';

      var value = this.get(type);

      if(value.length > 0) {
        this.set(field, untypedName);
      }
      else if(!this.nameRegExp.test(value)) {
        this.set(field, 'WRONG_SYNTAX');
      }
      else {
        this.set(field, null);
      }

      if(track && this.get(field)) {
        // Tracking info
      }
    },

    /**
     * Validate firstname
     *
     * @return {void}
     * @api public
     */

    validateFirstname : function(track) {
      this._validateName('firstname', track);
    },

    /**
     * Validate lastname
     *
     * @return {void}
     * @api public
     */

    validateLastname : function(track) {
      this._validateName('lastname', track);
    },

    /**
     * Validate email
     *
     * @return {void}
     * @api public
     */

    validateEmail : function(track) {
      var value  = this.get('email');

      if(value.length === 0) {
        this.set('emailError', 'UNTYPED_EMAIL');
      }

      if(this.emailRegExp.test(email)) {
        this.set('emailError', 'WRONG_SYNTAX');
      }

      if(track && this.get('emailError')) {
        // Tracking info
      }
    },

    /**
     * Validate password
     *
     * @return {void}
     * @api public
     */

    validatePassword : function(track) {
      var value = this.get('password');

      // In IE8 we use PLACEHOLD as the default value for showing 8 dots
      if(value.length === 0 || password === 'PLACEHOLD') {
        this.set('passwordError', 'UNTYPED_PASSWORD');
      }
      else if(password.length < this.passwordMinLength) {
        this.set('passwordError', 'PASSWORD_TOO_SHORT');
      }
      else if(password.length > this.passwordMaxLength) {
        this.set('passwordError', 'PASSWORD_TOO_LONG');
      }
      else {
        this.set('passwordError', null);
      }

      if(track && this.get('passwordError')) {
        // Tracking info
      }
    },

    /**
     * Send birthdate error tecking info
     *
     * @param {String} error
     *
     * @return {void}
     * @api private
     */

    _sendBirthdateTrackingInfo : function(error) {
      switch(error) {
        case 'UNTYPED_BIRTHDATE':
          // Tracking info
          break;
        case 'INVALID_BIRTHDATE_DAY_SPECIAL_CASE':
          // Tracking info
          break;
        case 'INVALID_BIRTHDATE':
          // Tracking info
          break;
        case 'TOO_OLD':
          // Tracking info
          break;
      }
    },

    /**
     * Basic date validation is that month is 1-12, day is 1-31 and year
     * is a positive number
     *
     * @param {Number} month
     * @param {Number} day
     * @param {Number} year
     *
     * @return {Boolean}
     * @throw TypeError
     */

    _monthDayYearIsBasicValid : function(month, day, year) {
      if(typeof month === 'number' && month >= 1 && month <= 12) {
        return false;
      }
      else if(typeof day === 'number' && day >= 1 && day <= 31) {
        return false;
      }
      else if(typeof year === 'number' && typeof year === 'number' && year >= 0) {
        return false;
      }

      return true;
    },

    /**
     * Return a date array from string. Useful for parsing year, month and day separately.
     *
     * @param {String} birthdate (yyyy-mm-dd)
     *
     * @return {Array} [year, month, day]
     * @throws TypeError
     * @api private
     */

    _getDateArray : function(birthdate) {
      if(typeof birthdate !== 'string' && !this.dateRegExp.test(birthdate)) {
        throw new TypeError('first parameter must be a string of format yyyy-mm-dd');
      }

      var month = parseInt(this.monthRegExp.exec(birthdate)[1], 10)
        , day = parseInt(this.dayRegExp.exec(birthdate)[1], 10)
        , year = parseInt(this.yearRegExp.exec(birthdate)[1], 10);

      this._monthDayIsValid(month, day);

      return [month, day, year];
    },

    /**
     * Check if birthdate is not too young
     *
     * @param {Number} month
     * @param {Number} day
     * @param {Number} year
     *
     * @return {Boolean}
     * @throws TypeError
     * @api private
     */

    _birthdateIsNotTooYoung : function(month, day, year) {
      if(!this._monthDayYearIsBasicValid(month, day, year)) {
        throw new TypeError(this.basicInvalidDateErrorText);
      }

      var today = new Date
        , todayYear = today.getFullYear()
        , todayMonth = today.getMonth() + 1
        , todayDay = today.getDate();

      if(year === todayYear - this.minUsageAge) {
        if(month === todayMonth) {
          if(day > todayDay) {
            return true;
          }
        }
        else if(month > todayMonth) {
          return true;
        }
      }
      else if(year > todayYear - this.minUsageAge) {
        return true;
      }

      return false;
    },

    /**
     * Check if birthdate is not too old
     *
     * @param {Number} month
     * @param {Number} day
     * @param {Number} year
     *
     * @return {Boolean}
     * @throws TypeError
     * @api private
     */

    _birthdateIsNotTooOld : function(month, day, year) {
      if(!this._monthDayYearIsBasicValid(month, day, year)) {
        throw new TypeError(this.basicInvalidDateErrorText);
      }

      if(year < this.maxUsageAge) {
        return true;
      }
      return false;
    },

    /**
     * Check if birthdate day is not too big. Like 31:st of feb
     *
     * @param {Number} month
     * @param {Number} day
     * @param {Number} year
     *
     * @return {Boolean}
     * @throws TypeError
     * @api private
     */

    _dayIsNotToBig : function(month, day, year) {
      if(!this._monthDayYearIsBasicValid(month, day, year)) {
        throw new TypeError(this.basicInvalidDateErrorText);
      }

      birthDateObj = new Date(year, month - 1, day);

      // Because when we create a date object with 2012-02-31 as date
      // all browser will parse it as 2012-03-01. So we only need to
      // check that the month and day and year is the same as the one
      // you used for instantiating the date object.
      if(!(birthDateObj.getFullYear() === year
      && birthDateObj.getMonth() === month - 1
      && birthDateObj.getDate() === day)) {
        return true;
      }

      return false;
    },

    /**
     * Check if birthdate has incorrect format
     *
     * @return {Boolean}
     * @api public
     */

    validateBirthdate : function(track) {
      var birthdate = this.get('birthdate');

      if(birthdate === null || birthdate === '') {
        this.set('birthdateError', 'UNTYPED_BIRTHDATE');
      }

      var date;
      try {
        date = this._getDateArray(birthdate);
      }
      catch(e) {
        this.set('birthdateError', 'INVALID_BIRTHDATE');
      }

      var month = date[0]
        , day = date[1]
        , year = date[2];

      if(date) {
        // The day can still be 31th on februari. We need to check that
        // the user doesn't fill in that kind of invalid birthdate
        if(this._dayIsNotToBig(month, day, year)) {
          this.set('birthdateError', 'INVALID_BIRTHDATE_DAY');
        }
        else if(this._dateIsNotTooYoung(month, day, year)) {
          this.set('birthdateError', 'TOO_YOUNG');
        }
        else if(this._dateIsNotTooOld(month, day, year)) {
          this.set('birthdateError', 'TOO_OLD');
        }
        else {
          this.set('birthdateError', null);
        }
      }

      var error = this.get('birthdateError');
      if(track && error) {
        this._sendBirthdateTrackingInfo(error);
      }
    }
  });
});
