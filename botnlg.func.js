'use strict';

//This is where we write some global functions
angular.module('botnlgApp')
.run(function ($rootScope) {
    var globalFuncSettings = {
    };

    var __domainIs = function (domain, tobedomain) {
        if(domain && domain.length > 0 && tobedomain && tobedomain.length > 0) {
            domain = domain.toLowerCase();
            tobedomain = tobedomain.toLowerCase();
            var result = domain.indexOf(tobedomain, domain.length - tobedomain.length) !== -1;
            return result;
        }

        return false;
    };
    
    $rootScope.domainIsLinkedIn = function (domain) {
        if(domain && domain.domain) {
            return __domainIs(domain.domain, 'linkedin.com');
        }
        
        return false;
    };

    $rootScope.domainIsGoogleCom = function (domain) {
        if(domain && domain.domain) {
            return __domainIs(domain.domain, 'google.com');
        }
        
        return false;
    };
});
