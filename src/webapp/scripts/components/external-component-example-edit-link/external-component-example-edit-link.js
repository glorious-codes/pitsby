import '@styles/external-component-example-edit-link.styl';
import playgroundCodeSearchParamService from '@scripts/services/playground-code-search-param';
import codeIndentationService from '@scripts/services/code-indentation';
import vueControllerSyntaxService from '@scripts/services/vue-controller-syntax';
import template from './external-component-example-edit-link.html';

function controller(routeService){
  const $ctrl = this;

  $ctrl.goToPlayground = () => {
    routeService.go('app.external-components.playground', {
      code: buildPlaygroundCode($ctrl.engine, $ctrl.example),
      source: 'edit-link'
    });
  };

  function buildPlaygroundCode(engine, { template, controller, styles }){
    return playgroundCodeSearchParamService.stringify(
      formatCode(template),
      getControllerFormatter(engine)(controller),
      formatCode(styles)
    );
  }

  function getControllerFormatter(engine){
    return {
      vue: formatVueController,
      angular: formatAngularController,
      vanilla: formatVanillaController
    }[engine] || formatCode;
  }

  function formatVueController(code){
    const ctrl = code ? vueControllerSyntaxService.stringify(code) : buildBlankVueController();
    return `return ${ctrl};`;
  }

  function buildBlankVueController(){
    return '{\n  data(){\n    return {};\n  },\n  "methods":{}\n}';
  }

  function formatAngularController(code = buildBlankAngularController()){
    return `${handleTopLevelFunction(handleAngularDependencies(code))}\n\nreturn controller;`;
  }

  function buildBlankAngularController(){
    return 'function controller(){\n  const $ctrl = this;\n}';
  }

  function handleAngularDependencies(code){
    const regex = new RegExp(/^.*\((.*)\)\s?{\n/);
    const dependencies = regex.exec(code)[1].split(',').map(dep => {
      if(dep) return `'${dep}'`;
    });
    return `${code}\n\ncontroller.$inject = [${dependencies.join(', ')}];`;
  }

  function formatVanillaController(code = 'function controller(element){}'){
    return `${handleTopLevelFunction(code)}\n\nreturn controller;`;
  }

  function handleTopLevelFunction(code, engine){
    if(isAnonymousTopLevelFunction(code) && engine != 'react') return nameControllerFunction(code);
    return formatCode(code);
  }

  function isAnonymousTopLevelFunction(code){
    return buildAnonymousTopLevelFunctionRegex().test(code);
  }

  function nameControllerFunction(code){
    return formatCode(code.replace(buildAnonymousTopLevelFunctionRegex(), 'function controller($1){\n'));
  }

  function buildAnonymousTopLevelFunctionRegex(){
    return new RegExp(/^function\s?\((.*)\)\s?\{\n/);
  }

  function formatCode(code){
    return code && codeIndentationService.normalize(code) || '\n';
  }
}

controller.$inject = ['routeService'];

export default {
  bindings: {
    engine: '@',
    example: '<'
  },
  controller,
  template
};
