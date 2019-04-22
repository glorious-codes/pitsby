describe('Topbar', () => {
  let compile;

  beforeEach(() => {
    angular.mock.module('pitsby-app');
    inject(($rootScope, $compile) => {
      compile = () => {
        const scope = $rootScope.$new(true);
        const template = '<p-topbar />';
        const element = $compile(template)(scope);
        scope.$digest();
        return element;
      };
    });
  });

  it('should have appropriate css class', () => {
    const element = compile();
    expect(element.find('div').attr('class')).toEqual('p-topbar');
  });

  it('should contain a engine menu', () => {
    const element = compile();
    const engineMenu = element[0].querySelectorAll('p-engine-menu');
    expect(engineMenu.length).toEqual(1);
  });
});
