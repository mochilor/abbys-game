/** 
 * Checks all the existing maps in the same folder thatn the map that is being saved right now, and 
 * updates maplist.json, used to dinamically load maps in Preload scene. This triggers Parcel's 
 * rebuild process.
 */
tiled.assetSaved.connect(function(asset) {
	const mapfileName = asset.fileName;
	const mapsFolder = mapfileName.slice(0, mapfileName.lastIndexOf('/') + 1);
	
	const mapsList = {};

	const lastXRoom = 10;
	const lastYRoom = 50;

	for (let x = 0; x < lastXRoom; x++) {
		for (let y = 0; y < lastYRoom; y++) {
			let fileName = x + '-' + y + '.json';

			try {
				new TextFile(mapsFolder + fileName, TextFile.ReadOnly);
				mapsList[x + '_' + y] = fileName;
			} catch (error) {
				// Map doesn't exist
			}
		}
	}

	tiled.log(Object.keys(mapsList).length + ' maps found. Updating maplist.json...');

	const maplistFilePath = mapsFolder + '../../assets/maplist.json';
	const maplistFile = new TextFile(maplistFilePath, TextFile.ReadWrite);
	maplistFile.truncate();
	maplistFile.write(JSON.stringify(mapsList, null, 2));
	maplistFile.commit();

	tiled.log('Done');
})
