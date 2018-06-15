# Setup

Documenting the steps it took to set up a working Ashlar reference
implementation. This doc will serve as loose notes toward a few ends:

1. Help set up the dev environment properly
2. Document the steps needed to get a project going on top of Ashlar
3. Based on the lessons learned in 2., reduce the amount of setup necessary for
   an Ashlar project

## Setting up an Ashlar container

- `pip install pip==9.0.1`
- `pip install --process-dependency-links -e git+https://github.com/jeancochrane/ashlar.git@update-dependencies#egg=ashlar`
- `pip install docker-compose >=1.10.0` (the first release to use v3 syntax)
- Initialize a Django app
- Update the settings file:
    - Define `ASHLAR` global var, set `SRID = 4326`
    - Set `DEVELOP = True`
    - SET `CORS_ORIGIN_REGEX_WHITELIST = (r'^http://127.0.0.1:\d+',
,)`
    - In `INSTALLED_APPS`, add:

```
    'rest_framework',
    'rest_framework.authtoken',
    'django_extensions',
    'ashlar',
    'corsheaders'
```
    
- Set `urlpatterns = ashlar.urls.urlpatterns` in `urls.py`
- Set up a database with PostGIS
- Run database migrations
- Run the server
