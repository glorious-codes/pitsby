const path = require('path');
const assetsFilepathFilter = require('./assets-filepath-filter');
const { fileService } = require('./file');

const _public = {};

_public.init = (clientDirectory, assets) => {
  return Promise.all([
    collectAssets(clientDirectory, assetsFilepathFilter.getRelative(assets.styles)),
    collectAssets(clientDirectory, assetsFilepathFilter.getRelative(assets.scripts))
  ]);
};

function collectAssets(clientDirectory, filepaths){
  return new Promise(resolve => {
    filepaths.forEach(filepath => {
      fileService.read(path.join(clientDirectory, filepath), data => {
        onCollectAssetsSuccess(filepath, data);
        resolve();
      });
    });
  });
}

function onCollectAssetsSuccess(filepath, data){
  fileService.write(path.join(getExternalAssetsDirectory(), filepath), data);
}

function getExternalAssetsDirectory(){
  return path.join(__dirname, '../../webapp/external');
}

module.exports = _public;
