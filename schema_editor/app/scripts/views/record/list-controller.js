(function () {
    'use strict';

    /* ngInject */
    function RecordListController($scope, $rootScope, $log, $modal, $state, uuid4, AuthService,
                                  Notifications, RecordSchemas, Records, ASEConfig) {
        var ctl = this;
        ctl.currentOffset = 0;
        ctl.numRecordsPerPage = ASEConfig.record.limit;
        ctl.maxDataColumns = 4; // Max number of dynamic data columns to show
        ctl.getPreviousRecords = getPreviousRecords;
        ctl.getNextRecords = getNextRecords;
        ctl.showDetailsModal = showDetailsModal;
        ctl.isInitialized = false;
        ctl.userCanWrite = false;

        init();

        function init() {
            ctl.isInitialized = false;
            ctl.userCanWrite = AuthService.hasWriteAccess();
            loadRecordSchema();
        }

        function loadRecordSchema() {
            /* jshint camelcase: false */
            var currentSchemaId = ctl.recordType.current_schema;
            /* jshint camelcase: true */

            return RecordSchemas.get({id: currentSchemaId})
                .then(function(recordSchema) {
                    ctl.recordSchema = recordSchema;
                    return;
                }).then(onSchemaLoaded);
        }

        /*
         * Loads a page of records from the API
         * @param {int} offset Optional offset value, relative to current offset, used
         *                     for pulling paginated results. May be positive or negative.
         * @return {promise} Promise to load records
         */
        function loadRecords(offset) {
            ctl.loadingRecords = true;
            var newOffset;
            if (offset) {
                newOffset = ctl.currentOffset + offset;
            } else {
                newOffset = 0;
            }

            var params = {
                offset: newOffset,
                limit: ASEConfig.record.limit
            }

            return Records.get(params).$promise
            .then(function(records) {
                ctl.records = records;
                ctl.currentOffset = newOffset;
            }).finally(function() {
                ctl.loadingRecords = false;
            });
        }

        function onSchemaLoaded() {
            var detailsDefinitions = _.filter(ctl.recordSchema.schema.definitions,
                function(val, key) {
                    if (key.indexOf('Details') > -1) {
                        // keep the actual field name
                        // for lookup on ctl.recordSchema.schema.definitions
                        ctl.detailsPropertyKey = key;
                        return val;
                    }
                });
            if (detailsDefinitions.length !== 1) {
                $log.error('Expected one details definition, found ' + detailsDefinitions.length);
                return;
            }

            // Get the property names -- sorted by propertyOrder
            ctl.headerKeys = _(detailsDefinitions[0].properties)
                .omit('_localId')
                .map(function(obj, propertyName) {
                    obj.propertyName = propertyName;
                    return obj;
                })
                .sortBy('propertyOrder')
                .map('propertyName')
                .value();
        }

        // Loads the previous page of paginated record results
        function getPreviousRecords() {
            loadRecords(-ctl.numRecordsPerPage);
        }

        // Loads the next page of paginated record results
        function getNextRecords() {
            loadRecords(ctl.numRecordsPerPage);
        }

        // Show a details modal for the given record
        function showDetailsModal(record) {
            $modal.open({
                templateUrl: 'scripts/views/record/details-modal-partial.html',
                controller: 'RecordDetailsModalController as modal',
                size: 'lg',
                resolve: {
                    record: function() {
                         return record;
                    },
                    recordType: function() {
                        return ctl.recordType;
                    },
                    recordSchema: function() {
                        return ctl.recordSchema;
                    },
                    userCanWrite: function() {
                        return ctl.userCanWrite;
                    }
                }
            });
        }
    }

    angular.module('ase.views.record')
    .controller('RecordListController', RecordListController);

})();
