const fs = require('fs');
const path = require('path');
const pkg = require('../../../package.json');
const processService = require('./process');
const { fileService } = require('./file');
const webappHtmlIndexGenerator = require('./webapp-html-index-generator');
const indexTemplate = fs.readFileSync(path.join(__dirname, '../../webapp/index-template.html'), 'utf-8');

describe('Webapp HTML Index Generator', () => {
  function mockOptions(){
    return {
      styles: ['https://some.lib.com/from/cdn.min.css', './dist/css/main.css'],
      scripts: ['https://some.lib.com/from/cdn.min.js', 'dist/scripts/main.js']
    };
  }

  function mockProjects(){
    return [{engine: 'angular'}];
  }

  function getAngularVersion(){
    return pkg.devDependencies.angular.replace('^','');
  }

  beforeEach(() => {
    fileService.readSync = jest.fn(() => indexTemplate);
    fileService.write = jest.fn();
    processService.getNodeEnv = jest.fn(() => 'development');
    Date.now = jest.fn(() => 123);
  });

  it('should include external assets on template', () => {
    webappHtmlIndexGenerator.init(mockOptions(), mockProjects());
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/index.html'), `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">
    <link href="https://some.lib.com/from/cdn.min.css?t=123" rel="stylesheet">
<link href="external/dist/css/main.css?t=123" rel="stylesheet">
  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>
    <script src="https://some.lib.com/from/cdn.min.js?t=123"></script>
<script src="external/dist/scripts/main.js?t=123"></script>
  </body>
</html>
`);
  });

  it('should not include any external assets if no assets have been given', () => {
    webappHtmlIndexGenerator.init(undefined, mockProjects());
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/index.html'), `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>

  </body>
</html>
`);
  });

  it('should include vue script tag if a vue project has been given', () => {
    const projects = mockProjects();
    projects.push({engine: 'vue'});
    webappHtmlIndexGenerator.init({}, projects);
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/index.html'), `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.js"></script>
  </body>
</html>
`);
  });

  it('should use vue version 2.5.13 if no custom vue version has been given', () => {
    const projects = mockProjects();
    projects.push({engine: 'vue'});
    webappHtmlIndexGenerator.init({}, projects);
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/index.html'), `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.13/vue.js"></script>
  </body>
</html>
`);
  });

  it('should use custom vue version if custom vue version has been given', () => {
    const projects = mockProjects();
    projects.push({engine: 'vue', version: '2.6.0'});
    webappHtmlIndexGenerator.init({}, projects);
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/index.html'), `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.0/vue.js"></script>
  </body>
</html>
`);
  });

  it('should not include vue script tag if no projects have been given', () => {
    webappHtmlIndexGenerator.init();
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/index.html'), `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.js"></script>

  </body>
</html>
`);
  });

  it('should include minified component engine script tags if environment id production', () => {
    const projects = mockProjects();
    projects.push({engine: 'vue', version: '2.6.0'});
    processService.getNodeEnv = jest.fn(() => 'production');
    webappHtmlIndexGenerator.init({}, projects);
    expect(fileService.write).toHaveBeenCalledWith(
      path.join(__dirname, '../../webapp/index.html'), `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Pitsby</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=yes">
    <meta http-equiv="cache-control" content="no-cache">
    <meta http-equiv="cache-control" content="max-age=0">
    <meta http-equiv="expires" content="0">
    <meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT">
    <meta http-equiv="pragma" content="no-cache">

  </head>
  <body ng-app="pitsby-app">
    <ui-view></ui-view>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/${getAngularVersion()}/angular.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.0/vue.min.js"></script>
  </body>
</html>
`);
  });
});
