<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { Card } from 'svelte-ux';

	// Example data for entries, replace this with your actual data source
	const dataCatalogue = writable([
		{
			file: 'Dataset 3',
			metadata: {
				purpose: 'Calibration',
				physics: 'Optics',
				study_id: 'OPT-12345',
				owner: 'Alice Brown',
				creationTime: '2023-03-01T00:00:00Z'
			}
		},
		{
			file: 'Dataset 4',
			metadata: {
				purpose: 'Validation',
				physics: 'Mechanical Testing',
				study_id: 'MECH-54321',
				owner: 'Bob Johnson',
				creationTime: '2023-04-01T00:00:00Z'
			}
		},
		{
			file: 'Dataset 5',
			metadata: {
				purpose: 'Research',
				physics: 'Material Science',
				study_id: 'MAT-98765',
				owner: 'Carol White',
				creationTime: '2023-05-01T00:00:00Z'
			}
		},
		{
			file: 'Dataset 6',
			metadata: {
				purpose: 'Simulation',
				physics: 'Computational Fluid Dynamics',
				study_id: 'CFD-19283',
				owner: 'David Green',
				creationTime: '2023-06-01T00:00:00Z'
			}
		},
		{
			file: 'Dataset 7',
			metadata: {
				purpose: 'Experiment',
				physics: 'Solid Mechanics',
				study_id: 'SOL-27456',
				owner: 'Eve Black',
				creationTime: '2023-07-01T00:00:00Z'
			}
		},
		{
			file: 'Dataset 8',
			metadata: {
				purpose: 'Analysis',
				physics: 'Thermal Analysis',
				study_id: 'THER-38475',
				owner: 'Frank Yellow',
				creationTime: '2023-08-01T00:00:00Z'
			}
		},
		{
			file: 'Dataset 9',
			metadata: {
				purpose: 'Benchmarking',
				physics: 'Stress Testing',
				study_id: 'STRESS-93847',
				owner: 'Grace Blue',
				creationTime: '2023-09-01T00:00:00Z'
			}
		},
		{
			file: 'Dataset 10',
			metadata: {
				purpose: 'Validation',
				physics: 'Dynamic Analysis',
				study_id: 'DYN-84756',
				owner: 'Hank Red',
				creationTime: '2023-10-01T00:00:00Z'
			}
		},
		{
			file: 'Dataset 11',
			metadata: {
				purpose: 'Experiment',
				physics: 'Vibration Analysis',
				study_id: 'VIB-12378',
				owner: 'Ivy Purple',
				creationTime: '2023-11-01T00:00:00Z'
			}
		},
		{
			file: 'Dataset 12',
			metadata: {
				purpose: 'Measurement',
				physics: 'Optical Flow',
				study_id: 'OPTFL-83729',
				owner: 'Jack Orange',
				creationTime: '2023-12-01T00:00:00Z'
			}
		}
	]);

	let entries: any[] = [];
	onMount(() => {
		dataCatalogue.subscribe((value) => {
			entries = value;
		});
	});
</script>

<div class="p-4">
	<h1 class="text-xl font-semibold mb-4">Data Catalogue</h1>
	<div class="grid">
		{#each entries as entry}
			<Card title={entry.file} subheading="Metadata">
				<div slot="contents" class="p-4">
					<p><strong>Purpose:</strong> {entry.metadata.purpose}</p>
					<p><strong>Physics:</strong> {entry.metadata.physics}</p>
					<p><strong>Study ID:</strong> {entry.metadata.study_id}</p>
				</div>
			</Card>
		{/each}
	</div>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 1rem;
	}
</style>
