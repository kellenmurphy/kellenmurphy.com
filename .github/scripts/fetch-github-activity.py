#!/usr/bin/env python3
import json
import os
import sys
import urllib.request
import urllib.error
from datetime import datetime, timezone, timedelta

QUERY = """
query($login: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $login) {
    contributionsCollection(from: $from, to: $to) {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
            weekday
          }
        }
      }
    }
  }
}
"""

def main():
    token = os.environ.get('GH_ACTIVITY_TOKEN')
    if not token:
        print('GH_ACTIVITY_TOKEN not set', file=sys.stderr)
        sys.exit(1)

    now = datetime.now(timezone.utc)
    year_ago = now - timedelta(days=365)

    payload = json.dumps({
        'query': QUERY,
        'variables': {
            'login': 'kellenmurphy',
            'from': year_ago.strftime('%Y-%m-%dT00:00:00Z'),
            'to': now.strftime('%Y-%m-%dT23:59:59Z'),
        }
    }).encode()

    req = urllib.request.Request(
        'https://api.github.com/graphql',
        data=payload,
        headers={
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json',
            'User-Agent': 'kellenmurphy-site/1.0',
        }
    )

    try:
        with urllib.request.urlopen(req) as resp:
            body = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f'HTTP {e.code}: {e.read().decode()}', file=sys.stderr)
        sys.exit(1)

    if 'errors' in body:
        print(json.dumps(body['errors'], indent=2), file=sys.stderr)
        sys.exit(1)

    calendar = body['data']['user']['contributionsCollection']['contributionCalendar']
    output = {
        'generated_at': now.strftime('%Y-%m-%dT%H:%M:%SZ'),
        'total_contributions': calendar['totalContributions'],
        'weeks': calendar['weeks'],
    }

    os.makedirs('assets/data', exist_ok=True)
    with open('assets/data/github-activity.json', 'w') as f:
        json.dump(output, f)

    print(f"Fetched {calendar['totalContributions']} contributions")

if __name__ == '__main__':
    main()
