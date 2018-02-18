from datetime import datetime, date
from dateutil.relativedelta import relativedelta
from collections import namedtuple

date_int_pair = namedtuple('date_int_pair', ['start', 'stop'])

def determine_dates(start=None, stop=None, year_length=None):
    # set defaults if not found

    if not start and not stop: # no dates found
        return default_date_pair()

    if not stop:
        return date_int_pair(start=start, stop=stop_date_by_year_length(start,years=year_length))

    if not start:
        one_year_prior = date_prior(stop=stop)
        return date_int_pair(start=one_year_prior, stop=stop)

    if start >= stop:  # bad date pairs
        return default_date_pair()



    # check if start is before 2014, or stop is after today
    start, stop = set_max_min_dates(start, stop)

    return date_int_pair(start=start, stop=stop)

def stop_date_by_year_length(start=None, years=1):
    one_year = datetime.fromtimestamp(start) + relativedelta(years=years)
    return min(one_year, datetime.now())

# defaults to one year before today
def date_prior(stop=datetime.now(), years=1):
    if isinstance(stop, int):
        temp_stop = datetime.fromtimestamp(stop)
    else:
        temp_stop = stop
    new_time = temp_stop - relativedelta(years=years)
    return int(new_time.timestamp())

# start = one year ago, stop = today
def default_date_pair(years=1):
    return date_int_pair(start=date_prior(years=years), stop=int(datetime.now().timestamp()))

def set_max_min_dates(start, stop):

    return int(max(datetime(2014,1,1).timestamp(), start)), int(min(datetime.now().timestamp(), stop))

if __name__ == '__main__':
    print(determine_dates(start=1233243, stop=12123352245))
