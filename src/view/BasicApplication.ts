import { SvelteApplication, type SvelteApplicationOptions } from '#runtime/svelte/application';
import BasicAppShell from './BasicAppShell.svelte';

declare module '@typhonjs-fvtt/runtime/svelte/application' {
	// @ts-expect-error
	// https://github.com/microsoft/TypeScript/issues/20920
	export interface SvelteApplication extends Application { }
	export class SvelteApplication {
		static defaultOptions: ApplicationOptions & SvelteApplicationOptions;
	}
}

export default class BasicApplication extends SvelteApplication {
	static get defaultOptions() {
		return foundry.utils.mergeObject(super.defaultOptions, {
			title: 'TemplateESM.title',
			width: 300,

			svelte: {
				class: BasicAppShell,
				target: document.body
			}
		});
	}
}