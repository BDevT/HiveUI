import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFile, access, constants } from 'fs/promises';
import { join, resolve, relative, normalize, basename, dirname, extname } from 'path';
import { PUBLIC_ROOT_FOLDER_LOCATION } from '$env/static/public';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const jsonData = await request.json();
    if (!jsonData || typeof jsonData !== 'object' || !jsonData.targetPath) {
      return json({ success: false, message: 'Invalid JSON structure' }, { status: 400 });
    }

    const rootFolder = PUBLIC_ROOT_FOLDER_LOCATION;
    if (!rootFolder) {
      throw new Error('PUBLIC_ROOT_FOLDER_LOCATION is not set');
    }

    const targetPath = normalize(jsonData.targetPath);
    const absoluteTargetPath = resolve(rootFolder, targetPath);

    // Check if the target path is within the root folder
    if (!absoluteTargetPath.startsWith(resolve(rootFolder))) {
      return json({ success: false, message: 'Invalid target path' }, { status: 403 });
    }

    // Determine the filename and directory
    let fileName, directory;
    if (extname(absoluteTargetPath).toLowerCase() === '.json') {
      fileName = basename(absoluteTargetPath);
      directory = dirname(absoluteTargetPath);
    } else {
      fileName = `hive_metadata_${Date.now()}.json`;
      directory = absoluteTargetPath;
    }

    try {
      await access(directory, constants.W_OK);
    } catch (error) {
      return json({ success: false, message: 'Target directory does not exist or is not writable' }, { status: 403 });
    }

    const filePath = join(directory, fileName);
    const { targetPath: _, ...dataToSave } = jsonData;
    const jsonString = JSON.stringify(dataToSave, null, 2);

    await writeFile(filePath, jsonString);

    const relativePath = relative(rootFolder, filePath);

    return json({ 
      success: true, 
      message: 'JSON object saved successfully',
      path: relativePath
    });

  } catch (error) {
    console.error('Error saving JSON object:', error);
    return json({ success: false, message: 'Error saving JSON object' }, { status: 500 });
  }
};