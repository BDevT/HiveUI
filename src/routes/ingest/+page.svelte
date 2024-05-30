<script lang="ts">
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { ExpansionPanel, Field, Input } from 'svelte-ux';
	import { JSONEditor } from 'svelte-jsoneditor';

	type FileWithPreview = File & { preview: string };

	const files = writable<FileWithPreview[]>([]);

	let initialJsonContent = {
		text: undefined, // can be used to pass a stringified JSON document instead
		json: {
			array: [1, 2, 3],
			boolean: true,
			color: '#82b92c',
			null: null,
			number: 123,
			object: { a: 'b', c: 'd' },
			string: 'Hello World'
		}
	};

	let content = {
		text: undefined, // can be used to pass a stringified JSON document instead
		json: {
			array: [1, 2, 3],
			boolean: true,
			color: '#82b92c',
			null: null,
			number: 123,
			object: { a: 'b', c: 'd' },
			string: 'Hello World'
		}
	};
	

	const jsonContent = writable<typeof initialJsonContent>(initialJsonContent);

	let dropzone: HTMLDivElement;
	let fileInput: HTMLInputElement;

	onMount(() => {
		dropzone.addEventListener('dragover', (event) => {
			event.preventDefault();
			dropzone.classList.add('border-primary', 'bg-surface-200');
		});

		dropzone.addEventListener('dragleave', () => {
			dropzone.classList.remove('border-primary', 'bg-surface-200');
		});

		dropzone.addEventListener('drop', (event) => {
			event.preventDefault();
			dropzone.classList.remove('border-primary', 'bg-surface-200');
			handleFiles(event.dataTransfer?.files ?? null);
		});
	});

	function resetForm() {
		files.set([]);
		jsonContent.set(initialJsonContent);
	}

	function submitForm() {
		alert('Form submitted');
	}

	function handleFiles(selectedFiles: FileList | null) {
		if (!selectedFiles) return;

		const fileArray = Array.from(selectedFiles).map((file) => {
			const preview = URL.createObjectURL(file);
			if (file.type === 'application/json') {
				parseJsonFile(file);
			}
			return { ...file, preview };
		});

		files.set(fileArray);
	}

	function triggerFileInput() {
		fileInput.click();
	}

	function handleFileInputChange(event: Event) {
		const target = event.target as HTMLInputElement;
		handleFiles(target.files);
	}

	function parseJsonFile(file: File) {
		const reader = new FileReader();
		reader.onload = (event) => {
			const content = event.target?.result as string;
			try {
				const json = JSON.parse(content);
				jsonContent.set(json);
			} catch (error) {
				console.error('Error parsing JSON file:', error);
			}
		};
		reader.readAsText(file);
	}
</script>

<div
	class="flex flex-col items-center justify-start min-h-screen bg-neutral p-4 text-neutral-content w-full"
