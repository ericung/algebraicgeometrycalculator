const editor = document.getElementById("editor");
const pseudocode = document.getElementById("pseudocode");
const domParser = new DOMParser();

if (editor.addEventListener) {
	editor.addEventListener('input', function() {
		var val = parserToHtml(this.value);
		var doc = domParser.parseFromString(val,"text/html");
		const element = doc.getElementById("pseudocode-body");
		pseudocode.parentNode.insertBefore(element,pseudocode);
	});
}
else if (editor.attachEvent) {
	editor.attachEvent('onpropertychange', function() {
		var val = parserToHtml(this.value);
		var doc = domParser.parseFromString(val,"text/html");
		const element = doc.getElementById("pseudocode-body");
		pseudocode.parentNode.insertBefore(element,pseudocode);
	});
}

editor.addEventListener('keydown', function(e) {
	if (e.key == "Tab") {
		e.preventDefault();
		var start = this.selectionStart;
		var end = this.selectionEnd;
		this.value = this.value.substring(0,start) + "\t" + this.value.substring(end);
		this.selectionStart = this.selectionEnd = start + 1;

		var val = parserToHtml(this.value);
		var doc = domParser.parseFromString(val,"text/html");
		const element = doc.getElementById("pseudocode-body");
		pseudocode.parentNode.insertBefore(element,pseudocode);
	}
});


function parserToHtml(text) {
	var lines = text.split('\n');
	const body = document.getElementById("pseudocode-body");
	if (body !== null) {
		body.remove();
	}

	var result = "<div id=\"pseudocode-body\">";

	for(var i = 0; i < lines.length; i++)
	{
		var tabs = 0;
		for (var t = 0; t < lines[i].length; t++) {
			if (lines[i][t] === "\t") {
				tabs++;
			}
		}

		result += "<p style=\"text-indent:"+ (40*tabs) + "px\">";
		result += parser(lines[i]);	
		result += "</p>";
	}

	result += "</div>";
	
	return result;
}

//const IFELSE = /\\IF\s*\{([^}]+\})\s*\\STATE\s*\{([^}]+\})\s*\\ELSE\s*\\STATE\s*\{([^}]+\})\s*\\ENDIF/g;
const VARIABLEX = /x/g;
const ADDITION = /\s*x\s*\+\s*x\s*\+\s*(\d)*\s*=\s*0\s*/g;
const SPACE = /\s*/g;

function parser(expression) {
	var result = "";

	if (expression.match(ADDITION)) {
		try {
			var variables = expression.split(SPACE);
			var constant = variables[5];
			var solution = solve(variables.length-1, constant);
			result += solution[0] + ", " + solution[1];
			result += "\n";
		}
		catch {
		}
	}

	return result;
}

function clean(expression) {
	return expression.replace("\{", "").replace("\}", "");
}

function solve(count, constant) {
	var xl = -100;
	var xr = 100;
	var epsilon = 0.5;
	var left = 2*xl + constant;
	var right = 2*xr + constant;

	while (left <= epsilon && epsilon <= right)
	{
		if (left <= -1 * epsilon)
		{
			xl /= 2;
			left = 2*xl + constant;
		}
		else if (epsilon <= right)
		{
			xr /= 2;
			right = 2*xr + constant;
		}
		else
		{
			return [(left - constant)/2, (right - constant)/2];
		}
	}

	return [(left - constant)/2, (right - constant)/2];
}

