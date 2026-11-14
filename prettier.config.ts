import { defineConfig } from '@standard-config/prettier';
import * as pluginJSON from './src/index.ts';

export default defineConfig({
	/* oxlint-disable-next-line typescript/no-deprecated */
	pluginOverrides: {
		'prettier-plugin-expand-json': pluginJSON,
		'prettier-plugin-json': pluginJSON,
	},
});
