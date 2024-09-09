<script lang="ts">
	import { AppBar, AppLayout, Card, Button, NavItem, Tooltip, settings } from 'svelte-ux';
	import '../app.postcss';
	import User from '../components/user.svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;

	settings({
		components: {
			AppBar: {
				classes: 'bg-custom-blue text-white shadow-md'
			}
		}
	});
</script>

<AppLayout areas="'header header' 'aside main'" navWidth=0>
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