>
	<div
		bind:this={dropzone}
		class="w-full max-w-screen-xl p-6 border-4 border-dashed border-surface-content bg-surface-100 rounded-md text-center cursor-pointer hover:border-primary hover:bg-surface-200 transition"
	>
		<p class="mb-4">Drag & Drop your files here</p>
		<button
			on:click={triggerFileInput}
			class="px-4 py-2 bg-primary text-neutral-content rounded hover:bg-primary-dark transition"
		>
			Or select files
		</button>
		<input
			bind:this={fileInput}
			type="file"
			multiple
			class="hidden"
			on:change={handleFileInputChange}
		/>
	</div>

	<!-- File Preview and Metadata -->
	<div class="grid grid-cols-2 gap-4 mt-4 w-full max-w-screen-xl">
		<div class="w-full max-w-screen-xl mt-4">
			<ExpansionPanel open={false}>
				<div slot="trigger" class="flex-1 p-3">File Information</div>
				<div class="p-4 grid grid-cols-2 gap-4">
					<Field label="Source Folder">
						<Input placeholder="Data source folder path" />
					</Field>
					<Field label="Size">
						<Input placeholder="Size in bytes" type="number" />
					</Field>
					<Field label="Packed Size">
						<Input placeholder="Packed size in bytes" type="number" />
					</Field>
					<Field label="Number of Files">
						<Input type="number" />
					</Field>
					<Field label="Number of Files Archived">
						<Input type="number" />
					</Field>
				</div>
			</ExpansionPanel>

			<ExpansionPanel open={false}>
				<div slot="trigger" class="flex-1 p-3">Owner Information</div>
				<div class="p-4 grid grid-cols-2 gap-4">
					<Field label="Owner">
						<Input />
					</Field>
					<Field label="Owner ORCID">
						<Input placeholder="ORCID identifier" />
					</Field>
					<Field label="Owner Email">
						<Input type="email" placeholder="example@domain.com" />
					</Field>
					<Field label="Contact Email">
						<Input type="email" placeholder="example@domain.com" />
					</Field>
				</div>
			</ExpansionPanel>

			<ExpansionPanel open={true}>
				<div slot="trigger" class="flex-1 p-3">Scientific Metadata</div>
				<div class="p-4 grid gap-4">
					<div class="grid grid-cols-2 gap-4">
						<Field label="Purpose">
							<Input placeholder="Purpose of the dataset" />
						</Field>
						<Field label="Physics">
							<Input placeholder="Physics related information" />
						</Field>
						<Field label="Study ID">
							<Input placeholder="Unique study identifier" />
						</Field>
					</div>

					<ExpansionPanel class="sub-panel">
						<div slot="trigger" class="flex-1 p-3 sub-panel-trigger">Thermocouples</div>
						<div class="p-4 grid grid-cols-2 gap-4 sub-panel-content">
							<Field label="Status">
								<Input placeholder="Active / Failed before test" />
							</Field>
							<Field label="Attachment">
								<Input placeholder="e.g., spot weld with inert gas shield" />
							</Field>
							<Field label="TC Type">
								<Input placeholder="e.g., K" />
							</Field>
							<Field label="Location">
								<Input placeholder="X, Y, Z coordinates" />
							</Field>
							<Field label="Area Type">
								<Input placeholder="e.g., Circular" />
							</Field>
							<Field label="Circle Diameter">
								<Input placeholder="Diameter in mm" type="number" />
							</Field>
							<Field label="Noise Floor">
								<Input placeholder="Noise details" />
							</Field>
						</div>
					</ExpansionPanel>

					<ExpansionPanel class="sub-panel">
						<div slot="trigger" class="flex-1 p-3 sub-panel-trigger">DIC</div>
						<div class="p-4 grid grid-cols-2 gap-4 sub-panel-content">
							<Field label="Config">
								<Input placeholder="e.g., Stereo (symmetric)" />
							</Field>
							<Field label="Camera Model">
								<Input placeholder="Camera model name" />
							</Field>
							<Field label="Camera Resolution">
								<Input placeholder="Resolution in pixels" />
							</Field>
							<Field label="Field of View">
								<Input placeholder="Dimensions in mm" />
							</Field>
							<Field label="Image Scale">
								<Input placeholder="Scale in mm/pixel" type="number" />
							</Field>
							<Field label="Stereo Angle">
								<Input placeholder="Angle in degrees" type="number" />
							</Field>
							<Field label="Stand Off Distance">
								<Input placeholder="Distance in meters" type="number" />
							</Field>
							<Field label="Image Acquisition Rate">
								<Input placeholder="Rate in Hz" type="number" />
							</Field>
							<Field label="Image Noise">
								<Input placeholder="Noise percentage" type="number" />
							</Field>
							<Field label="Imaged Surface on Specimen">
								<Input placeholder="e.g., XY plane" />
							</Field>
							<Field label="Software Name">
								<Input placeholder="Software used" />
							</Field>
							<Field label="Software Version">
								<Input placeholder="Software version" />
							</Field>
							<Field label="Pattern Technique">
								<Input placeholder="e.g., Airbrush" />
							</Field>
							<Field label="Pattern Background">
								<Input placeholder="e.g., black VHT paint" />
							</Field>
							<Field label="Pattern Speckle">
								<Input placeholder="e.g., white VHT paint" />
							</Field>
							<Field label="Approx Feature Size">
								<Input placeholder="Size in microns" type="number" />
							</Field>
							<Field label="Lens Model">
								<Input placeholder="Lens model name" />
							</Field>
							<Field label="Lens Focal Length">
								<Input placeholder="Focal length in mm" type="number" />
							</Field>
							<Field label="Lens Aperture">
								<Input placeholder="e.g., f/8" />
							</Field>
							<Field label="Lens Filters">
								<Input placeholder="e.g., Edmund optics blue filter" />
							</Field>
							<Field label="Cal Target Make">
								<Input placeholder="Calibration target make" />
							</Field>
							<Field label="Cal Target Dims">
								<Input placeholder="Dimensions in dots" />
							</Field>
							<Field label="Cal Target Spacing">
								<Input placeholder="Spacing in mm" type="number" />
							</Field>
						</div>
					</ExpansionPanel>
				</div>
			</ExpansionPanel>
		</div>
		<div class="editor jse-theme-dark">
			<JSONEditor bind:content={initialJsonContent} />
		</div>
	</div>

	<!-- Button Group -->
	<div class="button-group">
		<button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" on:click={resetForm}
			>Reset</button
		>
		<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" on:click={submitForm}
			>Submit</button
		>
	</div>
</div>

<style>
	@import 'svelte-jsoneditor/themes/jse-theme-dark.css';

	.sub-panel-trigger {
		background-color: #2e5f91; /* Softer blue for the trigger */
		border-radius: 4px 4px 0 0; /* Rounded corners on the top */
	}

	.button-group {
		display: flex;
		justify-content: flex-end;
		margin-top: 16px;
		margin-left: 1100px;
		gap: 8px;
	}
</style>
