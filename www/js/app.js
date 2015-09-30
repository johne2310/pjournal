// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js


var pjournal = angular.module('pjournal', ['ionic',
                                           'about.controller',
                                           'prayer.controller',
                                           'list.controller',
                                           'settings.controller',
                                           'menu.controller',
                                           'ionic-datepicker',
                                           'ngJustGage']);

pjournal.run(function ($ionicPlatform, journalStore) {
    $ionicPlatform.ready(function () {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
        journalStore.initDB();

    });
});

pjournal.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'views/menu/menu.html',
        controller: 'menuCtrl'
    })

    .state('app.journal', {
        url: '/journal',
        views: {
            'menuContent': {
                templateUrl: 'views/journal/journal.html',
                controller: 'journalCtrl as vm'
            }
        }
    })

    .state('app.journalDetail', {
        url: '/journalDetail',
        views: {
            'menuContent': {
                templateUrl: 'views/journal/journal.html',
                controller: 'journalCtrl as vm'
            }
        }
    })

    .state('app.lists', {
        url: '/lists',
        views: {
            'menuContent': {
                templateUrl: 'views/lists/lists.html',
                controller: 'listCtrl'
            }
        }
    })

    .state('app.prayer', {
        url: '/prayer',
        views: {
            'menuContent': {
                templateUrl: 'views/prayer/prayer.html',
                controller: 'prayerCtrl'
            }
        }
    })

    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'views/settings/settings.html',
                controller: 'settingsCtrl'
            }
        }
    })

    .state('app.about', {
        url: '/about',
        views: {
            'menuContent': {
                templateUrl: 'views/about/about.html',
                controller: 'journalCtrl'
            }
        }

    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/journal');
});
