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



.controller('ListController',["$scope", "$http", "$state", "$stateParams","$localstorage","$ionicHistory", function($scope, $http, $state, $stateParams,$localstorage,$ionicHistory){
    
    $scope.data={
        hideImage: true,
        showReorder: false
    }
    
    $scope.makeURL=function(){
        var URLObject=$localstorage.getObject('settings');
        console.log('making URL');
        //if using local settings then don't add http://www.
        if(URLObject.clinical=="js/clinical.json"){
                $scope.clinicalURL= URLObject.clinical;
            }
        else{
            $scope.clinicalURL= "http://www." + URLObject.clinical;
            }
        console.log("clinicalURL = "+$scope.clinicalURL);
        if(URLObject.department=="js/clinical.json"){
                $scope.departmentURL= URLObject.department;
            }
        else{
            $scope.departmentURL = "http://www." + URLObject.department;
            }
        console.log("departmentURL = "+$scope.departmentURL);
    };
    
    $scope.resetDefaultData= function(ClinOrDept){
        var newData = $localstorage.getObject('settings');
        if (ClinOrDept=="clinical"){
            newData.clinical='js/clinical.json';
        }
        if (ClinOrDept=="department"){
            newData.department='js/clinical.json';
        }

       var newData = $localstorage.setObject('settings',newData);
        $scope.makeURL();

   
    };
   
    
    $scope.makeURL();
  
    $http.get($scope.clinicalURL)
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
    
    $http.get($scope.departmentURL)
        .success(function(data){
            if (data.admin){
                $scope.admin=data.admin;
                }
                    //if no admin key then load default
            else{
                console.log('no admin key');
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

.controller('SettingsController',["$scope", "NoteStore", "$state", "$stateParams","$localstorage","$ionicHistory", function($scope,NoteStore, $state, $stateParams,$localstorage,$ionicHistory){
    
    $scope.getWebData=function(url,key){

        var newData = $localstorage.getObject('settings');
        if (key=="clinical"){
            newData.clinical=url.clinical;
        }
        if (key=="department"){
            newData.department=url.department;
        }

       var newData = $localstorage.setObject('settings',newData);

   
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


