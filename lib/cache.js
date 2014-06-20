function Cache(methods){
    var defaults = {
        preGet : function(key){ return key; },
        postGet : function(oldKey, newKey, result){ return result; },
        preSet : function(key, value){return {key : key, value : value} },
        persistant : true,
    };
    var config = $.extend({}, defaults, methods);
    
    this.preGet = config.preGet;
    this.postGet = config.postGet;
    this.preSet = config.preSet;
    this.storageMech = config.persistant ? window.localStorage : window.sessionStorage;
};

Cache.prototype = {
    get : function(key, isObject){
        
        var newKey = this.preGet(key);
        var result;
        
        if(isObject)
            result = JSON.parse(this.storageMech.getItem(newKey));
        else
            result = this.storageMech.getItem(newKey);
        
        var newResult = this.postGet(key, newKey, result);
        
        return newResult;
    },
    set : function(key, value, isObject){
        var newOptions = this.preSet(key, value);
        var newValue;
        
        if(isObject)
            newValue = JSON.stringify(newOptions.value);
        else
            newValue = newOptions.value;
        
        this.storageMech.setItem(newOptions.key, newValue);
    }
}