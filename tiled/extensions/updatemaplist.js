/** 
 * Checks all the existing maps in the same folder than the map that is being saved right now, and 
 * updates maps.json, which contains all maps in the game. This triggers Parcel's rebuild process.
 */
tiled.assetSaved.connect(function(asset) {
	const mapfileName = asset.fileName;
	const mapsFolder = mapfileName.slice(0, mapfileName.lastIndexOf('/') + 1);

	const lastXRoom = 10;
	const lastYRoom = 50;

	let content = {};

	for (let x = 0; x < lastXRoom; x++) {
		for (let y = 0; y < lastYRoom; y++) {
			let fileName = x + '-' + y + '.json';

			try {
				const file = new TextFile(mapsFolder + fileName, TextFile.ReadOnly);
				const fileContents = file.readAll();
				const fileObject = JSON.parse(fileContents);
				content[x + '_' + y] = fileObject;
			} catch (error) {
				// Map doesn't exist
			}
		}
	}

	tiled.log(Object.keys(content).length + ' maps found. Updating maps.json...');

	const allMapsFilePath = mapsFolder + '../../assets/maps.json';
	const allMapsFile = new TextFile(allMapsFilePath, TextFile.ReadWrite);
	allMapsFile.truncate();
	allMapsFile.write(JSON.stringify(content, null, 2));
	allMapsFile.commit();

	tiled.log('Done');
})
