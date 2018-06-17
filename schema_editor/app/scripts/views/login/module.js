(function () {
'use strict';

    /**
     * @ngInject
     */
    function StateConfig($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'scripts/views/login/login-partial.html',
            controller: 'AuthController',
            resolve: {
                SSOClients: function($log, $http, $q, ASEConfig) {
                    var dfd = $q.defer();
                    $http.get(ASEConfig.api.hostname + '/openid/clientlist/', { cache: true })
                        .success(function(data) {
                            if (data && data.clients) {
                                dfd.resolve(data.clients);
                            } else {
                                $log.error('unexpected result for sso client list:');
                                $log.error(data);
                                dfd.resolve({});
                            }
                        })
                        .error(function(data, status) {
                            $log.error('Failed to fetch SSO client list:');
                            $log.error(status);
                            $log.error(data);
                            dfd.resolve({});
                        });
                    return dfd.promise;
                }
            }
        });
    }

    /**
     * @ngdoc overview
     * @name driver.views
     * @description
     * # driver
     */
    angular
      .module('ase.views.login', [
        'ui.router',
        'ase.auth'
      ]).config(StateConfig);

})();
