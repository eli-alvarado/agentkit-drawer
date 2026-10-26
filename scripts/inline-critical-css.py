#!/usr/bin/env python3
"""Re-inline docs/style.css and docs/fonts/fonts.css into home and /packs/.
These two pages inline CSS to avoid render-blocking requests (mobile LCP).
Run after editing style.css or fonts.css:  python3 scripts/inline-critical-css.py"""
import re, pathlib
root = pathlib.Path(__file__).resolve().parent.parent / "docs"
for page in ["index.html", "packs/index.html"]:
    p = root / page
    t = p.read_text()
    for src in ["fonts/fonts.css", "style.css"]:
        css = (root / src).read_text()
        t, n = re.subn(r'<style data-inline="%s">.*?</style>' % re.escape(src),
                       lambda m: '<style data-inline="%s">%s</style>' % (src, css), t, flags=re.S)
        assert n == 1, (page, src)
    p.write_text(t)
    print("inlined", page)
