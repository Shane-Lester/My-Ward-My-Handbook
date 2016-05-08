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


.controller('TodoListController', ["$scope", "NoteStore", function($scope, NoteStore) {


  $scope.notes = NoteStore.list();

  $scope.remove = function(noteId) {
    NoteStore.remove(noteId);
  };

}])

.controller('EditListController', ["$scope", "NoteStore", "$state", "$stateParams", function($scope, NoteStore, $state, $stateParams) {


  var ID = $stateParams.noteId;
  $scope.note = angular.copy(NoteStore.get(ID));

  $scope.save = function() {
    NoteStore.update($scope.note);
    $state.go('app.todolist')
  };


}])

.controller('AddListController', ["$scope", "$state", "NoteStore", function($scope, $state, NoteStore) {
  $scope.note = {
    id: new Date().getTime().toString(),
    title: '',
    description: ''
  };

  $scope.save = function() {
    NoteStore.create($scope.note);
    $state.go('app.todolist')
  };
}])



.controller('ListController', ["$scope", "$http", "$state", "$stateParams", "$localstorage", "$ionicHistory", "Data", function($scope, $http, $state, $stateParams, $localstorage, $ionicHistory, Data) {

  $scope.data = {
    hideImage: true,
    showReorder: false
  }
  var loadedClinicalData;
  var loadedDepartmentData;

  loadedClinicalData = Data.getClinicalData();
  if (loadedClinicalData.clinical) {
    //only add it to the scope if there is a clinical key, otherwise carry on with the same data
    $scope.clinicals = loadedClinicalData.clinical;
  }
  loadedDepartmentData = Data.getDepartmentData();
  if (loadedDepartmentData.department) {
    //same as for clinical
    $scope.department = loadedDepartmentData.department;
  }
  $scope.whichCondition = $stateParams.aId;

}])

.controller('SettingsController', ["$scope", "NoteStore", "$state", "$stateParams", "$localstorage", "$ionicHistory", "Data", "$ionicLoading", "$ionicHistory",
  function($scope, NoteStore, $state, $stateParams, $localstorage, $ionicHistory, Data, $ionicLoading, $ionicHistory) {
    var newData;
    $scope.cached = {now:true};
    $scope.$on('$ionicView.enter', function() {
      $scope.buttonColour = $scope.clinicalButtonColour = $scope.departmentButtonColour = "button-positive";
      $scope.rootText = "Set root web address";
      $scope.departmentButtonText = "Load Department Data";
      $scope.clinicalButtonText = "Load Clinical Data";
      $scope.httpLabel = "http://www.";
      newData = Data.getSettings();
      if (newData) {
        root = $scope.root = newData.root;
        specialty = $scope.specialty = newData.specialty;
        if (newData.root && newData.root.indexOf('www') > -1) {
          $scope.httpLabel = ""; //hide httpLabel when the root is created with www at the start
        }
      }

    });


    $scope.setRoot = function(root, specialty) {
      console.log("setRoot function");
      if (!root || !specialty) {
        console.log('error');
        return false;
      }
      if (root.indexOf('www') == -1 && root != "js") {
        //ensure root isn't empty and doesnt' start with www -so want to add www to it
        console.log("setting root with www");
        root = "http://www." + root;
        $scope.httpLabel = "";
      }
      newData.root = root;
      newData.specialty = specialty;
      Data.storeSettings(newData);
      $scope.buttonColour = "button-balanced";
      $scope.rootText = "ROOT SET!";
      $scope.departmentButtonText = "Load Department Data";
      $scope.departmentButtonColour = 'button-positive';
      $scope.clinicalButtonColour = 'button-positive';
      $scope.clinicalButtonText = "Load Clinical Data";
      $scope.rootSet = true;

      return true;
    }

    $scope.loadDepartmentData = function() {
      newData = Data.getSettings();
      if (!newData || !newData.root || !newData.specialty){
        return
      }
      newData.department = newData.root + "/" + newData.specialty + "/docs" + "/department.json";
      $ionicLoading.show({
        template: 'Loading Department Data'
      });
      Data.loadDepartmentData(newData.department, $scope.cached.now).then(function(data) {
        if (data.department) {
          Data.storeSettings(newData);
          $scope.departmentButtonText = "Department Data LOADED";
          $scope.departmentButtonColour = "button-balanced";
        }


        if (data == false) {
          console.log("error");
          $scope.departmentButtonText = "Department Data FAILED";
          $scope.departmentButtonColour = "button-assertive";
        }
        $ionicLoading.hide();
      });
    };

    $scope.loadClinicalData = function() {
      newData = Data.getSettings();
      if (!newData || !newData.root || !newData.specialty){
        return
      }
      newData.clinical = newData.root + "/" + newData.specialty + "/docs" + "/clinical.json";
      $ionicLoading.show({
        template: 'Loading Clinical Data'
      });
      Data.loadClinicalData(newData.clinical, $scope.cached.now).then(function(data) {
        if (data.clinical) {
          Data.storeSettings(newData);
          $scope.clinicalButtonText = "Clinical Data LOADED";
          $scope.clinicalButtonColour = "button-balanced";
        }
        if (data == false) {
          console.log('error');
          $scope.clinicalButtonText = "Department Data FAILED";
          $scope.clinicalButtonColour = "button-assertive";
        }
        $ionicLoading.hide();
      });
    }

    $scope.goHome = function() {
      $ionicHistory.nextViewOptions({
        disableBack: true
      });
      $ionicHistory.clearCache().then(
        function() {
          $state.go('app.home');
        }
      )

    }


  }
]);
