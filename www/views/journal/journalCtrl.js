(function () {


    angular
        .module('pjournal')
        .controller('journalCtrl', ['$scope', '$q', '$ionicModal', '$ionicPopup', 'journalStore', '$state', journalCtrl]);

    function journalCtrl($scope, $q, $ionicModal, $ionicPopup, journalStore, $state) {

        var vm = this;

        vm.journals = [];
        //get data
        journalStore.getAllJournals().then(function (data) {

            vm.journals = data;
            console.log('Journals data = ', vm.journals);

        }).catch(function (error) {

            console.log('An error has occured: ', error);

        });


        //initialise journal object
        //TODO change to PouchDB once mock is complete
        //        this.journal = {
        //            date: '',
        //            notes: '',
        //            physical: '',
        //            emotional: '',
        //            spiritual: ''
        //        };


        //TODO move to factory
        //function to make text area grow with content
        $scope.expandText = function () {
            var element = document.getElementById("journalId");
            element.style.height = element.scrollHeight + "px";

            var element2 = document.getElementById("journalId2");
            element2.style.height = element2.scrollHeight + "px";
        };


        var p; //variable for physical gauge
        var e; //variable for emotional gauge
        var s; //variable for spirutal gauge

        //set Life Levels in click saveJournal
        $scope.setLifeLevels = function () {

            //set physical Life Level
            if (vm.journal.physical > 0) {
                p = new JustGage({
                    id: "physical",
                    value: vm.journal.physical,
                    min: 0,
                    max: 100,
                    title: "Physical",
                    levelColors: ['#ff0505', '#ff8408', '#25b010'],
                    levelGradiant: false,
                });
                console.log('p value is ', p.id);
            }

            //set emotional Life level
            if ($scope.journal.emotional > 0) {
                e = new JustGage({
                    id: "emotional",
                    value: $scope.journal.emotional,
                    min: 0,
                    max: 100,
                    title: "Emotional",
                    levelColors: ['#ff0505', '#ff8408', '#25b010'],
                    levelGradiant: false
                });
            }

            //set spiritual Life Level
            if ($scope.journal.spiritual > 0) {
                s = new JustGage({
                    id: "spiritual",
                    value: $scope.journal.spiritual,
                    min: 0,
                    max: 100,
                    title: "Spiritual",
                    levelColors: ['#ff0505', '#ff8408', '#25b010'],
                    levelGradiant: false
                });
            }
        };

        //set modal details
        $ionicModal.fromTemplateUrl('views/journal/journal_modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });

        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        //Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
        // Execute action on hide modal
        $scope.$on('modal.hidden', function () {
            // Execute action
            //        $scope.setLevelText();

        });
        // Execute action on remove modal
        $scope.$on('modal.removed', function () {
            // Execute action
        });
        //end modal

        //start addJournal function
        vm.addJournal = function () {
            console.log('Adding journal');
            $scope.journal = {
                date: new Date(),
                physical: '',
                emotional: '',
                spiritual: '',
            };
            $scope.action = 'Add';
            $scope.isAdd = true;
            $scope.modal.show();
        };

        //start editJournal function
        $scope.editJournal = function () {
            $scope.journal = angular.copy($scope.journal);
            $scope.action = 'Edit';
            $scope.isAdd = false;
            $scope.modal.show();
        };


        $scope.saveJournal = function () {

            if ($scope.isAdd) {
                console.log('Starting save function');

                if (!$scope.journal.date) {
                    $ionicPopup.alert({
                        title: 'Prayer Journal Alert',
                        template: 'Please enter a valid date.'
                    });
                } else if (isNaN($scope.journal.physical) || $scope.journal.physical < 0 || $scope.journal.physical > 100) {
                    $ionicPopup.alert({
                        title: 'Prayer Journal Alert',
                        template: 'Please enter a valid number for the Physical Life Level.'
                    });
                } else if (isNaN($scope.journal.emotional) || $scope.journal.emotional < 0 || $scope.journal.emotional > 100) {
                    $ionicPopup.alert({
                        title: 'Prayer Journal Alert',
                        template: 'Please enter a valid number for the Emotional Life Level.'
                    });
                } else if (isNaN($scope.journal.spiritual) || $scope.journal.spiritual < 0 || $scope.journal.spiritual > 100) {
                    $ionicPopup.alert({
                        title: 'Prayer Journal Alert',
                        template: 'Please enter a valid number for the Spirtual Life Level.'
                    });
                } else {
                    $scope.journal._id = new Date().getTime().toString();
                    console.log('New Journal entry is ', $scope.journal);
                    journalStore.addJournal($scope.journal);
                    //                    $scope.setLifeLevels();
                    //                    $state.go('app.journalDetail');
                    $scope.modal.hide();
                }
            } else {
                if (!$scope.journal.date) {
                    $ionicPopup.alert({
                        title: 'Prayer Journal Alert',
                        template: 'Please enter a valid date.'
                    });
                } else if (isNaN($scope.journal.physical) || $scope.journal.physical < 0 || $scope.journal.physical > 100) {
                    $ionicPopup.alert({
                        title: 'Prayer Journal Alert',
                        template: 'Please enter a valid number for the Physical Life Level.'
                    });
                } else if (isNaN($scope.journal.emotional) || $scope.journal.emotional < 0 || $scope.journal.emotional > 100) {
                    $ionicPopup.alert({
                        title: 'Prayer Journal Alert',
                        template: 'Please enter a valid number for the Emotional Life Level.'
                    });
                } else if (isNaN($scope.journal.spiritual) || $scope.journal.spiritual < 0 || $scope.journal.spiritual > 100) {
                    $ionicPopup.alert({
                        title: 'Prayer Journal Alert',
                        template: 'Please enter a valid number for the Spirtual Life Level.'
                    });
                } else {
                    console.log('Returning from edit');
                    if ($scope.journal.physical) {
                        p.refresh($scope.journal.physical);
                    }
                    if ($scope.journal.emotional) {
                        e.refresh($scope.journal.emotional);
                    }
                    if ($scope.journal.spiritual) {
                        s.refresh($scope.journal.spiritual);
                    }
                    journalStore.updateJournal($scope.journal);
                    $scope.modal.hide();
                }
            }
        };

        $scope.cancelJournal = function () {
            if ($scope.isAdd) {
                $scope.journal.date = '';
                $scope.modal.hide();
            } else {
                $scope.modal.hide();
            }
        };
    }

    //    .service('myService', myService);
    //
    //    function myService() {
    //
    //        return {
    //            setValue: function () {
    //                //set filter name to pass from list to detail view
    //                var pValue = '33';
    //                return pValue;
    //            }
    //        };
    //    }

})();
