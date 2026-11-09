#!/usr/bin/env python3
"""Sitemap <lastmod> from git history (like PatchPulse's site/sitemap.py + test/sitemap.test.js).

  python3 scripts/sitemap-lastmod.py          rewrite docs/sitemap.xml: lastmod = last git commit date of each page file
                                              (files with uncommitted changes get today's date)
  python3 scripts/sitemap-lastmod.py --check  exit 1 if a page's last commit is dated after its lastmod (unless that
                                              commit also updated the sitemap); run without --check to fix
Run after editing any page in docs/. Needs full git history (actions/checkout fetch-depth: 0)."""
import datetime, os, re, subprocess, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SM = os.path.join(ROOT, 'docs', 'sitemap.xml')
URL = re.compile(r'<url><loc>https://agentkitdrawer\.com([^<]*)</loc><lastmod>([^<]*)</lastmod></url>')

def git(*a):
    r = subprocess.run(['git', '-C', ROOT, *a], capture_output=True, text=True)
    return r.stdout.strip() if r.returncode == 0 else None

def page_file(path):
    f = 'docs' + path + ('index.html' if path.endswith('/') else '')
    assert os.path.exists(os.path.join(ROOT, f)), f'{path}: missing {f}'
    return f

def main():
    xml = open(SM).read()
    entries = URL.findall(xml)
    assert len(entries) == xml.count('<loc>') > 10, 'unexpected sitemap format'
    if '--check' in sys.argv:
        if git('rev-parse', '--is-shallow-repository') == 'true':
            sys.exit('shallow clone: fetch full history (fetch-depth: 0)')
        sm_commit = git('log', '-1', '--format=%H', '--', 'docs/sitemap.xml')
        stale = []
        for path, lastmod in entries:
            f = page_file(path)
            assert re.fullmatch(r'\d{4}-\d{2}-\d{2}', lastmod), f'{path}: lastmod {lastmod!r}'
            if git('status', '--porcelain', '--', f): continue  # uncommitted local edit
            pc, _, pdate = (git('log', '-1', '--format=%H %cs', '--', f) or ' ').partition(' ')
            if not pc: continue
            # Same commit as the sitemap update (e.g. a squash merge dated later than the PR): the sitemap was regenerated with it.
            if pc != sm_commit and lastmod < pdate: stale.append(f'{path}: lastmod {lastmod}, page changed {pdate}')
        if stale:
            print('Stale sitemap lastmod. Run: python3 scripts/sitemap-lastmod.py', *stale, sep='\n  ')
            sys.exit(1)
        print(f'sitemap lastmod OK ({len(entries)} URLs)')
        return
    today = datetime.date.today().isoformat()
    def lastmod(path):
        f = page_file(path)
        if git('status', '--porcelain', '--', f): return today
        return git('log', '-1', '--format=%cs', '--', f) or today
    out = URL.sub(lambda m: f'<url><loc>https://agentkitdrawer.com{m[1]}</loc><lastmod>{lastmod(m[1])}</lastmod></url>', xml)
    open(SM, 'w').write(out)

main()
