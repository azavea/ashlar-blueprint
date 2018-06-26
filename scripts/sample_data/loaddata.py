# load.py -- load sample data into an Ashlar Blueprint instance
import time
import json
import sys

import requests

# Ashlar server URL
BASE_URL = 'http://ashlar:8000/api/'

# Number of times to retry the connection to the Ashlar server (helpful if
# Docker instances spin up at different times)
NUM_RETRIES = 10


if __name__ == '__main__':

    print('Loading sample data...')

    # Load sample data files into memory.
    with open('records.json', 'r') as records_file:
        records = json.load(records_file)

    with open('recordtypes.json', 'r') as recordtypes_file:
        recordtypes = json.load(recordtypes_file)

    with open('schemas.json', 'r') as schemas_file:
        recordschemas = json.load(schemas_file)

    print(f'Checking the host at {BASE_URL}...')

    num_retries = NUM_RETRIES

    # Check if sample data already exists by looking for the first record
    # from the sample file.
    while num_retries >= 0:
        try:
            existing_recs = requests.get(BASE_URL + 'records/')
            print(f'Connected to the host at {BASE_URL}')
            break
        except requests.exceptions.ConnectionError as e:
            # Failed to establish a connection with the Ashlar host -- try
            # for 10 seconds, and then raise the error
            print(f'Host at {BASE_URL} is not available -- retrying ({num_retries} attempts remaining)')
            num_retries -= 1

            if num_retries == 0:
                raise(e)
            else:
                time.sleep(1)

    existing_recs.raise_for_status()
    if existing_recs.json()['count'] > 0 :
        print('Sample data already exists in the database -- skipping upload.')
        sys.exit(0)

    print('Uploading a sample RecordType...')

    # POST the record type
    rt_res = requests.post(BASE_URL + 'recordtypes/', json=recordtypes)
    rt_res.raise_for_status()
    rt_json = rt_res.json()

    # Retrieve the UUID for the new record type and assign it to the schema
    rt_uuid = rt_json['uuid']
    recordschemas['record_type'] = rt_uuid

    print('Uploaded RecordType', rt_uuid)
    print('Uploading a sample RecordSchema...')

    # POST the record schema
    schema_res = requests.post(BASE_URL + 'recordschemas/', json=recordschemas)
    schema_res.raise_for_status()
    schema_json = schema_res.json()

    # Retrieve the UUID for the new schema and assign it to the records
    schema_uuid = schema_json['uuid']
    for record in records:
        record['schema'] = schema_uuid

    print('Uploaded RecordSchema', schema_uuid)
    print('Uploading Records...')

    # POST the records
    for record in records:
        record_res = requests.post(BASE_URL + 'records/', json=record)
        record_res.raise_for_status()
        record_json = record_res.json()
        print('Uploaded Record', record_json['uuid'])

    print('Done!')
