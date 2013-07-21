define([

  'jquery'

],function(

  $

) {

  var SelectMenu = function() {
    this.currentValue;
    this.values;

    // Selectors
    this.sel = {
      menuItemEl : '.js-select-menu-items'
    };

    // Elements
    this.selectMenuEl;
    this.selectMenuItemsEl;
  };

  SelectMenu.prototype.show = function() {
    this.selectMenuEl
      .addClass('active');
  };

  SelectMenu.prototype.hide = function() {
    this.selectMenuEl
      .removeClass('active');
  };

  SelectMenu.prototype.select = function(cb) {
    SelectMenu.prototype.hide();
    this.currentValue = $(this).attr('data-value');
    if(typeof cb === 'function') {
      cb();
    }
  };

  SelectMenu.prototype.setSelectMenuEl = function(el) {
    this.selectMenuEl      = $(el);
    this.selectMenuItemsEl = this.selectMenuEl.find(this.sel.menuItemEl);
  };

  SelectMenu.prototype.renderCurrentValue = function() {
    this.selectMenuEl.html(this.currentValue);
  };

  return SelectMenu;

});
