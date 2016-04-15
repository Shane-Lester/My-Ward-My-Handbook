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

      },
      makeURL: function(){
        //need to edit the function to pass the made URL's back
        var URLObject=$localstorage.getObject('settings');
        //if using local settings then don't add http://www.
        if(URLObject.clinical !== "js/clinical.json"){
          //only add www if it's not already added
          if(URLObject.department.indexOf('www')== -1){
                  URLObject.clinical= "http://www." + URLObject.clinical;
                }
            }
        else{
          //backup in case of failed load of settings
          URLObject.clinical="js/clinical.json";
        }

        if(URLObject.department!=="js/department.json"){
          //only add www if it's not already added
              if(URLObject.department.indexOf('www')==-1){
                  URLObject.department = "http://www." + URLObject.department;
                }
            }
        else{
          //backup in case of failed load of settings
          URLObject.department="js/department.json"
        }
          return URLObject;
      }
    }
}])
