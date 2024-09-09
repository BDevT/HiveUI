<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import { Button, ExpansionPanel, Field, Input } from 'svelte-ux';
	import { mdiPlus, mdiTrashCan } from '@mdi/js';
	import { page } from '$app/stores';
	import type { LayoutServerData } from './$types.js';
	import User from '../components/user.svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { PUBLIC_ROOT_FOLDER_LOCATION } from '$env/static/public';

	export let data: LayoutServerData;

	class Diagnostic {
		port: Port;
		diagnostic: Thermocouple | DICConfig;
		diagnosticName?: string;
		diagosticType?: string;

		constructor() {
			this.port = new Port();
			this.diagnostic = new Thermocouple(); // Default to Thermocouple, can be changed later if needed
		}
	}

	class Port {
		portID: string;
		portDescription: string;
		portSizeStandard: string;

		constructor() {
			this.portID = '';
			this.portDescription = '';
			this.portSizeStandard = '';
		}
	}

	class Thermocouple {
		status: string;
		attachment: string;
		tcType: string;
		location: string;
		areaType: string;
		circleDiameter: string;
		noiseFloor: string;

		constructor() {
			this.status = '';
			this.attachment = '';
			this.tcType = '';
			this.location = '';
			this.areaType = '';
			this.circleDiameter = '';
			this.noiseFloor = '';
		}
	}

	class DICConfig {
		setupInformation: DICSetupInformation;
		softwareInformation: DICSoftwareInformation;
		additionalInformation: DICAdditionalInformation;
		cameraSetup: DICCameraSetup;

		constructor() {
			this.setupInformation = new DICSetupInformation();
			this.softwareInformation = new DICSoftwareInformation();
			this.additionalInformation = new DICAdditionalInformation();
			this.cameraSetup = new DICCameraSetup();
		}
	}

	class DICSetupInformation {
		configuration: string;
		stereoAngle: string;
		standOffDistance: string;
		imagedSurfaceOnSpecimen?: string;

		constructor() {
			this.configuration = '';
			this.stereoAngle = '';
			this.standOffDistance = '';
			this.imagedSurfaceOnSpecimen = '';
		}
	}

	class DICSoftwareInformation {
		softwareName: string;
		softwareVersion: string;

		constructor() {
			this.softwareName = '';
			this.softwareVersion = '';
		}
	}

	class DICAdditionalInformation {
		patternTechnique: string;
		patternBackground: string;
		patternSpeckle: string;
		approxFeatureSize?: string;
		calTargetMake?: string;
		calTargetDims?: string;
		calTargetSpacing?: string;

		constructor() {
			this.patternTechnique = '';
			this.patternBackground = '';
			this.patternSpeckle = '';
		}
	}

	class DICCameraSetup {
		comment: string;
		cameras: CameraDiagnostics[];

		constructor() {
			this.comment = '';
			this.cameras = [];
		}
	}

	class CameraDiagnostics {
		cameraInformation: CameraInformation;
		lensInformation: LensInformation;
		captureSettings: CaptureSettings;

		constructor() {
			this.cameraInformation = new CameraInformation();
			this.lensInformation = new LensInformation();
			this.captureSettings = new CaptureSettings();
		}
	}

	class CameraInformation {
		make: string;
		model: string;
		serialNumber?: string;
		resolutionX: string;
		resolutionY: string;

		constructor() {
			this.make = '';
			this.model = '';
			this.serialNumber = '';
			this.resolutionX = '';
			this.resolutionY = '';
		}
	}

	class LensInformation {
		make: string;
		model: string;
		serialNumber?: string;
		focalLength: string;
		aperture: string;
		fieldOfViewX?: string;
		fieldOfViewY?: string;

		constructor() {
			this.make = '';
			this.model = '';
			this.serialNumber = '';
			this.focalLength = '';
			this.aperture = '';
			this.fieldOfViewX = '';
			this.fieldOfViewY = '';
		}
	}

	class CaptureSettings {
		imageAcquisitionRate: string;
		imageNoise: string;
		imageScale?: string;

		constructor() {
			this.imageAcquisitionRate = '';
			this.imageNoise = '';
			this.imageScale = '';
		}
	}

	class HivePulse {
		pulseID: string;
		firstOperator: Person;
		secondOperator: Person;
		pulseStart: string;
		pulseDuration: string;
		dataCaptureStart: string;
		pulseQuality: string; // PulseQuality type
		coilInformation: CoilInformation;
		coolantInformation: CoolantInformation;
		operatorComment?: string;
		diagnostics: Diagnostic[];

		constructor() {
			this.pulseID = '';
			this.firstOperator = new Person();
			this.secondOperator = new Person();
			this.pulseStart = '';
			this.pulseDuration = '';
			this.dataCaptureStart = '';
			this.pulseQuality = '';
			this.coilInformation = new CoilInformation();
			this.coolantInformation = new CoolantInformation();
			this.operatorComment = '';
			this.diagnostics = [];
		}
	}

	class Person {
		firstName: string;
		lastName: string;
		email: string;

		constructor() {
			this.firstName = '';
			this.lastName = '';
			this.email = '';
		}
	}

	class CoolantInformation {
		coolantType: string; // CoolantType
		coolantFlow: CoolantFlow;
		coolantTemperature: CoolantTemperature;
		coolantPressure: CoolantPressure;

		constructor() {
			this.coolantType = '';
			this.coolantFlow = new CoolantFlow();
			this.coolantTemperature = new CoolantTemperature();
			this.coolantPressure = new CoolantPressure();
		}
	}

	class CoolantFlow {
		rate: string; // FlowRate type
		setpoint: string;
		value: string;
		variance: string;

		constructor() {
			this.rate = '';
			this.setpoint = '';
			this.value = '';
			this.variance = '';
		}
	}

	class CoolantTemperature {
		setpoint: string;
		in: string;
		inVariance: string;
		out: string;
		outVariance: string;
		delta: string;

		constructor() {
			this.setpoint = '';
			this.in = '';
			this.inVariance = '';
			this.out = '';
			this.outVariance = '';
			this.delta = '';
		}
	}

	class CoolantPressure {
		in: string;
		out: string;
		delta: string;

		constructor() {
			this.in = '';
			this.out = '';
			this.delta = '';
		}
	}

	class CoilInformation {
		currentType: string; // CurrentType
		inputPower: string;
		inputCurrent: string;
		inputVoltage: string;
		outputFrequency: string;
		outputPower: string;
		outputCurrent: string;
		outputVoltage: string;

		constructor() {
			this.currentType = '';
			this.inputPower = '';
			this.inputCurrent = '';
			this.inputVoltage = '';
			this.outputFrequency = '';
			this.outputPower = '';
			this.outputCurrent = '';
			this.outputVoltage = '';
		}
	}

	class HiveMetadata {
		campaignID: string;
		experimentID: string;
		leadInvestigator: Person;
		customer: string;
		experimentStart: string;
		experimentEnd: string;
		experimentType: string;
		sampleCooling: string;
		pulse: HivePulse[];

		constructor() {
			this.campaignID = '';
			this.experimentID = '';
			this.leadInvestigator = new Person();
			this.customer = '';
			this.experimentStart = '';
			this.experimentEnd = '';
			this.experimentType = '';
			this.sampleCooling = '';
			this.pulse = [];
		}
	}

	class SaveMetadata {
		targetPath: string;
		metadata: HiveMetadata;

		constructor() {
			this.targetPath = '';
			this.metadata = new HiveMetadata();
		}
	}

	const fullMetadata = writable<HiveMetadata>(new HiveMetadata());

	let currentSaveLocation: string = PUBLIC_ROOT_FOLDER_LOCATION + '/EXP_01' + '/hive_metadata.json';

	let currentMetadata: HiveMetadata;
	fullMetadata.subscribe((value) => {
		currentMetadata = value;
	});

	function addThermocouple(pulseID: string) {
		fullMetadata.update((metadata) => {
			const pulseIndex = metadata.pulse.findIndex((p) => p.pulseID === pulseID);
			if (pulseIndex === -1) {
				console.error(`Pulse with ID ${pulseID} not found`);
				return metadata;
			}

			if (!metadata.pulse[pulseIndex].diagnostics) {
				metadata.pulse[pulseIndex].diagnostics = [];
			}

			metadata.pulse[pulseIndex].diagnostics.push({
				port: new Port(),
				diagnostic: new Thermocouple()
			});

			return metadata;
		});
	}

	function addDIC(pulseID: string) {
		fullMetadata.update((metadata) => {
			const pulseIndex = metadata.pulse.findIndex((p) => p.pulseID === pulseID);
			if (pulseIndex === -1) {
				console.error(`Pulse with ID ${pulseID} not found`);
				return metadata;
			}

			if (!metadata.pulse[pulseIndex].diagnostics) {
				metadata.pulse[pulseIndex].diagnostics = [];
			}

			metadata.pulse[pulseIndex].diagnostics.push({
				port: new Port(),
				diagnostic: new DICConfig()
			});

			return metadata;
		});
	}

	function addCamera(pulseID: string, index: number) {
		fullMetadata.update((metadata) => {
			const pulseIndex = metadata.pulse.findIndex((p) => p.pulseID === pulseID);
			if (pulseIndex === -1) {
				console.error(`Pulse with ID ${pulseID} not found`);
				return metadata;
			}

			if (!metadata.pulse[pulseIndex].diagnostics) {
				console.error(`No diagnostics found for pulse with ID ${pulseID}`);
				return metadata;
			}

			// Check if the diagnostic is a DIC configuration
			if (isThermocouple(metadata.pulse[pulseIndex].diagnostics[index].diagnostic)) {
				console.error(`No camera setup found for diagnostic at index ${index}`);
				return metadata;
			}

			metadata.pulse[pulseIndex].diagnostics[index].diagnostic.cameraSetup.cameras.push({
				cameraInformation: new CameraInformation(),
				lensInformation: new LensInformation(),
				captureSettings: new CaptureSettings()
			});
			return metadata;
		});
	}

	// Function to add a new pulse
	function addPulse() {
		fullMetadata.update((metadata) => {
			const newPulse: HivePulse = {
				...new HivePulse(),
				pulseID: uuidv4()
			};

			metadata.pulse.push(newPulse);
			return metadata;
		});
	}

	function removePulse(index: number) {
		fullMetadata.update((metadata) => {
			metadata.pulse.splice(index, 1);
			return metadata;
		});
	}

	function removeDiagnostic(pulseID: string, index: number) {
		fullMetadata.update((metadata) => {
			const pulseIndex = metadata.pulse.findIndex((p) => p.pulseID === pulseID);
			if (pulseIndex === -1) {
				console.error(`Pulse with ID ${pulseID} not found`);
				return metadata;
			}

			if (metadata.pulse[pulseIndex].diagnostics) {
				metadata.pulse[pulseIndex].diagnostics.splice(index, 1);
			}

			return metadata;
		});
	}

	function removeCamera(pulseID: string, index: number, cameraIndex: number) {
		fullMetadata.update((metadata) => {
			const pulseIndex = metadata.pulse.findIndex((p) => p.pulseID === pulseID);
			if (pulseIndex === -1) {
				console.error(`Pulse with ID ${pulseID} not found`);
				return metadata;
			}

			if (!metadata.pulse[pulseIndex].diagnostics) {
				console.error(`No diagnostics found for pulse with ID ${pulseID}`);
				return metadata;
			}

			// Check if the diagnostic is a DIC configuration
			if (isThermocouple(metadata.pulse[pulseIndex].diagnostics[index].diagnostic)) {
				console.error(`No camera setup found for diagnostic at index ${index}`);
				return metadata;
			}

			metadata.pulse[pulseIndex].diagnostics[index].diagnostic.cameraSetup.cameras.splice(cameraIndex, 1);
			return metadata;
		});
	}

	function isThermocouple(diagnostic: Thermocouple | DICConfig): diagnostic is Thermocouple {
		return (diagnostic as Thermocouple).status !== undefined;
	}

	function updateExpID() {
		currentSaveLocation = PUBLIC_ROOT_FOLDER_LOCATION + '/EXP_' + currentMetadata.experimentID + '/hive_metadata.json';
	}

	onMount(() => {});

	function resetForm() {
		fullMetadata.set(new HiveMetadata());
		currentSaveLocation = `${PUBLIC_ROOT_FOLDER_LOCATION}/EXP_01/hive_metadata.json`;
	}

	async function handleSubmit() {
		try {
			let saveMetadata: SaveMetadata = {
				targetPath: currentSaveLocation,
				metadata: currentMetadata
			};

			const response = await fetch('/api/save-json', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(saveMetadata)
			});

			if (response.ok) {
				alert('Metadata saved successfully!');
			} else {
				const errorData = await response.json();
				alert(`Error saving metadata: ${errorData.message}`);
			}
		} catch (error) {
			console.error('Error:', error);
			alert('An error occurred while saving the metadata.');
		}
	}

	function exportForm() {
		const blob = new Blob([JSON.stringify(currentMetadata, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		const date = new Date();
		const filename = `hive_metadata_${date.toISOString().replace(/[:T]/g, '-').slice(0, -5)}.json`;
		a.download = filename;

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

		URL.revokeObjectURL(url);
	}
</script>

<div class="flex flex-col items-center justify-start min-h-screen bg-neutral p-4 w-full">
	{#if $page.data.session?.user?.email}
		<div class="mt-4 w-full max-w-screen-xl">
			<div class="w-full max-w-screen-xl mt-4">
				<ExpansionPanel open={true} class="hivepanel">
					<div slot="trigger" class="flex-1 p-3">Experiment Information</div>
					<div class="p-4 grid grid-cols-2 gap-4">
						<Field label="Campaign ID">
							<Input placeholder="Campaign identifier" bind:value={currentMetadata.campaignID} />
						</Field>
						<Field label="Experiment ID">
							<Input placeholder="Experiment identifier" bind:value={currentMetadata.experimentID} on:change={() => updateExpID()} />
						</Field>
						<Field label="Lead Investigator First Name">
							<Input placeholder="First name" bind:value={currentMetadata.leadInvestigator.firstName} />
						</Field>
						<Field label="Lead Investigator Last Name">
							<Input placeholder="Last name" bind:value={currentMetadata.leadInvestigator.lastName} />
						</Field>
						<Field label="Lead Investigator Email">
							<Input placeholder="Lead investigator email" bind:value={currentMetadata.leadInvestigator.email} />
						</Field>
						<Field label="Customer">
							<Input placeholder="Customer name" bind:value={currentMetadata.customer} />
						</Field>
						<Field label="Experiment Start">
							<Input type="datetime-local" bind:value={currentMetadata.experimentStart} />
						</Field>
						<Field label="Experiment End">
							<Input type="datetime-local" bind:value={currentMetadata.experimentEnd} />
						</Field>
						<Field label="Experiment Type">
							<Input placeholder="Induction / DC" bind:value={currentMetadata.experimentType} />
						</Field>
						<Field label="Sample Cooling">
							<Input placeholder="True / False" bind:value={currentMetadata.sampleCooling} />
						</Field>
					</div>
					<div>
						<Field label="Save Location">
							<Input placeholder="Save location" bind:value={currentSaveLocation} />
						</Field>
					</div>
				</ExpansionPanel>

				<ExpansionPanel>
					<div slot="trigger" class="flex-1 p-3">Pulse Information</div>
					<div class="p-4 flex flex-col space-y-4">
						{#each currentMetadata.pulse as _, index}
							<ExpansionPanel
								classes={{
									root: 'bg-surface-200 text-surface-content rounded'
								}}
								open={true}
							>
								<div slot="trigger" class="flex-1 p-3">
									Pulse {_.pulseID}
									<Button icon={mdiTrashCan} color="danger" on:click={() => removePulse(index)} />
								</div>
								<div class="p-4 grid grid-cols-2 gap-4">
									<Field label="Pulse ID">
										<Input placeholder="Pulse identifier" bind:value={_.pulseID} />
									</Field>
									<Field label="Operator 1 first name">
										<Input placeholder="First name" bind:value={_.firstOperator.firstName} />
									</Field>
									<Field label="Operator 1 last name">
										<Input placeholder="Last name" bind:value={_.firstOperator.lastName} />
									</Field>
									<Field label="Operator 1 email">
										<Input placeholder="Operator 1 email" bind:value={_.firstOperator.email} />
									</Field>
									<Field label="Operator 2 first name">
										<Input placeholder="First name" bind:value={_.secondOperator.firstName} />
									</Field>
									<Field label="Operator 2 last name">
										<Input placeholder="Last name" bind:value={_.secondOperator.lastName} />
									</Field>
									<Field label="Operator 2 email">
										<Input placeholder="Operator 2 email" bind:value={_.secondOperator.email} />
									</Field>
									<Field label="Pulse Start">
										<Input type="datetime-local" bind:value={_.pulseStart} />
									</Field>
									<Field label="Pulse Duration">
										<Input type="number" placeholder="Duration" bind:value={_.pulseDuration} />
									</Field>
									<Field label="Data Capture Start">
										<Input type="datetime-local" bind:value={_.dataCaptureStart} />
									</Field>
									<Field label="Operator Comment">
										<Input placeholder="Operator comment" bind:value={_.operatorComment} />
									</Field>
									<Field label="Pulse Quality">
										<Input placeholder="Success / Fail" bind:value={_.pulseQuality} />
									</Field>
									<div class="col-span-2">
										<ExpansionPanel>
											<div slot="trigger" class="flex-1 p-3">Coil Information</div>
											<div class="p-4 grid grid-cols-2 gap-4">
												<Field label="Current Type">
													<Input placeholder="AC / DC" bind:value={_.coilInformation.currentType} />
												</Field>
												<Field label="Input Power">
													<Input type="number" bind:value={_.coilInformation.inputPower} />
												</Field>
												<Field label="Input Current">
													<Input type="number" bind:value={_.coilInformation.inputCurrent} />
												</Field>
												<Field label="Input Voltage">
													<Input type="number" bind:value={_.coilInformation.inputVoltage} />
												</Field>
												<Field label="Output Frequency">
													<Input type="number" bind:value={_.coilInformation.outputFrequency} />
												</Field>
												<Field label="Output Power">
													<Input type="number" bind:value={_.coilInformation.outputPower} />
												</Field>
												<Field label="Output Current">
													<Input type="number" bind:value={_.coilInformation.outputCurrent} />
												</Field>
												<Field label="Output Voltage">
													<Input type="number" bind:value={_.coilInformation.outputVoltage} />
												</Field>
											</div>
										</ExpansionPanel>
										<ExpansionPanel>
											<div slot="trigger" class="flex-1 p-3">Coolant Information</div>
											<div class="p-4 grid grid-cols-2 gap-4">
												<Field label="Coolant Type">
													<Input placeholder="Water / Demineralised Water / Treated Water" bind:value={_.coolantInformation.coolantType} />
												</Field>
												<Field label="Coolant Flow Rate">
													<Input placeholder="High / Low" bind:value={_.coolantInformation.coolantFlow.rate} />
												</Field>
												<Field label="Coolant Flow Setpoint">
													<Input type="number" bind:value={_.coolantInformation.coolantFlow.setpoint} />
												</Field>
												<Field label="Coolant Flow Value">
													<Input type="number" bind:value={_.coolantInformation.coolantFlow.value} />
												</Field>
												<Field label="Coolant Flow Variance">
													<Input type="number" bind:value={_.coolantInformation.coolantFlow.variance} />
												</Field>
												<Field label="Coolant Temperature Setpoint">
													<Input type="number" bind:value={_.coolantInformation.coolantTemperature.setpoint} />
												</Field>
												<Field label="Coolant Temperature In">
													<Input type="number" bind:value={_.coolantInformation.coolantTemperature.in} />
												</Field>
												<Field label="Coolant Temperature In Variance">
													<Input type="number" bind:value={_.coolantInformation.coolantTemperature.inVariance} />
												</Field>
												<Field label="Coolant Temperature Out">
													<Input type="number" bind:value={_.coolantInformation.coolantTemperature.out} />
												</Field>
												<Field label="Coolant Temperature Out Variance">
													<Input type="number" bind:value={_.coolantInformation.coolantTemperature.outVariance} />
												</Field>
												<Field label="Coolant Temperature Delta">
													<Input type="number" bind:value={_.coolantInformation.coolantTemperature.delta} />
												</Field>
												<Field label="Coolant Pressure In">
													<Input type="number" bind:value={_.coolantInformation.coolantPressure.in} />
												</Field>
												<Field label="Coolant Pressure Out">
													<Input type="number" bind:value={_.coolantInformation.coolantPressure.out} />
												</Field>
												<Field label="Coolant Pressure Delta">
													<Input type="number" bind:value={_.coolantInformation.coolantPressure.delta} />
												</Field>
											</div>
										</ExpansionPanel>
										<ExpansionPanel>
											<div slot="trigger" class="flex-1 p-3">Diagnostics</div>
											<div class="p-4 grid gap-4">
												{#each _.diagnostics as diagnostic, index}
													<ExpansionPanel
														classes={{
															root: 'bg-surface-200 rounded'
														}}
														open={true}
													>
														<div slot="trigger" class="flex-1 p-3">
															{isThermocouple(diagnostic.diagnostic) ? 'Thermocouple' : 'DIC Configuration'}
															{index + 1}
															<Button icon={mdiTrashCan} color="danger" on:click={() => removeDiagnostic(_.pulseID, index)} />
														</div>
														<div class="p-4 grid gap-4">
															<Field label="Port ID">
																<Input placeholder="Port identifier" bind:value={diagnostic.port.portID} />
															</Field>
															<Field label="Port Description">
																<Input placeholder="Port description" bind:value={diagnostic.port.portDescription} />
															</Field>
															<Field label="Port Size Standard">
																<Input placeholder="Port size standard" bind:value={diagnostic.port.portSizeStandard} />
															</Field>
															{#if isThermocouple(diagnostic.diagnostic)}
																<Field label="Status">
																	<Input placeholder="Active / Failed before test" bind:value={diagnostic.diagnostic.status} />
																</Field>
																<Field label="Attachment">
																	<Input placeholder="e.g., spot weld with inert gas shield" bind:value={diagnostic.diagnostic.attachment} />
																</Field>
																<Field label="TC Type">
																	<Input placeholder="e.g., K" bind:value={diagnostic.diagnostic.tcType} />
																</Field>
																<Field label="Location">
																	<Input placeholder="X, Y, Z coordinates" bind:value={diagnostic.diagnostic.location} />
																</Field>
																<Field label="Area Type">
																	<Input placeholder="e.g., Circular" bind:value={diagnostic.diagnostic.areaType} />
																</Field>
																<Field label="Circle Diameter">
																	<Input placeholder="Diameter in mm" type="number" bind:value={diagnostic.diagnostic.circleDiameter} />
																</Field>
																<Field label="Noise Floor">
																	<Input placeholder="Noise details" bind:value={diagnostic.diagnostic.noiseFloor} />
																</Field>
															{:else}
																<Field label="Configuration">
																	<Input placeholder="e.g., Stereo (symmetric)" bind:value={diagnostic.diagnostic.setupInformation.configuration} />
																</Field>
																<Field label="Stereo Angle">
																	<Input placeholder="Angle in degrees" type="number" bind:value={diagnostic.diagnostic.setupInformation.stereoAngle} />
																</Field>
																<Field label="Stand Off Distance">
																	<Input placeholder="Distance in meters" type="number" bind:value={diagnostic.diagnostic.setupInformation.standOffDistance} />
																</Field>
																<Field label="Imaged Surface on Specimen">
																	<Input placeholder="e.g., XY plane" bind:value={diagnostic.diagnostic.setupInformation.imagedSurfaceOnSpecimen} />
																</Field>
																<Field label="Software Name">
																	<Input placeholder="Software used" bind:value={diagnostic.diagnostic.softwareInformation.softwareName} />
																</Field>
																<Field label="Software Version">
																	<Input placeholder="Software version" bind:value={diagnostic.diagnostic.softwareInformation.softwareVersion} />
																</Field>
																<Field label="Pattern Technique">
																	<Input placeholder="Pattern technique" bind:value={diagnostic.diagnostic.additionalInformation.patternTechnique} />
																</Field>
																<Field label="Pattern Background">
																	<Input placeholder="Pattern background" bind:value={diagnostic.diagnostic.additionalInformation.patternBackground} />
																</Field>
																<Field label="Pattern Speckle">
																	<Input placeholder="Pattern speckle" bind:value={diagnostic.diagnostic.additionalInformation.patternSpeckle} />
																</Field>
																<Field label="Approx Feature Size">
																	<Input placeholder="Feature size in mm" type="number" bind:value={diagnostic.diagnostic.additionalInformation.approxFeatureSize} />
																</Field>
																<Field label="Cal Target Make">
																	<Input placeholder="Calibration target make" bind:value={diagnostic.diagnostic.additionalInformation.calTargetMake} />
																</Field>
																<Field label="Cal Target Dims">
																	<Input placeholder="Calibration target dimensions" bind:value={diagnostic.diagnostic.additionalInformation.calTargetDims} />
																</Field>
																<Field label="Cal Target Spacing">
																	<Input placeholder="Calibration target spacing" bind:value={diagnostic.diagnostic.additionalInformation.calTargetSpacing} />
																</Field>
																<Field label="Comment">
																	<Input placeholder="Comment" bind:value={diagnostic.diagnostic.cameraSetup.comment} />
																</Field>
																{#each diagnostic.diagnostic.cameraSetup.cameras as camera, cameraIndex}
																	<ExpansionPanel>
																		<div slot="trigger" class="flex-1 p-3">
																			Camera {cameraIndex + 1}
																			<Button icon={mdiTrashCan} color="danger" on:click={() => removeCamera(_.pulseID, index, cameraIndex)} />
																		</div>
																		<div class="p-4 grid gap-4">
																			<Field label="Make">
																				<Input placeholder="Camera make" bind:value={camera.cameraInformation.make} />
																			</Field>
																			<Field label="Model">
																				<Input placeholder="Camera model" bind:value={camera.cameraInformation.model} />
																			</Field>
																			<Field label="Serial Number">
																				<Input placeholder="Camera serial number" bind:value={camera.cameraInformation.serialNumber} />
																			</Field>
																			<Field label="Resolution X">
																				<Input placeholder="Resolution in pixels" bind:value={camera.cameraInformation.resolutionX} />
																			</Field>
																			<Field label="Resolution Y">
																				<Input placeholder="Resolution in pixels" bind:value={camera.cameraInformation.resolutionY} />
																			</Field>
																			<Field label="Lens Make">
																				<Input placeholder="Lens make" bind:value={camera.lensInformation.make} />
																			</Field>
																			<Field label="Lens Model">
																				<Input placeholder="Lens model" bind:value={camera.lensInformation.model} />
																			</Field>
																			<Field label="Lens Serial Number">
																				<Input placeholder="Lens serial number" bind:value={camera.lensInformation.serialNumber} />
																			</Field>
																			<Field label="Focal Length">
																				<Input placeholder="Focal length in mm" bind:value={camera.lensInformation.focalLength} />
																			</Field>
																			<Field label="Aperture">
																				<Input placeholder="Aperture" bind:value={camera.lensInformation.aperture} />
																			</Field>
																			<Field label="Field of View X">
																				<Input placeholder="Field of view in mm" bind:value={camera.lensInformation.fieldOfViewX} />
																			</Field>
																			<Field label="Field of View Y">
																				<Input placeholder="Field of view in mm" bind:value={camera.lensInformation.fieldOfViewY} />
																			</Field>
																			<Field label="Image Acquisition Rate">
																				<Input placeholder="Rate in Hz" bind:value={camera.captureSettings.imageAcquisitionRate} />
																			</Field>
																			<Field label="Image Noise">
																				<Input placeholder="Noise percentage" bind:value={camera.captureSettings.imageNoise} />
																			</Field>
																			<Field label="Image Scale">
																				<Input placeholder="Scale in mm/pixel" bind:value={camera.captureSettings.imageScale} />
																			</Field>
																		</div>
																	</ExpansionPanel>
																{/each}
																<div class="button-center">
																	<Button icon={mdiPlus} variant="fill" size="lg" on:click={() => addCamera(_.pulseID, index)}>Add Camera</Button>
																</div>
															{/if}
														</div>
													</ExpansionPanel>
												{/each}
												<div class="button-center">
													<Button icon={mdiPlus} variant="fill" size="lg" on:click={() => addThermocouple(_.pulseID)}>Add Thermocouple</Button>
													<Button icon={mdiPlus} variant="fill" size="lg" on:click={() => addDIC(_.pulseID)}>Add DIC</Button>
												</div>
											</div>
										</ExpansionPanel>
									</div>
								</div>
							</ExpansionPanel>
						{/each}
					</div>
					<div class="button-center">
						<Button icon={mdiPlus} variant="fill" size="lg" on:click={() => addPulse()}>Add Pulse</Button>
					</div>
				</ExpansionPanel>
			</div>
		</div>
		<div class="button-group w-full max-w-screen-xl">
			<div class="left-buttons">
				<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" on:click={exportForm}>Download</button>
			</div>
			<div class="right-buttons">
				<button class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600" on:click={resetForm}>Reset</button>
				<button class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" on:click={handleSubmit}>Submit</button>
			</div>
		</div>
	{:else}
		<div class="loginsection">
			<h1 class="text-2xl font-bold">Sign in to access this tool</h1>
			<User data={{ user: data?.session?.user, status: Boolean(data?.session) }} />
		</div>
	{/if}
</div>

<style>
	/* :global(.hivepanel) {
		background-color: gray;
	} */

	/* :global(.hivepanel .input) {
		background-color: gray;
	} */

	.button-center {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10px;
	}

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

	.loginsection {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 50px;
	}
</style>
