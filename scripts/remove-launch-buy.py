#!/usr/bin/env python3
"""LAUNCH cleanup for the DRW-06 one-click buy buttons (run after Wed Oct 28, 2026, 6:20 PM CT).

1. Strips every <!-- LAUNCH-BUY:START -->...<!-- LAUNCH-BUY:END --> block from docs/ (/packs/ + any static page).
2. Sets LAUNCH_BUY_ON = False in scripts/build-directory.py and rebuilds /directory/ (index + all entries).
dev.to buttons are removed separately: python3 /workspace/luca/devto/devto_launch.py remove (private, uses the DEV key).
links.js already hides [data-launch-end] blocks client-side after the deadline, so this is the permanent cleanup.
"""
import re, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
RE = re.compile(r"\s*<!-- LAUNCH-BUY:START -->.*?<!-- LAUNCH-BUY:END -->", re.S)
n = 0
for p in (ROOT / "docs").rglob("*.html"):
    s = p.read_text(encoding="utf-8"); t = RE.sub("", s)
    if t != s: p.write_text(t, encoding="utf-8"); n += 1
b = ROOT / "scripts" / "build-directory.py"
s = b.read_text(encoding="utf-8"); b.write_text(s.replace("LAUNCH_BUY_ON = True", "LAUNCH_BUY_ON = False"), encoding="utf-8")
subprocess.run([sys.executable, str(b)], check=True)
left = [str(p) for p in (ROOT / "docs").rglob("*.html") if "LAUNCH-BUY" in p.read_text(encoding="utf-8")]
print(f"stripped {n} static pages; directory rebuilt; leftover blocks: {left or 'none'}")
