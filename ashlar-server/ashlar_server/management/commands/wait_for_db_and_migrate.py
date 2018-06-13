import time

from django.db.utils import OperationalError
from django.core.management import call_command
from django.core.management.base import BaseCommand, CommandError


class Command(BaseCommand):
    help = 'Waits for the database to spin up and then runs migrations.'

    def add_arguments(self, parser):
        parser.add_argument('--retry',
                            dest='retry',
                            default=10,
                            type=int,
                            help='Number of times to retry the connection')

    def handle(self, *args, **options):
        # Number of times to poll the database before exiting.
        num_tries = options['retry']

        self.stdout.write('Attempting to connect to the database...')
        while num_tries > 0:
            try:
                call_command('migrate')
                self.stdout.write('Migration successful!')
                break
            except OperationalError:
                self.stdout.write('Database not available -- retrying ' +
                                  '(%d attempts remaining)' % num_tries)
                time.sleep(2)
            finally:
                num_tries -= 1
