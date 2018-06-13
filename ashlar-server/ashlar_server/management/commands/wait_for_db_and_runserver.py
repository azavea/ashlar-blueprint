from django.core.management import call_command

from _wait_for_db import WaitForDBCommand


class Command(WaitForDBCommand):
    help = 'Waits for the database to spin up and then runs migrations.'

    def do_work(self):
        '''
        Run database migrations for this app.
        '''
        call_command('runserver', '0.0.0.0:8000')
