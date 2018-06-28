class App {

    // Initialize local variables.
    constructor(apiUrl) {
        this.apiUrl = apiUrl;  // URL for interacting with the Ashlar instance.
        this.map = {};  // The Leaflet map object for this app.
        this.activeLayer = {};  // Currently-selected marker layer.
        this.activeSchemaId = '';  // Currently-selected schema.
    }

    initialize() {
        //
        // Initialize the app.
        //
        // Make the map fullscreen.
        $(window).resize(() => {
            let windowHeight = $(window).outerHeight();
            let offsetTop = $('.navbar').height(); // Calculate the top offset

            let mapHeight = windowHeight - offsetTop;
            $('#map').css('height', mapHeight);
        }).resize();

        // Initialize a map.
        this.map = new L.map('map', {
            center: [39.95, -75.16],
            zoom: 12,
            dragging: true,
            touchZoom: true,
            tap: true,
            scrollWheelZoom: false
        });

        // Add tile layer from OSM.
        let tiles = new L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors',
            maxZoom: 18,
        }).addTo(this.map);

        // Initialize the filter form to intercept the submit event and use
        // custom querying logic.
        this.initializeFilterForm();

        // Initialize the Record Type filters, the only filters that are
        // common to all projects.
        this.initializeRecordTypes();
    }

    initializeFilterForm() {
        // Bind events to filter form.
        $('#filter-form').submit((e) => {
            // User is submitting new filters -- read the form data
            // and filter appropriately.
            e.preventDefault();

            this.submitForm();
        });
    }

    submitForm(readFilters = true) {
        // Submit the form data to query for Records. If `readFilters` is
        // falsey, the query will skip additional filters, just looking
        // at Record Type.

        let recordTypeId = $('#recordtype-options').val();
        let schemaId = $(`.recordtype-option[value="${recordTypeId}"]`).attr('data-schema');

        // Update filters for the selected RecordType.
        if (schemaId !== this.activeSchemaId) {
            this.activeSchemaId = schemaId;
            this.updateFilters(schemaId);
        }

        // If a layer is currently active, remove it from the map.
        if (Object.keys(this.activeLayer).length !== 0 && this.map.hasLayer(this.activeLayer)) {
            this.map.removeLayer(this.activeLayer);
        }

        // Generate query parameters and run the query.
        let queryParams = {
            record_type: recordTypeId
        };

        // If the user asked to read filters, retrieve them from the form
        // and add their data to the query.
        if (readFilters) {
            let filters = this.getJsonbFilters();
            queryParams.jsonb = JSON.stringify(filters);
        }

        this.queryRecords(queryParams);
    }

    getJsonbFilters() {
        // Read filters from the form and return them as an object
        // that we can use to query Ashlar.
        let filters = {};
        let formValues = $('#filter-form').serializeArray();

        formValues.forEach((field) => {
            // Form data gets encoded as an array of objects storing
            // the name and value of the field. Process that object
            // into a JSON object suitable for querying.
            let name = field.name,
                value = field.value;

            let filterableField = name !== 'record_type';

            if (value && filterableField) {
                // Field names are namespaced like so:
                //
                // 'schemaName#fieldName#queryRule`
                //
                // e.g.:
                //
                // 'incidentDetails#Select List#select'
                //
                // Parse this structure to format the query.
                let fieldParts = name.split('#');
                let schemaName = fieldParts[0],
                    fieldName = fieldParts[1],
                    queryRule = fieldParts[2];

                // If this is the first iteration in the loop, there
                // won't yet be a key for the schema in the filter object.
                if (!filters[schemaName]) {
                    filters[schemaName] = {};
                }

                // If this is a number query (or another type of field
                // that accepts multiple inputs, like a multiselect)
                // the nested query object may already exist, so check
                // for it before creating it.
                let nestedQuery = {};
                if (!filters[schemaName][fieldName]) {
                    filters[schemaName][fieldName] = {};
                } else {
                    nestedQuery = filters[schemaName][fieldName];
                }

                // Construct the actual query.
                switch(queryRule) {
                    case 'text':
                        nestedQuery = {
                            '_rule_type': 'containment',
                            'contains': [
                                value
                            ]
                        };
                        break;

                    case 'select':
                        // Select can have multiple attributes, so
                        // if that's the case, append to the containment
                        // array.
                        if (nestedQuery.contains) {
                            nestedQuery.contains.push(value);
                        } else {
                            nestedQuery._rule_type = 'containment';
                            nestedQuery.contains = [value];
                        }
                        break;

                    case 'min':
                        nestedQuery._rule_type = 'intrange';
                        nestedQuery.min = value;
                        break;

                    case 'max':
                        nestedQuery._rule_type = 'intrange';
                        nestedQuery.max = value;
                        break;
                }

                // Reassign the updated nested query to the proper field.
                filters[schemaName][fieldName] = nestedQuery;
            }
        });

        return filters;
    }

    updateFilters(schemaId) {
        // Load filters for a given schema based on its `schemaId`.

        // Always clear existing filters.
        $('#extra-filter-container').html('');

        // Retrieve the schema to figure out what fields need to be displayed
        $.getJSON(`${this.apiUrl}/recordschemas/${schemaId}`)
            .done((schema) => {
                // Given a schema object, return a map of fields that are
                // filterable.
                let definitions = {};
                if (schema.schema && schema.schema.definitions) {
                    definitions = schema.schema.definitions;
                }

                let isFilterable = (val) => { return val.isSearchable; };

                let schemaFilters = {};
                Object.keys(definitions).forEach((key) => {
                    let schema = definitions[key];
                    schemaFilters[schema.title] = {};

                    Object.keys(schema.properties).forEach((prop) => {
                        let property = schema.properties[prop];
                        if (isFilterable(property)) {
                            // merge in `multiple` to keep track of the type of containment
                            // (key + # + prop is necessary to namespace the filter ids)
                            schemaFilters[schema.title][key + '#' + prop] = Object.assign({}, property, {multiple: schema.multiple}); }
                    });
                });

                Object.keys(schemaFilters).forEach((schemaName) => {
                    // Create a new accordion to contain filters for this schema.
                    $('#extra-filter-container').append(`
                        <div class="col-xs-12" style="margin-top:5px;">
                            <h5>Filter by ${schemaName}</h5>
                            <hr />
                            <div class="accordion" name="${schemaName}"></div>
                        </div>
                    `);

                    let filterables = schemaFilters[schemaName];

                    Object.keys(filterables).forEach((filterName) => {
                        let filterable = filterables[filterName];

                        let widget = this.getFilterWidget(filterName, filterable);

                        $(`.accordion[name="${schemaName}"]`).append(widget);
                    });
                });

          }).fail((err) => {
                console.log(err);
          });
    }

    getFilterWidget(key, filterable) {
        // Given a `filterable` object and its name `key`,
        // return an HTML element for the filter widget.
        let num = filterable.propertyOrder;
        let label = key.split('#')[1];  // Extract the field name from the namespaced key
        let elem = `
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">
                        <button class="btn btn-link" type="button"
                                data-toggle="collapse"
                                data-target="#filter-dropdown-${num}">
                            ${label}
                        </button>
                    </h5>
                </div>
                <div id="filter-dropdown-${num}" class="collapse">
                    <div class="card-body">
        `;

        switch (filterable.fieldType) {
            case 'number':
                // Number types should produce range dropdowns.
                elem += `
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                    From
                                </div>
                            </div>
                            <input type="text" class="form-control"
                                name="${key}#min" placeholder="Minimum number" />
                        </div>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <div class="input-group-text">
                                    To
                                </div>
                            </div>
                            <input type="text" class="form-control"
                                name="${key}#max" placeholder="Maxium number" />
                        </div>
                `;
                break;

            case 'selectlist':
                // Select list types need to provide options for
                // selection.
                elem += `
                        <div class="form-group">
                            <select name="${key}#select" class="selectpicker form-control"
                                    multiple>
                `;

                for (let opt of filterable.enum) {
                    elem += `
                                <option value="${opt}">${opt}</option>
                    `;
                }

                elem += `
                            </select>
                        </div>
                `;
                break;

            case 'text':
                // Text fields require a search box for filtering.
                elem += `
                        <div class="form-inline my-2 my-lg-0">
                            <input class="form-control mr-sm-2" type="search"
                                placeholder="Search for keywords" aria-label="Search for keywords"
                                name="${key}#text" />
                        </div>
                `;
                break;

            default:
                // No other types need elements, so exit the function
                // altogether, returning undefined.
                return;
        }

        elem += `
                    </div>
                </div>
            </div>
        `;

        return elem;
    }

    queryRecords(queryParams = {}) {
        // Query records using the `queryParams` object,
        // updating the map once the query completes.
        let params = Object.assign({}, queryParams, {archived: false})

        $.getJSON(`${this.apiUrl}/records/`, params)
            .done((data) => {
                let records = data.results;
                let markers = [];
                if (records) {
                    for (let record of records) {
                        // Extract data for display as a marker
                        let coords = record.geom.coordinates;
                        let lat = coords[0],
                            lng = coords[1];

                        let details = JSON.stringify({
                            start: record.occurred_from,
                            end: record.occurred_to,
                            data: record.data,
                        }, null, 2);

                        let popup = `
                            <h3>Details</h3>
                            <hr/>
                            <pre>
                                <code>
                                    ${details}
                                </code>
                            </pre>
                        `;

                        // Store the marker in a layer so that we can
                        // remove it when filters change.
                        markers.push(new L.marker([lng, lat])
                                            .bindPopup(popup));
                    }
                    // Add the layer to the map and store it in the
                    // global state variables.
                    let layer = new L.layerGroup(markers);
                    this.map.addLayer(layer);
                    this.activeLayer = layer;
                } else {
                    console.log('No records found with query params:');
                    console.log(params);
                    alert('No records found -- see console for debug details');
                }
          }).fail((err) => {
                alert(err);
          });
    }

    initializeRecordTypes() {
    // Retrieve record types from the API to populate filters.
        $.getJSON(`${this.apiUrl}/recordtypes/`)
            .done((data) => {
                let recordtypes = data.results;

                // Create navbar filters for each record type
                for (let recordtype of recordtypes) {
                    // Add a filter for this RecordType to the navbar
                    let rtOpt= `
                        <option value="${recordtype.uuid}"
                                data-schema="${recordtype.current_schema}"
                                class="recordtype-option">
                            ${recordtype.plural_label}
                        </option>
                    `;
                    $('#recordtype-options').append(rtOpt);
                }

                // Reload all records and filters when the recordtype
                // changes.
                let readFilters = false;
                $('#recordtype-options').change((e) => { this.submitForm(readFilters) });

                // Once the RecordTypes have been populated and the map
                // is ready, select the first available RecordType for display.
                this.map.whenReady(() => {
                    $('#recordtype-options').val($('.recordtype-option').first().val());
                    $('#filter-form').submit();
                });
          }).fail((err) => {
                alert(err);
          });
    }
}
