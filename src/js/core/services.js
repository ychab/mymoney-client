(function () {
  'use strict';

  angular
    .module('mymoney.core')
    .factory('Page', Page);

  function Page() {
    var title = 'MyMoney';
    var messages = null;
    var breadcrumb = null;
    var actions = null;

    return {
      title: title,
      messages: messages,
      breacrumb: breadcrumb,
      actions: actions
    };
  }
})();
