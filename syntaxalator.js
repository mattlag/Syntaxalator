(function(){
	console.log('\nsyntaxalator.js');

	// These entries will style default elements of JavaScript
	var styleMap = {
		"strings":"color:orange;",
		"numbers":"color:orange;",
		"comments":"color:slategray;",
		"punctuators":"color:red;",
		"literals":"color:pink;",
		"reserved":"color:orange;"
	};

	// This array holds custom mappings, where 'words' is an array of target keywords
	// Custom mappings will override any default styles
	styleMap.custom = [
		{
		"words": ["function", "prototype"],
		"style": "color:blue; font-weight:bold;"
		}
	];

	// Some reusable styling
	var resultStyles = {
		"bounding_box":"border:1px solid rgb(230,238,240);",
		"line_number":"background-color:rgb(230,238,240); color:rgb(180,188,190); font-size:.6em;",
		"code_default":"font-family:monospace; color:rgb(20,28,30); background-color:rgb(250,250,250);"
	};

	//http://es5.github.io/#x7.6.1
	var keywordLists = {
		"reserved":"break,do,instanceof,typeof,case,else,new,var,catch,finally,return,void,continue,for,switch,while,debugger,function,this,with,default,if,throw,delete,in,try,class,enum,extends,super,const,export,import,implements,let,private,public,yield,interface,package,protected,static".split(','),
		"punctuators":"{,},(,),[,],.,;,<,>,<=,>=,==,!=,===,!==,+,-,*,%,++,--,<<,>>,>>>,&,|,^,!,~,&&,||,?,:,=,+=,-=,*=,%=,<<=,>>=,>>>=,&=,|=,^=".split(','),
		"literals":"null,true,false".split(',')
	};
	keywordLists.punctuators.push(',');

	// Wait for the DOM
	var iid = setInterval((function(){
		if(document.readyState === "complete"){
			clearInterval(iid);
			makeAllCodeBlocks();
		}
	}), 11);

	// Grab the target elements, start the loop
	function makeAllCodeBlocks(){
		// Make sure we can get the classes
		if(!document.getElementsByClassName) {
			console.log('\nNo getElementsByClassName, adding to document...');
			document.getElementsByClassName = function(className) {
				//return this.querySelectorAll("." + className);
				var a = [];
				var re = new RegExp('(^| )'+classname+'( |$)');
				var els = document.getElementsByTagName("*");
				for(var i=0; i<els.length; i++) if(re.test(els[i].className)) a.push(els[i]);
				return a;
			};
			Element.prototype.getElementsByClassName = document.getElementsByClassName;
		}

		// Grab the target elements
		var targets = document.getElementsByClassName('syntaxalator');
		console.log('\nTargets length ' + targets.length);

		// Loop through and make
		var prettycode, newnode;
		for(var t=0; t<targets.length; t++) {
			console.log('\nHandling Code Block\n'+targets[t].innerHTML);
			prettycode = makeCodeBlock(targets[t].innerHTML);
			newnode = document.createElement('div');
			newnode.innerHTML = prettycode;
			document.body.insertBefore(newnode, targets[t]);
			targets[t].style.display = 'none';
		}
	}

	// make Code Block
	function makeCodeBlock(code){
		var lines = code.split('\n');

		// un-indent
		lines = unIndent(lines);

		// start the loop
		var line;
		var result = '';


		var padrow = '<tr><td class="line_number" style="height:.1em;"></td><td class="code_default"></td></tr>\n';
		result += '<style>'+
			'.code_table {border-collapse:collapse; '+resultStyles.bounding_box+'}\n'+
			'.code_table td {padding:4px 12px 4px 8px;}\n'+
			'.line_number {vertical-align:top; '+resultStyles.line_number+'}\n'+
			'.code_default, .code_default span {vertical-align:top; '+resultStyles.code_default+'}'+
			'</style>'+
			'<table class="code_table"">\n'+
			padrow;

		for (var i=0; i<lines.length; i++) {
			line = lines[i];
			console.log('\nmake code block - line '+i+'\n' + line);
			result += '<tr>\n<td class="line_number">'+(i+1)+'</td>\n';
			result += '<td class="code_default">'+makeCodeLine(line)+'</td>\n</tr>\n';
		}
		result += padrow;
		result += '</table>';

		console.log("\nGenerated\n"+result);

		return result;
	}

	function makeCodeLine(line){
		var curr = 0;
		var start = 0;
		var len = 0;
		var newline = '';
		function isSingleNext(lookfor){ return lookfor.join('').indexOf(line.substr(curr,1)) > -1; }
		function isSequenceNext(lookfor){
			var tlen, tval;
			for(var n=0; n<lookfor.length; n++){
				tval = lookfor[n];
				tlen = tval.length;
				if(tval === line.substr(curr,tlen)) return tlen;
			}
			return false;
		}

		while(curr < line.length){

			// Indentions
			if(isSingleNext(['\t'])){
				newline += '<span>&emsp;&emsp;</span>';
				curr ++;
			}
/*
			// Strings
			else if (line.substr(curr,1)==='"'){

				curr++;
			}

			else if (line.substr(curr,1)==="'"){

				curr++;
			}*/
			
			// Comments
			else if (isSequenceNext(["//"])){			
				newline += makeSpanTag(line.substring(curr), styleMap.comments);
				curr = line.length;
			}

			// Numbers
			else if (isSingleNext("0123456789".split(''))){
				start = curr;
				if(isSingleNext("0123456789.".split(''))) curr++;
				newline += makeSpanTag(line.substring(start,curr), styleMap.numbers);
			}

			// Custom Words

			// Punctuators
			else if (len = isSequenceNext(keywordLists.punctuators)){
				newline += makeSpanTag(line.substr(curr,len), styleMap.punctuators);
				curr+=len;
			}

			// Literals

			// Reserved

			// FALLTHROUGH

			else {
				newline += line.substr(curr,1);
				curr++;
			}
		}

		return newline;
	}


	function makeSpanTag(value, style){	return ('<span style="'+style+'">'+value+'</span>'); }

	function unIndent(larr) {
		var mincount = 999999;
		var thiscount, thisstring;

		for(var l=0; l<larr.length; l++){
			thiscount = 0;
			thisstring = larr[l];

			while(thisstring.indexOf('\t')===0) {
				thiscount++;
				thisstring = thisstring.substring(2);
			}

			mincount = Math.min(mincount, thiscount);

			if(mincount===0) return larr;
		}

		console.log('\nUnIndent found common tabs: ' + mincount);

		for(var i=0; i<larr.length; i++) larr[i] = larr[i].substring((mincount*2)-1);
		if(larr[larr.length-1]==='\t' || larr[larr.length-1]==='') larr.pop();

		console.log('\nUnindent returning ' + JSON.stringify(larr));

		return larr;
	}
})();



