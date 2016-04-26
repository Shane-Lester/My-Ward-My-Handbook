angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})


.controller('TodoListController',["$scope","NoteStore",function($scope,NoteStore){


    $scope.notes= NoteStore.list();

    $scope.remove = function(noteId){
      NoteStore.remove(noteId);
    };

}])

.controller('EditListController',["$scope", "NoteStore", "$state", "$stateParams", function($scope,NoteStore, $state, $stateParams){


    var ID=$stateParams.noteId;
    $scope.note = angular.copy(NoteStore.get(ID));

    $scope.save =function(){
        NoteStore.update($scope.note);
        $state.go('app.todolist')
    };


}])

.controller('AddListController',["$scope", "$state", "NoteStore", function($scope, $state , NoteStore){
    $scope.note = {
        id: new Date().getTime().toString(),
        title: '',
        description: ''
        };

    $scope.save =function(){
        NoteStore.create($scope.note);
        $state.go('app.todolist')
    };
}])



.controller('ListController',["$scope", "$http", "$state", "$stateParams","$localstorage","$ionicHistory","Data", function($scope, $http, $state, $stateParams,$localstorage,$ionicHistory,Data){

    $scope.data={
        hideImage: true,
        showReorder: false
    }
    Data.initialize();

    console.log(Data.getSettings());

    $scope.makeURL=function(){
        var URLObject=Data.makeURL();
        $scope.clinicalURL= URLObject.clinical;
        $scope.departmentURL= URLObject.department;
        $localstorage.setObject('settings',URLObject);
            }

    $scope.makeURL();
    $scope.resetDefaultData = function(){
      //blank at the moment to keep everything tidy
    }

    $http.get($scope.clinicalURL,{cache:true})
        .success(function(data){
            if(data.clinical){
                $scope.clinicals=data.clinical;
                }
            //if no clinical key then load default
            else{
                console.log('no clinical key');
                $scope.resetDefaultData('clinical');
                $ionicHistory.clearCache().then(function(){

                      $state.go('app.home',{},{reload:true});
                        })
                    }
              })
        .error(function(data){
                console.log('load failed');
                $scope.resetDefaultData('clinical');
                $ionicHistory.clearCache().then(function(){

                      $state.go('app.home',{},{reload:true});
                        })
        });

    $http.get($scope.departmentURL,{cache:true})
        .success(function(data){
            if (data.department){
                $scope.department=data.department;
                }
                    //if no department key then load default
            else{
                $scope.resetDefaultData('department');
                $ionicHistory.clearCache().then(function(){

                      $state.go('app.home',{},{reload:true});
                        })
                    }
        })
        .error(function(data){
                console.log('dept load failed');
                $scope.resetDefaultData('department');
                $ionicHistory.clearCache().then(function(){

                      $state.go('app.home',{},{reload:true});
                        })
        });

        $scope.whichCondition=$stateParams.aId;
}])

.controller('SettingsController',
["$scope", "NoteStore", "$state", "$stateParams","$localstorage","$ionicHistory", "Data",
function($scope,NoteStore, $state, $stateParams,$localstorage,$ionicHistory,Data){
    $scope.$on('$ionicView.enter', function(){
      $scope.buttonColour = $scope.clinicalButtonColour = $scope.departmentButtonColour = "button-positive";
      $scope.rootText = "Set root web address";
      $scope.departmentButtonText = "Load Department Data";
      $scope.clinicalButtonText = "Load Clinical Data";
  });

    $scope.setRoot = function(root, specialty){
      var newData =Data.getSettings();
      if(root.length>0 && root.indexOf('www') == -1){
        //ensure root isn't empty and doesnt' start with www
        root = "http://www." + root + "/" + specialty + "/docs";
        newData.root = root;
        newData.clinical = root + "/clinical.json";
        newData.department = root + "/department.json";
        Data.storeSettings(newData);
        $scope.buttonColour= "button-balanced";
        $scope.rootText = "ROOT SET!";

        return true;
      }
      return false;
    }

    $scope.loadDepartmentData = function(){
      console.log('not yet implemented loadDepartmentData');
      $scope.departmentButtonText = "Department Data LOADED";
      $scope.departmentButtonColour = "button-balanced";
    }
    $scope.loadClinicalData = function(){
      console.log('not yet implemented loadClinicalData');
      $scope.clinicalButtonText = "Clinical Data LOADED";
      $scope.clinicalButtonColour = "button-balanced";
    }

    $scope.goHome=function(){
       $ionicHistory.nextViewOptions({
            disableBack: true
        });
        $ionicHistory.clearCache().then(
            function(){
                $state.go('app.home');
            }
        )

    }


}]);
