<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { Button, ExpansionPanel, Field, Input } from 'svelte-ux';
	import { JSONEditor, type Content, type JSONContent, type TextContent } from 'svelte-jsoneditor';
	import { mdiTrashCan } from '@mdi/js';

	type FileWithPreview = File & { preview: string };

	const files = writable<FileWithPreview[]>([]);

	type Thermocouple = {
		status: string;
		attachment: string;
		tcType: string;
		location: string;
		areaType: string;
		circleDiameter: string;
		noiseFloor: string;
	};

	type DICConfig = {
		config: string;
		cameraModel: string;
		cameraResolution: string;
		fieldOfView: string;
		imageScale: string;
		stereoAngle: string;
		standOffDistance: string;
		imageAcquisitionRate: string;
		imageNoise: string;
		imagedSurfaceOnSpecimen: string;
		softwareName: string;
		softwareVersion: string;
		patternTechnique: string;
		patternBackground: string;
		patternSpeckle: string;
		approxFeatureSize: string;
		lensModel: string;
		lensFocalLength: string;
		lensAperture: string;
		lensFilters: string;
		calTargetMake: string;
		calTargetDims: string;
		calTargetSpacing: string;
	};

	type HiveMetadata = {
		sourceFolder: string;
		size: string;
		packedSize: string;
		numFiles: string;
		numFilesArchived: string;
		owner: string;
		ownerOrcid: string;
		ownerEmail: string;
		contactEmail: string;
		purpose: string;
		physics: string;
		studyId: string;
		thermocouples: Thermocouple[];
		dicConfigs: DICConfig[];
	};

	let currentMetaData: HiveMetadata = {
		sourceFolder: '',
		size: '',
		packedSize: '',
		numFiles: '',
		numFilesArchived: '',
		owner: '',
		ownerOrcid: '',
		ownerEmail: '',
		contactEmail: '',
		purpose: '',
		physics: '',
		studyId: '',
		thermocouples: [],
		dicConfigs: []
	};

	function addThermocouple(): void {
		currentMetaData.thermocouples.push({
			status: '',
			attachment: '',
			tcType: '',
			location: '',
			areaType: '',
			circleDiameter: '',
			noiseFloor: ''
		});
		currentMetaData = { ...currentMetaData };
	}

	function addDIC(): void {
		currentMetaData.dicConfigs.push({
			config: '',
			cameraModel: '',
			cameraResolution: '',
			fieldOfView: '',
			imageScale: '',
			stereoAngle: '',
			standOffDistance: '',
			imageAcquisitionRate: '',
			imageNoise: '',
			imagedSurfaceOnSpecimen: '',
			softwareName: '',
			softwareVersion: '',
			patternTechnique: '',
			patternBackground: '',
			patternSpeckle: '',
			approxFeatureSize: '',
			lensModel: '',
			lensFocalLength: '',
			lensAperture: '',
			lensFilters: '',
			calTargetMake: '',
			calTargetDims: '',
			calTargetSpacing: ''
		});

		currentMetaData = { ...currentMetaData };
	}

	function removeThermocouple(index: number): void {
		currentMetaData.thermocouples.splice(index, 1);

		currentMetaData = { ...currentMetaData };
	}

	function removeDIC(index: number): void {
		currentMetaData.dicConfigs.splice(index, 1);

		currentMetaData = { ...currentMetaData };
	}

	let jsonContent: JSONContent = {
		json: undefined
	};

	function updateJsonContent() {
		jsonContent = {
			json: JSON.parse(JSON.stringify(currentMetaData))
		};
	}

	function updateCurrentMetaData() {
		if (jsonContent.json) {
			currentMetaData = {
				...currentMetaData,
				...JSON.parse(JSON.stringify(jsonContent.json))
			};
		}
	}

	$: {
		if (currentMetaData) {
			updateJsonContent();
		}
	}

	$: {
		if (jsonContent.json) {
			updateCurrentMetaData();
		}
	}

	function handleManualUpdate() {
		currentMetaData = { ...currentMetaData };
	}

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

		//jsonContent = { json: currentMetaData };
	});

	function resetForm() {
		files.set([]);
		currentMetaData = {
			sourceFolder: '',
			size: '',
			packedSize: '',
			numFiles: '',
			numFilesArchived: '',
			owner: '',
			ownerOrcid: '',
			ownerEmail: '',
			contactEmail: '',
			purpose: '',
			physics: '',
			studyId: '',
			thermocouples: [],
			dicConfigs: []
		};
		jsonContent = { json: {} };
	}

	function submitForm() {
		alert('Form submitted');
	}

	function exportForm() {
		const blob = new Blob([JSON.stringify(currentMetaData, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		const date = new Date();
		const filename = `metadata_export_${date.toISOString().replace(/[:T]/g, '-').slice(0, -5)}.json`;
		a.download = filename;

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		URL.revokeObjectURL(url);
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
				jsonContent = { json };
				//currentMetaData = { ...currentMetaData, ...json };
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
			<ExpansionPanel>
				<div slot="trigger" class="flex-1 p-3">File Information</div>
				<div class="p-4 grid grid-cols-2 gap-4">
					<Field label="Source Folder">
						<Input
							placeholder="Data source folder path"
							bind:value={currentMetaData.sourceFolder}
						/>
					</Field>
					<Field label="Size">
						<Input placeholder="Size in bytes" type="number" bind:value={currentMetaData.size} />
					</Field>
					<Field label="Packed Size">
						<Input
							placeholder="Packed size in bytes"
							type="number"
							bind:value={currentMetaData.packedSize}
						/>
					</Field>
					<Field label="Number of Files">
						<Input type="number" bind:value={currentMetaData.numFiles} />
					</Field>
					<Field label="Number of Files Archived">
						<Input type="number" bind:value={currentMetaData.numFilesArchived} />
					</Field>
				</div>
			</ExpansionPanel>

			<ExpansionPanel>
				<div slot="trigger" class="flex-1 p-3">Owner Information</div>
				<div class="p-4 grid grid-cols-2 gap-4">
					<Field label="Owner">
						<Input placeholder="Owner name" bind:value={currentMetaData.owner} />
					</Field>
					<Field label="Owner ORCID">
						<Input placeholder="ORCID identifier" bind:value={currentMetaData.ownerOrcid}/>
					</Field>
					<Field label="Owner Email">
						<Input type="email" placeholder="example@domain.com" bind:value={currentMetaData.ownerEmail} />
					</Field>
					<Field label="Contact Email">
						<Input type="email" placeholder="example@domain.com" bind:value={currentMetaData.contactEmail} />
					</Field>
				</div>
			</ExpansionPanel>

			<ExpansionPanel open={true}>
				<div slot="trigger" class="flex-1 p-3">Scientific Metadata</div>
				<div class="p-4 grid gap-4">
					<div class="grid grid-cols-2 gap-4">
						<Field label="Purpose">
							<Input placeholder="Purpose of the dataset" bind:value={currentMetaData.purpose} />
						</Field>
						<Field label="Physics">
							<Input
								placeholder="Physics related information"
								bind:value={currentMetaData.physics}
							/>
						</Field>
						<Field label="Study ID">
							<Input placeholder="Unique study identifier" bind:value={currentMetaData.studyId} />
						</Field>
					</div>

					<ExpansionPanel
						classes={{
							root: 'bg-surface-200 text-surface-content rounded'
						}}
					>
						<div slot="trigger" class="flex-1 p-3">Thermocouples</div>
						<div class="p-4 grid gap-4">
							{#each currentMetaData['thermocouples'] as _, index}
								<ExpansionPanel
									classes={{
										root: 'bg-surface-100 text-surface-content flex-grow'
									}}
								>
									<div slot="trigger" class="flex-1 p-3">
										Thermocouple {index + 1}
										<Button
											icon={mdiTrashCan}
											color="danger"
											on:click={() => removeThermocouple(index)}
										/>
									</div>
									<div class="p-4 grid grid-cols-2 gap-4">
										<Field label="Status">
											<Input placeholder="Active / Failed before test" bind:value={_.status} />
										</Field>
										<Field label="Attachment">
											<Input
												placeholder="e.g., spot weld with inert gas shield"
												bind:value={_.attachment}
											/>
										</Field>
										<Field label="TC Type">
											<Input placeholder="e.g., K" bind:value={_.tcType} />
										</Field>
										<Field label="Location">
											<Input placeholder="X, Y, Z coordinates" bind:value={_.location} />
										</Field>
										<Field label="Area Type">
											<Input placeholder="e.g., Circular" bind:value={_.areaType} />
										</Field>
										<Field label="Circle Diameter">
											<Input
												placeholder="Diameter in mm"
												type="number"
												bind:value={_.circleDiameter}
											/>
										</Field>
										<Field label="Noise Floor">
											<Input placeholder="Noise details" bind:value={_.noiseFloor} />
										</Field>
									</div>
								</ExpansionPanel>
							{/each}
							<Button on:click={addThermocouple}>+ Thermocouple</Button>
						</div>
					</ExpansionPanel>

					<ExpansionPanel
						classes={{
							root: 'bg-surface-200 text-surface-content rounded'
						}}
					>
						<div slot="trigger" class="flex-1 p-3">DIC Configurations</div>
						<div class="p-4 grid gap-4">
							{#each currentMetaData['dicConfigs'] as _, index}
								<ExpansionPanel
									classes={{
										root: 'bg-surface-100 text-surface-content'
									}}
								>
									<div slot="trigger" class="flex-1 p-3">
										DIC Configuration {index + 1}
										<Button icon={mdiTrashCan} color="danger" on:click={() => removeDIC(index)} />
									</div>
									<div class="p-4 grid grid-cols-2 gap-4">
										<Field label="Config">
											<Input placeholder="e.g., Stereo (symmetric)" bind:value={_.config} />
										</Field>
										<Field label="Camera Model">
											<Input placeholder="Camera model name" bind:value={_.cameraModel} />
										</Field>
										<Field label="Camera Resolution">
											<Input placeholder="Resolution in pixels" bind:value={_.cameraResolution} />
										</Field>
										<Field label="Field of View">
											<Input placeholder="Dimensions in mm" bind:value={_.fieldOfView} />
										</Field>
										<Field label="Image Scale">
											<Input
												placeholder="Scale in mm/pixel"
												type="number"
												bind:value={_.imageScale}
											/>
										</Field>
										<Field label="Stereo Angle">
											<Input
												placeholder="Angle in degrees"
												type="number"
												bind:value={_.stereoAngle}
											/>
										</Field>
										<Field label="Stand Off Distance">
											<Input
												placeholder="Distance in meters"
												type="number"
												bind:value={_.standOffDistance}
											/>
										</Field>
										<Field label="Image Acquisition Rate">
											<Input
												placeholder="Rate in Hz"
												type="number"
												bind:value={_.imageAcquisitionRate}
											/>
										</Field>
										<Field label="Image Noise">
											<Input
												placeholder="Noise percentage"
												type="number"
												bind:value={_.imageNoise}
											/>
										</Field>
										<Field label="Imaged Surface on Specimen">
											<Input placeholder="e.g., XY plane" bind:value={_.imagedSurfaceOnSpecimen} />
										</Field>
										<Field label="Software Name">
											<Input placeholder="Software used" bind:value={_.softwareName} />
										</Field>
										<Field label="Software Version">
											<Input placeholder="Software version" bind:value={_.softwareVersion} />
										</Field>
										<Field label="Pattern Technique">
											<Input placeholder="e.g., Airbrush" bind:value={_.patternTechnique} />
										</Field>
										<Field label="Pattern Background">
											<Input placeholder="e.g., black VHT paint" bind:value={_.patternBackground} />
										</Field>
										<Field label="Pattern Speckle">
											<Input placeholder="e.g., white VHT paint" bind:value={_.patternSpeckle} />
										</Field>
										<Field label="Approx Feature Size">
											<Input
												placeholder="Size in microns"
												type="number"
												bind:value={_.approxFeatureSize}
											/>
										</Field>
										<Field label="Lens Model">
											<Input placeholder="Lens model name" bind:value={_.lensModel} />
										</Field>
										<Field label="Lens Focal Length">
											<Input
												placeholder="Focal length in mm"
												type="number"
												bind:value={_.lensFocalLength}
											/>
										</Field>
										<Field label="Lens Aperture">
											<Input placeholder="e.g., f/8" bind:value={_.lensAperture} />
										</Field>
										<Field label="Lens Filters">
											<Input
												placeholder="e.g., Edmund optics blue filter"
												bind:value={_.lensFilters}
											/>
										</Field>
										<Field label="Cal Target Make">
											<Input placeholder="Calibration target make" bind:value={_.calTargetMake} />
										</Field>
										<Field label="Cal Target Dims">
											<Input placeholder="Dimensions in dots" bind:value={_.calTargetDims} />
										</Field>
										<Field label="Cal Target Spacing">
											<Input
												placeholder="Spacing in mm"
												type="number"
												bind:value={_.calTargetSpacing}
											/>
										</Field>
									</div>
								</ExpansionPanel>
							{/each}
							<Button on:click={addDIC}>+ DIC Configuration</Button>
						</div>
					</ExpansionPanel>
				</div>
			</ExpansionPanel>
		</div>
		<div class="editor jse-theme-dark">
			<JSONEditor bind:content={jsonContent} on:change={handleManualUpdate} />
		</div>
	</div>

	<div class="button-group w-full max-w-screen-xl">
		<div class="left-buttons">
			<button
				class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				on:click={exportForm}>Export</button
			>
		</div>
		<div class="right-buttons">
			<button
				class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
				on:click={resetForm}>Reset</button
			>
			<button
				class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
				on:click={submitForm}>Submit</button
			>
		</div>
	</div>
</div>

<style>
	@import 'svelte-jsoneditor/themes/jse-theme-dark.css';

	.button-group {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-top: 10px;
	}

	.right-buttons {
		display: flex;
		gap: 10px;
	}
</style>
