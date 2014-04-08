(function(){
	console.log('\nsyntaxalator.js');

	// These entries will style default elements of JavaScript
	var map = {
		"strings":"color:orange;",
		"numbers":"color:orange;",
		"comments":"color:gray;",
		"punctuators":"color:red;",
		"literals":"color:pink;",
		"reserved":"color:orange;"
	};

	// This array holds custom mappings, where 'words' is an array of target keywords
	// Custom mappings will override any default styles
	map.custom = [
		{
		"words": ["function", "prototype"],
		"style": "color:blue; font-weight:bold;"
		}
	];

	// Some reusable styling
	var styles = {
		"bounding_box":"border:1px solid rgb(230,238,240);",
		"line_number":"background-color:rgb(230,238,240); color:rgb(180,188,190); font-size:.6em;",
		"code_default":"font-family:monospace; color:rgb(20,28,30); background-color:rgb(250,250,250);"
	};

	//http://es5.github.io/#x7.6.1
	var list = {
		"reserved":"break,do,instanceof,typeof,case,else,new,var,catch,finally,return,void,continue,for,switch,while,debugger,function,this,with,default,if,throw,delete,in,try,class,enum,extends,super,const,export,import,implements,let,private,public,yield,interface,package,protected,static".split(','),
		"punctuators":"{,},(,),[,],.,;,<,>,<=,>=,==,!=,===,!==,+,-,*,%,++,--,<<,>>,>>>,&,|,^,!,~,&&,||,?,:,=,+=,-=,*=,%=,<<=,>>=,>>>=,&=,|=,^=".split(','),
		"literals":"null,true,false".split(',')
	};
	list.punctuators.push(',');

	// Wait for the DOM
	var iid = setInterval((function(){
		if(document.readyState === "complete"){
			clearInterval(iid);
			handleAllCodeBlocks();
		}
	}), 11);

	// Grab the target elements, start the loop
	function handleAllCodeBlocks(){
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

		// Loop through and handle
		var prettycode, newnode;
		for(var t=0; t<targets.length; t++) {
			console.log('\nHandling Code Block\n'+targets[t].innerHTML);
			prettycode = handleCodeBlock(targets[t].innerHTML);
			newnode = document.createElement('div');
			newnode.innerHTML = prettycode;
			document.body.insertBefore(newnode, targets[t]);
			targets[t].style.display = 'none';
		}
	}

	// Handle Code Block
	function handleCodeBlock(code){
		var lines = code.split('\n');

		// un-indent
		lines = unIndent(lines);

		// start the loop
		var line;
		var result = '';


		var padrow = '<tr><td class="line_number" style="height:.1em;"></td><td class="code_default"></td></tr>\n';
		result += '<style>'+
			'.code_table {border-collapse:collapse; '+styles.bounding_box+'}\n'+
			'.code_table td {padding:4px 12px 4px 8px;}\n'+
			'.line_number {vertical-align:top; '+styles.line_number+'}\n'+
			'.code_default, .code_default span {vertical-align:top; '+styles.code_default+'}'+
			'</style>'+
			'<table class="code_table"">\n'+
			padrow;

		for (var i=0; i<lines.length; i++) {
			line = lines[i];
			console.log('\nhandle code block - line '+i+'\n' + line);

			// Indentions
			console.log('\nIndex of tab: ' + line.indexOf('\t', 0));
			line = line.replace(/\t/g, '<span>&emsp;&emsp;</span>');

			// Custom Words
			for(var c=0; c<map.custom.length; c++){
				line = replace_o_matic(line, map.custom[c].words, map.custom[c].style);
			}

			// Strings

			// Comments

			// Numbers
			line = replace_o_matic(line, "0123456789".split(''), map.numbers);

			// Punctuators
			//line = replace_o_matic(line, list.punctuators, map.punctuators);

			// Literals
			line = replace_o_matic(line, list.literals, map.literals);

			// Reserved
			line = replace_o_matic(line, list.reserved, map.reserved);
			
			// Compile
			result += '<tr>\n<td class="line_number">'+i+'</td>\n';
			result += '<td class="code_default">'+line+'</td>\n</tr>\n';
		}
		result += padrow;
		result += '</table>';

		console.log("\nGenerated\n"+result);

		return result;
	}

	function replace_o_matic(text, lookfor, newstyle){
		var lf;
		for(var w=0; w<lookfor.length; w++){
			lfr = lookfor[w];
			// if(lfr==='<') lfr = '&lt;';
			// if(lfr==='>') lfr = '&gt;';
			text = text.replace(lookfor[w], ('<span style="'+newstyle+'">'+lfr+'</span>'), 'g');
		}
		return text;
	}

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



