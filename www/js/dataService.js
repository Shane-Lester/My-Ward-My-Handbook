// dataService.js
angular.module('starter.dataService', [])

.factory('Data',['$localstorage','$http',function($localstorage, $http){
  var storedSettings ={};// private variable that tracks the stored settings

  return{
    getSettings:function(){
      // console.log('getting settings');
      var settingsObj = {
           clinical:"js/clinical.json",
           department:"js/department.json"
       };
     storedSettings = $localstorage.getObject('settings');

    if(!(storedSettings.clinical || storedSettings.admin)){
        //  there are settings missing- so set to default
         storedSettings = settingsObj
         $localstorage.setObject("settings",storedSettings);
        //  console.log(storedSettings);
       }
         return storedSettings;
      },

      getData: function(type){
        // function to retrieve data and send to controllers
        // returns  a promise
        // takes either settings or department as parameter string
        // create the
        // console.log('created address' +storedSettings[type]);

        return $http.get(storedSettings[type]);

      }
  }
}])
