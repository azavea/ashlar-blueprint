import time
import inspect

from django.db.utils import OperationalError
from django.core.management.base import BaseCommand, CommandError


class WaitForDBCommand(BaseCommand):
    help = ('Abstract class for management commands that wait for a database ' +
            'to be ready before performing work.')

    def add_arguments(self, parser):
        parser.add_argument('--retry',
                            dest='retry',
                            default=10,
                            type=int,
                            help='Number of times to retry the connection')

    def do_work(self):
        '''
        The method for running the work that requires a database connection.
        Must be implemented on all inheriting classes.
        '''
        # Get the name of this method -- h/t:
        # https://stackoverflow.com/q/245304/7781189
        fname = inspect.stack()[1][3]

        msg = ('The %s class requires a %s method to be implemented, ' %
               (self.__class__.__name__, fname))
        msg += ('which defines the work that requires a database. Implement ' +
                'a "%s" method on this class and try again.' % fname)

        raise NotImplementedError(msg)

    def handle(self, *args, **options):
        num_tries = options['retry']

        self.stdout.write('Attempting to connect to the database...')
        while num_tries > 0:
            try:
                self.do_work()
                break
            except OperationalError:
                self.stdout.write('Database not available -- retrying ' +
                                  '(%d attempts remaining)' % num_tries)
                time.sleep(2)
            finally:
                num_tries -= 1
