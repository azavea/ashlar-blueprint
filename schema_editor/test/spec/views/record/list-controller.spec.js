'use strict';

describe('ase.views.record: ListController', function () {

    beforeEach(module('ase.mock.resources'));
    beforeEach(module('ase.views.record'));
    beforeEach(module('pascalprecht.translate'));

    var $controller;
    var $httpBackend;
    var $rootScope;
    var $scope;
    var Controller;
    var ResourcesMock;

    // Initialize the controller and a mock scope
    beforeEach(inject(function (_$controller_, _$httpBackend_, _$rootScope_, _ResourcesMock_) {
        $controller = _$controller_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        $scope = $rootScope.$new();
        ResourcesMock = _ResourcesMock_;

        var recordTypeUrl = /\/api\/recordtypes\/\?active=True/;

        var recordSchema = ResourcesMock.RecordSchema;
        var recordSchemaIdUrl = new RegExp('api/recordschemas/' + recordSchema.uuid);

        $httpBackend.expectGET(recordTypeUrl).respond(200, ResourcesMock.RecordTypeResponse);
        $httpBackend.expectGET(recordSchemaIdUrl).respond(200, recordSchema);

        Controller = $controller('RecordListController', {
            $scope: $scope,
            $rootScope: $rootScope
        });
        $scope.$apply();

        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('should have header keys', function () {

        var recordOffsetUrl = /api\/records\//;
        $httpBackend.expectGET(recordOffsetUrl).respond(200, ResourcesMock.RecordResponse);
        $httpBackend.flush();
        $httpBackend.verifyNoOutstandingRequest();

        expect(Controller.headerKeys.length).toBeGreaterThan(0);
    });

    it('should make offset requests for pagination', function () {

        var recordOffsetUrl = new RegExp('api/records/\\?.*limit=50.*');
        $httpBackend.expectGET(recordOffsetUrl).respond(200, ResourcesMock.RecordResponse);
        $httpBackend.flush();

        Controller.getNextRecords();
        recordOffsetUrl = recordOffsetUrl = new RegExp('api/records/\\?.*limit=50.*offset=50.*');
        $httpBackend.expectGET(recordOffsetUrl).respond(200, ResourcesMock.RecordResponse);
        $httpBackend.flush();

        Controller.getPreviousRecords();
        recordOffsetUrl = new RegExp('api/records/\\?.*limit=50.*');
        $httpBackend.expectGET(recordOffsetUrl).respond(200, ResourcesMock.RecordResponse);
        $httpBackend.flush();

        $httpBackend.verifyNoOutstandingRequest();
    });
});
