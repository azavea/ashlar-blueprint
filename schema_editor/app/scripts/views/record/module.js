(function () {
    'use strict';

    /* ngInject */
    function StateConfig($stateProvider) {
        $stateProvider.state('record', {
            abstract: true,
            url: '',
            template: '<ui-view></ui-view>'
        });
        $stateProvider.state('record.add', {
            url: '/add',
            template: '<record-add-edit></record-add-edit>',
            label: 'NAV.ADD_A_RECORD',
            showInNavbar: false
        });
        $stateProvider.state('record.addSecondary', {
            url: '/addsecondary',
            template: '<record-add-edit></record-add-edit>',
            label: 'NAV.ADD_A_RECORD',
            showInNavbar: false,
            secondary: true
        });
        $stateProvider.state('record.list', {
            url: '/list',
            template: '<record-list></record-list>',
            label: 'NAV.RECORD_LIST',
            showInNavbar: true
        });
        $stateProvider.state('record.edit', {
            url: '/record/:recorduuid/edit',
            template: '<record-add-edit></record-add-edit>',
            label: 'NAV.EDIT_A_RECORD',
            showInNavbar: false
        });
        $stateProvider.state('record.details', {
            url: '/record/:recorduuid/details',
            template: '<record-details></record-details>',
            label: 'NAV.RECORD_DETAILS',
            showInNavbar: false
        });
    }

    angular.module('ase.views.record', [
        'ngSanitize',
        'ase.auth',
        'ase.notifications',
        'ase.resources',
        'ase.schemas',
        'ase.map-layers',
        'datetimepicker',
        'Leaflet',
        'json-editor',
        'ui.bootstrap',
        'ui.router',
        'angular-uuid'
    ]).config(StateConfig);

})();
