
test("globals set up",2, function() {
  
	ok(window.Modernizr, 'global modernizr object created');
	
  // this comes from kangax's detect-global.js
	equals(1, __globalsCount, 'no more than one global object created'); 

});





test("document.documentElement is valid and correct",1, function() {
	equals(document.documentElement,document.getElementsByTagName('html')[0]); 
});


test("no-js class is gone.", function() {
  
	equals(document.documentElement.className.indexOf('no-js') , -1,
	       'no-js is gone.'); 
	       
	ok(/\bjs /.test(document.documentElement.className),
	   'html.js class is present')
	
	if (document.querySelector){
	  ok(document.querySelector('html.js') == document.documentElement, 
	     "document.querySelector('html.js') matches.");
	}
});

test('html shim worked', function(){
  expect(2);
  
  // the exact test we use in the script
  var elem = document.getElementsByTagName("section")[0];

  ok( elem.childNodes.length === 1 , 'unknown elements dont collapse');
  
  elem.style.color = 'red';
  ok( /red|#ff0000/i.test(elem.style.color), 'unknown elements are styleable')
  
});


test('html classes are looking good',function(){
  
  var classes = TEST.trim(document.documentElement.className).split(/\s+/);
  
  var modprops = Object.keys(Modernizr), 
      newprops = modprops;

  // decrement for the properties that are private
  for (var i = -1, len = TEST.privates.length; ++i < len; ){
    var item = TEST.privates[i];
    equals(-1, TEST.inArray(item, classes), 'private Modernizr object '+ item +'should not have matching classes');
    equals(-1, TEST.inArray('no-' + item, classes), 'private Modernizr object no-'+item+' should not have matching classes');
  }
  
  // decrement for the non-boolean objects
//  for (var i = -1, len = TEST.inputs.length; ++i < len; ){
//    if (Modernizr[TEST.inputs[i]] != undefined) newprops--;
//  }
  
  // TODO decrement for the extraclasses
  
  // decrement for deprecated ones.
  $.each( TEST.deprecated, function(key, val){
    newprops.splice(  TEST.inArray(item, newprops), 1);
  });
  
  
  //equals(classes,newprops,'equal number of classes and global object props');
  
  if (classes.length !== newprops){
    //window.console && console.log(classes, newprops);
    
  }
  
  for (var i = 0, len = classes.length, aclass; i <len; i++){
    aclass = classes[i];
    
    if (aclass === 'js') continue;
    
    if (aclass.indexOf('no-') === 0){
      aclass = aclass.replace('no-','');
    
      equals(Modernizr[aclass], false, 
            aclass + ' is correctly false in the classes and object')
            
    } else {
      equals(Modernizr[aclass], true, 
             aclass + ' is correctly true in the classes and object')
    }
  }
  
  
  for (var i = 0, len = classes.length, aclass; i <len; i++){
    equals(classes[i],classes[i].toLowerCase(),'all classes are lowerCase.');
  }
  
  equals(/[^\s]no-/.test(document.documentElement.className),false,
         'whitespace between all classes.');
  
  
})


test('Modernizr properties are looking good',function(){
  
  var count  = 0,
      nobool = TEST.API.concat(TEST.inputs)
                       .concat(TEST.audvid)
                       .concat(TEST.privates);
      
  for (var prop in window.Modernizr){
    if (Modernizr.hasOwnProperty(prop)){
      
      if (TEST.inArray(prop,nobool) >= 0) continue;
      
      ok(Modernizr[prop] === true || Modernizr[prop] === false,
        'Modernizr.'+prop+' is a straight up boolean');
        
        
      equals(prop,prop.toLowerCase(),'all properties are lowerCase.')
    }
  }
})



test('Modernizr.addTest()',22,function(){
  
  var docEl = document.documentElement;
  
  
  Modernizr.addTest('testtrue',function(){
    return true;
  });
  
  Modernizr.addTest('testtruthy',function(){
    return 100;
  });
  
  Modernizr.addTest('testfalse',function(){
    return false;
  });
  
  Modernizr.addTest('testfalsy',function(){
    return undefined;
  });
  
  ok(docEl.className.indexOf(' testtrue') >= 0,'positive class added');
  equals(Modernizr.testtrue,true,'positive prop added');
  
  ok(docEl.className.indexOf(' testtruthy') >= 0,'positive class added');
  equals(Modernizr.testtruthy,true,'truthy value casted to straight boolean');
  
  ok(docEl.className.indexOf(' no-testfalse') >= 0,'negative class added');
  equals(Modernizr.testfalse,false,'negative prop added');
  
  ok(docEl.className.indexOf(' no-testfalsy') >= 0,'negative class added');
  equals(Modernizr.testfalsy,false,'falsy value casted to straight boolean');
  
  
  
  Modernizr.addTest('camelCase',function(){
     return true;
   });
   
  ok(docEl.className.indexOf(' camelCase') === -1,
     'camelCase test name toLowerCase()\'d');


  // okay new signature for this API! woo

  Modernizr.addTest('testboolfalse', false);

  ok(~docEl.className.indexOf(' no-testboolfalse'), 'Modernizr.addTest(feature, bool): negative class added');
  equals(Modernizr.testboolfalse, false, 'Modernizr.addTest(feature, bool): negative prop added');



  Modernizr.addTest('testbooltrue', true);

  ok(~docEl.className.indexOf(' testbooltrue'), 'Modernizr.addTest(feature, bool): positive class added');
  equals(Modernizr.testbooltrue, true, 'Modernizr.addTest(feature, bool): positive prop added');



  Modernizr.addTest({'testobjboolfalse': false,
                     'testobjbooltrue' : true   });

  ok(~docEl.className.indexOf(' no-testobjboolfalse'), 'Modernizr.addTest({feature: bool}): negative class added');
  equals(Modernizr.testobjboolfalse, false, 'Modernizr.addTest({feature: bool}): negative prop added');

  ok(~docEl.className.indexOf(' testobjbooltrue'), 'Modernizr.addTest({feature: bool}): positive class added');
  equals(Modernizr.testobjbooltrue, true, 'Modernizr.addTest({feature: bool}): positive prop added');




  Modernizr.addTest({'testobjfnfalse': function(){ return false },
                     'testobjfntrue' : function(){ return true }   });


  ok(~docEl.className.indexOf(' no-testobjfnfalse'), 'Modernizr.addTest({feature: bool}): negative class added');
  equals(Modernizr.testobjfnfalse, false, 'Modernizr.addTest({feature: bool}): negative prop added');

  ok(~docEl.className.indexOf(' testobjfntrue'), 'Modernizr.addTest({feature: bool}): positive class added');
  equals(Modernizr.testobjfntrue, true, 'Modernizr.addTest({feature: bool}): positive prop added');


  Modernizr.addTest('chainone', true).addTest({ chaintwo: true }).addTest('chainthree', function(){ return true; });
  ok( Modernizr.chainone == Modernizr.chaintwo == Modernizr.chainthree, 'addTest is chainable');


}); // eo addTest


test('Modernizr.audio and Modernizr.video',function(){
  
  for (var i = -1, len = TEST.audvid.length; ++i < len;){
    var prop = TEST.audvid[i];
  
    if (Modernizr[prop].toString() == 'true'){
      
      ok(Modernizr[prop],                             'Modernizr.'+prop+' is truthy.');
      equals(Modernizr[prop] == true,true,            'Modernizr.'+prop+' is == true')
      equals(typeof Modernizr[prop] === 'object',true,'Moderizr.'+prop+' is truly an object');
      equals(Modernizr[prop] !== true,true,           'Modernizr.'+prop+' is !== true')
      
    } else {
      
      equals(Modernizr[prop] != true,true,            'Modernizr.'+prop+' is != true')
    }
  }
  
  
});


test('Modernizr results match expected values',function(){
  
  // i'm bringing over a few tests from inside Modernizr.js
  equals(!!document.createElement('canvas').getContext,Modernizr.canvas,'canvas test consistent');
  
  equals(!!window.Worker,Modernizr.webworkers,'web workers test consistent')
  
});




test('Modernizr.mq: media query testing',function(){
  
  var $html = $('html');
  $.mobile = {};
  
  // from jquery mobile

  $.mobile.media = (function() {
  	// TODO: use window.matchMedia once at least one UA implements it
  	var cache = {},
  		testDiv = $( "<div id='jquery-mediatest'>" ),
  		fakeBody = $( "<body>" ).append( testDiv );

  	return function( query ) {
  		if ( !( query in cache ) ) {
  			var styleBlock = document.createElement('style'),
          		cssrule = "@media " + query + " { #jquery-mediatest { position:absolute; } }";
  	        //must set type for IE!	
  	        styleBlock.type = "text/css";
  	        if (styleBlock.styleSheet){ 
  	          styleBlock.styleSheet.cssText = cssrule;
  	        } 
  	        else {
  	          styleBlock.appendChild(document.createTextNode(cssrule));
  	        } 

  			$html.prepend( fakeBody ).prepend( styleBlock );
  			cache[ query ] = testDiv.css( "position" ) === "absolute";
  			fakeBody.add( styleBlock ).remove();
  		}
  		return cache[ query ];
  	};
  })();
  
   
  ok(Modernizr.mq,'Modernizr.mq() doesn\' freak out.');
  
  equals($.mobile.media('only screen'), Modernizr.mq('only screen'),'screen media query matches jQuery mobile\'s result');
  
  equals(Modernizr.mq('only all'), Modernizr.mq('only all'), 'Cache hit matches');
  
  
});




test('Modernizr.event',function(){
   
  ok(Modernizr.event,'Modernizr.event() doesn\'t freak out.');
  
 
  equals(Modernizr.event('click'), true,'click event is supported');

  
});




test('Modernizr.prefixed()', function(){
  // https://gist.github.com/523692
  
  function gimmePrefix(prop){
    var prefixes = ['Moz','Khtml','Webkit','O','ms'],
        elem     = document.createElement('div'),
        upper    = prop.charAt(0).toUpperCase() + prop.slice(1);

    if (prop in elem.style)
      return prop;

    for (var len = prefixes.length; len--; ){
      if ((prefixes[len] + upper)  in elem.style)
        return (prefixes[len] + upper);
    }


    return false;
  }
  
  var propArr = ['transition', 'backgroundSize', 'boxSizing', 'borderImage', 
                 'borderRadius', 'boxShadow', 'columnCount'];
  
  
  for (var i = -1, len = propArr.length; ++i < len; ){
    var prop = propArr[i];
    equals( Modernizr.prefixed(prop), gimmePrefix(prop), 'results for ' + prop + ' match the homebaked prefix finder');
  }
  
  
  
});





