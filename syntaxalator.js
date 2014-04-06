(function(){

	// These entries will style default elements of JavaScript
	var map = {
		"strings":"color:orange;",
		"numbers":"color:blue;",
		"operators":"color:red;",
		"reserved":"color:green;"
	};

	// This array holds custom mappings, where 'words' is an array of target keywords
	// Custom mappings will override any default styles
	map.custom = [
		{
		"words": ["function", "prototype"],
		"style": "color:cyan;"
		}
	];

	var targets = document.getElementsByClassName('syntaxalator');
	//http://es5.github.io/#x7.6.1
	var reservedKeyWords = "break,do,instanceof,typeof,case,else,new,var,catch,finally,return,void,continue,for,switch,while,debugger,function,this,with,default,if,throw,delete,in,try,class,enum,extends,super,const,export,import,implements,let,private,public,yield,interface,package,protected,static";

})();