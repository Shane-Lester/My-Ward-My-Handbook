// dataService.js
angular.module('starter.dataService', [])

.factory('Data',['$localstorage','$http',function($localstorage, $http){
  var storedSettings ={};// private variable that tracks the stored settings




  return{
    initialize:function(){
      //initialise clinical and department data caches
      if(!clinicalCache || clinicalCache.clinical == "undefined"){
        var clinicalCache = {"clinical":{}};
        this.getSettings();
        clinicalCache = this.getClinicalSettings();
      }
      if(!departmentCache || departmentCache.department == "undefined"){
        var departmentCache = {"clinical":{}};
        this.getSettings();
        clinicalCache = this.getDepartmentSettings();
      }
    },
    getSettings:function(){
      // console.log('getting settings');
      var settingsObj = {
            root:"no root address submitted",
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
      storeSettings: function(newSettings){
        this.getSettings();
        if(newSettings.clinical){
          storedSettings.clinical = newSettings.clinical;
        }
        if(newSettings.department){
          storedSettings.department = newSettings.department;
        }
        $localstorage.setObject("settings",storedSettings);
        this.makeURL();
      },

      getClinicalSettings:function(){},

      getDepartmentSettings: function(){},

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
          console.log('creating clinical URL');
          //only add www if it's not already added
          if(URLObject.clinical.indexOf('www')== -1){
                  URLObject.clinical= "http://www." + URLObject.clinical + "/docs/clinical.json";
                }
            }
        else{
          //backup in case of failed load of settings
          URLObject.clinical="js/clinical.json";
        }

        if(URLObject.department!=="js/department.json"){
          console.log('creating department URL');
          //only add www if it's not already added
              if(URLObject.department.indexOf('www')==-1){
                console.log('decorating department URL');
                  URLObject.department = "http://www." + URLObject.department + "/docs/department.json";
                }
            }
        else{
          //backup in case of failed load of settings
          URLObject.department="js/department.json"

        }
        $localstorage.setObject('settings',URLObject);
        return URLObject;
      }
    }
}])
