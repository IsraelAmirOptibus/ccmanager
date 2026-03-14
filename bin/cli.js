#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distCliPath = join(__dirname, '..', 'dist', 'cli.js');

if (!existsSync(distCliPath)) {
	console.error('ccmanager: dist/cli.js not found. Run `npm run build` first.');
	process.exit(1);
}

const args = process.argv.slice(2);

// CCManager requires Bun for PTY/session support (Bun.Terminal API).
// Resolve bun path explicitly - PATH can be stripped when running from global install.
const home = process.env.HOME || process.env.USERPROFILE || '';
const bunCandidates = [
	...(home ? [join(home, '.bun', 'bin', 'bun')] : []),
	'/opt/homebrew/bin/bun',
	'/usr/local/bin/bun',
	'bun',
];
const bunPath = bunCandidates.find((p) => p === 'bun' || existsSync(p)) ?? 'bun';

const bunResult = spawnSync(bunPath, ['--no-env-file', distCliPath, ...args], {
	stdio: 'inherit',
	env: process.env,
});

if (bunResult.error) {
	console.error(
		'ccmanager: Bun is required for session support. Install from https://bun.sh',
	);
	process.exit(1);
}
process.exit(bunResult.status ?? (bunResult.signal ? 128 : 0));
