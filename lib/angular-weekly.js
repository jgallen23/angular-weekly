(function() {
  angular.module('weekly', [])
    .directive('weekly', ['$parse', function($parse) {
      return {
        restrict: 'EA',
        require: 'ngModel',
        scope: {
          model: '=ngModel',
          selectableDates: '=weeklySelectableDates',
          options: '&weekly',
          weekChangeEventFn: '&weeklyChange',
          addEventFn: '&weeklyAdd',
          removeEventFn: '&weeklyRemove',
          clickEventFn: '&weeklyClick',
          timezone: '=weeklyTimezone',
          readOnly: '=weeklyReadOnly'
        },
        link: function(scope, el, args) {
          var isUpdating = false;
          var options = scope.options() || {};
          var fnName = 'weekly';
          if (typeof args.weeklyMobile !== 'undefined') {
            fnName = 'weeklyMobile';
            options.daysToDisplay = 1;
          }
          el
            .addClass('weekly')
            .on('weekChange', function(e, data) {
              scope.weekChangeEventFn({ data: data });
            })
            .on('addEvent', function(e, evnt) {
              if (!isUpdating) {
                scope.$apply(function() {
                  scope.model.push(evnt);
                  scope.addEventFn({ event: evnt });
                });
              }
            })
            .on('removeEvent', function(e, evnt) {
              if (!isUpdating) {
                var index = evnt._index;
                scope.$apply(function() {
                  scope.model.splice(index, 1);
                  scope.removeEventFn({ event: evnt });
                });
              }
            })
            .on('eventClick', function(e, evnt, el) {
              scope.$apply(function() {
                scope.clickEventFn({ event: scope.model[evnt._index], el: el });
              });
            })
            [fnName](options);

          if (args.ngModel) {
            scope.$watch('model', function(val) {
              isUpdating = true;
              el
                [fnName]('clearEvents')
                [fnName]('addEvent', val);
              isUpdating = false;
            }, true);
          }

          if (args.weeklyTimezone) {
            scope.$watch('timezone', function(val) {
              if (val !== null) {
                el[fnName]('setTimezoneOffset', val);
              }
            });
          }

          if (args.weeklyReadOnly) {
            scope.$watch('readOnly', function(val) {
              if (typeof val !== 'undefined') {
                el[fnName]('setReadOnly', val);
              }
            });
          }

          if (args.weeklySelectableDates) {
            scope.$watch('selectableDates', function(val) {
              el[fnName]('setSelectableDates', val);
            });
          }
        }
      };
  }]);
})();
