"""Prepare isolated tooltip baselines. Run from the repository root; never edits production source."""
from pathlib import Path
import hashlib
import json
import os
import shutil
import subprocess

root = Path.cwd()
fixtures = Path(__file__).resolve().parent
out = Path(os.environ.get('TOOLTIP_AUDIT_DIR', '/tmp/bunt-tooltip-audit'))
baseline = '3d429fa6f5f594e4474431af609741e38b49abdb'
paths = ['src/directives/tooltip.ts', 'src/styles/components/tooltip.sass']
manifest = {'baselineCommit': baseline, 'head': subprocess.check_output(['git', 'rev-parse', 'HEAD'], text=True).strip(), 'variants': {}}
for variant in ['baseline', 'current']:
	dest = out / variant
	dest.mkdir(parents=True, exist_ok=True)
	for name in ['src', 'tests/fixtures']:
		shutil.copytree(root / name, dest / name, dirs_exist_ok=True)
	shutil.copy(root / 'package.json', dest / 'package.json')
	if not (dest / 'node_modules').exists():
		(dest / 'node_modules').symlink_to(root / 'node_modules', target_is_directory=True)
	if variant == 'baseline':
		for name in paths:
			(dest / name).write_bytes(subprocess.check_output(['git', 'show', f'{baseline}:{name}']))
	shutil.copy(fixtures / 'TooltipAudit.vue', dest / 'tests/fixtures/TooltipAudit.vue')
	config = dest / 'tests/fixtures/vite.config.ts'
	allow = json.dumps([str(out), str(root / 'node_modules')])
	config.write_text(config.read_text().replace('root,', f'root,\n\tcacheDir: {json.dumps(str(dest / "vite-cache"))},').replace('server: {', f'server: {{\n\t\tfs: {{ allow: {allow} }},'))
	manifest['variants'][variant] = {str(p.relative_to(dest)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((dest / 'src').rglob('*')) if p.is_file()}
manifest['lockfileSha256'] = hashlib.sha256((root / 'package-lock.json').read_bytes()).hexdigest()
(out / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(out)
