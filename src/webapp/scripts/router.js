import routes from '@scripts/constants/routes';

function router($stateProvider, $urlRouterProvider) {
  routes.forEach(route => {
    $stateProvider.state(route);
  });
  $urlRouterProvider.otherwise('/');
}

export default router;