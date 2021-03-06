angular.module('starter.controllers', [])


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



.controller('ListController', ["$scope",  "$state", "$stateParams", "$localstorage", "$ionicHistory", "Data", function($scope, $state, $stateParams, $localstorage, $ionicHistory, Data) {

  $scope.data = {
    hideImage: true,
    showReorder: false
  }

  var settingsData = Data.getSettings();

  var loadedClinicalData;
  var loadedDepartmentData;


  $scope.root = settingsData.root;
  $scope.specialty = settingsData.specialty;

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
      $scope.rootIsSet = false;
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
      $scope.rootIsSet = true;
      newData.root = root;
      if(!$scope.cached.now){
        console.log('making new cache key');
        newData.cacheKey = "?" + Date.now();
      }
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
      Data.loadDepartmentData(newData.department).then(function(data) {
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
      Data.loadClinicalData(newData.clinical).then(function(data) {
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
