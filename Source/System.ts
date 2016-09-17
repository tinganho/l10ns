
namespace L10ns {
	const fs = require('fs');
	const _path = require('path');

	export function writeFile(file: string, content: string): void {
		fs.writeFileSync(file, content, { encoding: 'utf8' });
	}

	export function joinPath(path: string, ...paths: string[]): string {
		return _path.join(path, ...paths);
	}
}
