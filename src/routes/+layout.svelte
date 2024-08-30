<script lang="ts">
	import { AppBar, AppLayout, Card, Button, NavItem, Tooltip, settings } from 'svelte-ux';
	import '../app.postcss';
	import User from '../components/user.svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;

	settings({
		components: {
			AppBar: {
				classes: 'bg-primary text-white shadow-md'
			},
			AppLayout: {
				classes: {
					nav: 'bg-neutral-800'
				}
			},
			NavItem: {
				classes: {
					root: 'text-sm text-gray-400 pl-6 py-2 hover:text-white hover:bg-gray-300/10 [&:where(.is-active)]:text-sky-400 [&:where(.is-active)]:bg-gray-500/10'
				}
			}
		}
	});
</script>

<AppLayout areas="'header header' 'aside main'">
	<svelte:fragment slot="nav"></svelte:fragment>

	<AppBar title="HIVE Data Ingestion" class="main-appbar">
		<div slot="actions" class="flex items-center justify-end w-full">
			<User data={{ user: data?.session?.user, status: Boolean(data?.session) }} />
		</div>
	</AppBar>

	<main>
		<slot />
	</main>
</AppLayout>

<style>
  :global(.main-appbar) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
  }

  :global(.main-appbar h2) {
    margin-right: auto;
  }

  :global(.main-appbar [slot="actions"]) {
    margin-left: auto;
  }
</style>
