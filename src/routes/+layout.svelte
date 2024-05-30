<script lang="ts">
	import { AppBar, AppLayout, Card, Button, NavItem, Tooltip, settings } from 'svelte-ux';

	import { page } from '$app/stores';
	import '../app.postcss';

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

<AppLayout>
	<nav slot="nav" class="nav">
		<NavItem
			path="/"
			text="Home"
			icon="M12 5.69L17 10.19V18H15V12H9V18H7V10.19L12 5.69M12 3L2 12H5V20H11V14H13V20H19V12H22"
			currentUrl={$page.url}
			class="mt-2"
		/>

		<NavItem
			path="/ingest"
			text="Ingest"
			icon="M8 17V15H16V17H8M16 11L12 7L8 11H10.5V14H13.5V11H16M5 3H19C20.11 3 21 3.9 21 5V19C21 20.11 20.11 21 19 21H5C3.9 21 3 20.11 3 19V5C3 3.9 3.9 3 5 3M5 5V19H19V5H5Z"
			currentUrl={$page.url}
		/>

		<NavItem
			path="/browse"
			text="Browse"
			icon="M11 15H17V17H11V15M9 7H7V9H9V7M11 13H17V11H11V13M11 9H17V7H11V9M9 11H7V13H9V11M21 5V19C21 20.1 20.1 21 19 21H5C3.9 21 3 20.1 3 19V5C3 3.9 3.9 3 5 3H19C20.1 3 21 3.9 21 5M19 5H5V19H19V5M9 15H7V17H9V15Z"
			currentUrl={$page.url}
		/>
	</nav>

	<AppBar title="HIVE Data Ingestion">
		<div slot="actions" class="flex gap-3"></div>
	</AppBar>

	<slot />
</AppLayout>

<style>
</style>
