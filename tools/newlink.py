#!/usr/bin/env python3
"""
Create a tracked share link for the portfolio.

Cloudflare Web Analytics does not record query strings, so each tagged link
is a real path (/r/<tag>/) that registers as its own row in Top Pages and
then forwards to the portfolio.

    python3 tools/newlink.py nvidia-recruiter
    python3 tools/newlink.py asu-career-fair --note "Spring 2026 fair"
    python3 tools/newlink.py --list

Commit and push afterwards for the link to go live.
"""

import argparse
import datetime
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RDIR = os.path.join(ROOT, 'r')
INDEX = os.path.join(RDIR, 'links.json')
BASE = 'https://vignesh-kumar-v.github.io'

PAGE = """<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vigneshkumar Venugopal</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="{base}/">
<style>
  html,body{{height:100%;margin:0;background:#0b0a09;color:#7d7367;
    font:500 13px/1 ui-monospace,SFMono-Regular,Menlo,monospace;
    display:grid;place-items:center;letter-spacing:.14em;text-transform:uppercase}}
  @media (prefers-color-scheme:light){{html,body{{background:#fdfbf7;color:#8a8073}}}}
  .d{{width:6px;height:6px;border-radius:50%;background:#f5a524;display:inline-block;
    margin-right:9px;animation:p 1s ease-in-out infinite}}
  @keyframes p{{50%{{opacity:.25}}}}
</style>
</head>
<body>
<p><span class="d"></span>Loading portfolio</p>
<script src="/assets/js/analytics.js"></script>
<script>
  // give the beacon a moment to fire, then hand off to the real page
  setTimeout(function () {{ location.replace('/'); }}, 700);
</script>
<noscript><meta http-equiv="refresh" content="0;url=/"></noscript>
</body>
</html>
"""


def load():
    if os.path.exists(INDEX):
        with open(INDEX) as f:
            return json.load(f)
    return {}


def save(data):
    with open(INDEX, 'w') as f:
        json.dump(data, f, indent=2, sort_keys=True)
        f.write('\n')


def main():
    ap = argparse.ArgumentParser(description='Create a tracked share link.')
    ap.add_argument('tag', nargs='?', help='short slug, e.g. nvidia-recruiter')
    ap.add_argument('--note', default='', help='reminder of who this went to')
    ap.add_argument('--list', action='store_true', help='list existing links')
    a = ap.parse_args()

    links = load()

    if a.list or not a.tag:
        if not links:
            print('No tracked links yet. Create one:\n'
                  '  python3 tools/newlink.py nvidia-recruiter --note "Priya, ML infra role"')
            return
        print('%-28s %-12s %s' % ('LINK', 'CREATED', 'NOTE'))
        for tag in sorted(links):
            m = links[tag]
            print('%-28s %-12s %s' % ('/r/%s/' % tag, m['created'], m.get('note', '')))
        return

    tag = a.tag.strip().lower()
    if not re.fullmatch(r'[a-z0-9][a-z0-9-]{1,48}', tag):
        sys.exit('Tag must be lowercase letters, digits and hyphens (2-49 chars).')

    d = os.path.join(RDIR, tag)
    if os.path.exists(d):
        print('Link already exists — reusing it.')
    else:
        os.makedirs(d)
        with open(os.path.join(d, 'index.html'), 'w') as f:
            f.write(PAGE.format(base=BASE))
        links[tag] = {'created': datetime.date.today().isoformat(), 'note': a.note}
        save(links)

    print('\n  %s/r/%s/\n' % (BASE, tag))
    if a.note:
        print('  note: %s' % a.note)
    print('  Commit and push, then it is live:')
    print('    git add r && git commit -m "Add tracked link: %s" && git push\n' % tag)


if __name__ == '__main__':
    main()
