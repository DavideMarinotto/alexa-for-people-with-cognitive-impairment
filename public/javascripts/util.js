function getTemplate( name,data){
    var d=$.Deferred();
    $.get('template/'+name+'.handlebars',function(response){
        var template = Handlebars.compile(response);
        d.resolve(template(data))
    });
    return d.promise();
}


