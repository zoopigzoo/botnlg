'use strict';

//this is where writing custom tags to shorten the template
angular.module('botnlgApp')
.directive('timeofday', [function () {
    return {
        restrict: "E",
        scope: {
            data: '='
        },
        replace: false,
        link: function (scope, element, attr) {
            try {
                var timeText = '';
                var hour = scope.data.hour;

                if(hour < 5) {
                    timeText = '凌晨';
                } else if(hour < 11) {
                    timeText = '早上';
                } else if(hour < 13) {
                    timeText = '中午';
                } else if(hour < 18) {
                    timeText = '下午';
                } else {
                    timeText = '晚上';
                }

                var html = timeText;
                element.html(html);
            } catch (err) {
                return '';
            }
        }
    }
}]);