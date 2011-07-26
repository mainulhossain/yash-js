var defaultColor = '848484';

/** 
 * Class definition for code item
 *
 * @author Muhammad Mainul Hossain
 * @version 0.1
*/
var CodeItem = new Class({
  Implements: [Options],
  options: {
	color: '',
	bold: false,
	italic: false,
	name: ''
  },
	before: '',
	after: '',
	initialize: function(options) {
	  this.setOptions(options);
	  this.before = "<span class=\"" + this.options.name + "\">"
	  this.after = "</span>"
	},
	toStyle: function() {
	  var style = "." + this.options.name + " { color: " + this.options.color + "; ";
	  if (this.options.bold) 
	    style += "font-weight: bold; ";
	  if (this.options.italic) 
	    style += "font-style: italic; ";
	  style += "}\n";
	  
	  return style;
	}
});

/** 
 * Class definition for code item converter
 *
 * @author Muhammad Mainul Hossain
 * @copyright Muhammad Mainul Hossain, Karlsruhe, Germany, 2009
 * @version 0.1
*/
var CodeItemConverter = new Class({
Implements: [Options],
options:
  {
    start : null,
    end : null,
    neglect : null,
    startPos : -1,
    endPos : -1
  },
  codeItem : null,
  initialize: function(codeItem, options){
    this.codeItem = codeItem;
    this.setOptions(options);
  }  
});

var SyntaxHighlighter = new Class({
  Implements: [Options],
  options: {
	language: "c++"
  },
  codeConverters: null,
  initialize: function(options) {
    this.setOptions(options);
    var codeItems = new Array();
    codeItems.push(new CodeItem({color:"#008000", bold:false, italic: true, name:"comment"}));
    codeItems.push(new CodeItem({color:"#000099", bold:false, italic:false, name:"pre"}));
    codeItems.push(new CodeItem({color:"#A31515", bold:false, italic:false, name:"string"}));
    codeItems.push(new CodeItem({color:"#A31515", bold:false, italic:false, name:"char"}));
    codeItems.push(new CodeItem({color:"#996600", bold:false, italic:false, name:"float"}));
    codeItems.push(new CodeItem({color:"#999900", bold:false, italic:false, name:"int"}));
    codeItems.push(new CodeItem({color:"#0F00F0", bold:true,  italic:false, name:"bool"}));
    codeItems.push(new CodeItem({color:"#2B911F", bold:false, italic:false, name:"type"}));
    codeItems.push(new CodeItem({color:"#FF0000", bold:false, italic:false, name:"flow"}));
    codeItems.push(new CodeItem({color:"#000099", bold:false, italic:false, name:"keyword"}));
    codeItems.push(new CodeItem({color:"#663300", bold:true,  italic:false, name:"operator"}));

    this.codeConverters = new Array();
    var i = 0;
    this.codeConverters.push(new CodeItemConverter(codeItems[i], {start: /\s*\/\*[\s\S]*?\*\//mg}));
    this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\/\//mg, end:/\n/mg, neglect:/\\|\?\?\//mg}));
    this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*?^\s*(?:#|\?\?=|%:)/mg, end:/\n/m, neglect:/\\[\s\S]|\?\?\/[\s\S]/m}));
    this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*(?:\bL)?"/mg, end:/"/m, neglect:/\\[\s\S]|\?\?\/[\s\S]/m}));
    this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*(?:\bL)?'/mg, end:/'/m, neglect:/\\[\s\S]|\?\?\/[\s\S]/m}));
    this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*(?:(?:\b\d+\.\d*|\.\d+)(?:E[\+\-]?\d+)?|\b\d+E[\+\-]?\d+)[FL]?\b|\s*\b\d+\./mgi}))
    this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:0[0-7]*|[1-9]\d*|0x[\dA-F]+)(?:UL?|LU?)?\b/mgi}));
    this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:true|false)\b/mg}));
	
	switch (this.options.language) {
		case "c++":
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t|va_list)\b/mg}));
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:break|case|catch|continue|default|do|else|for|goto|if|return|switch|throw|try|while)\b/mg}));
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:asm|auto|class|const_cast|const|delete|dynamic_cast|enum|explicit|export|extern|friend|inline|main|mutable|namespace|new|operator|private|protected|public|register|reinterpret_cast|sizeof|static_cast|static|struct|template|this|typedef|typeid|typename|union|using|virtual|volatile|and_eq|and|bitand|bitor|compl|not_eq|not|or_eq|or|xor_eq|xor)\b/mg}));
			break;
		case "java":
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:bool|char|double|float|int|long|short|signed|unsigned|void)\b/mg}));
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:break|case|catch|continue|default|do|else|for|goto|if|return|switch|throw|try|while)\b/mg}));
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:auto|class|const_cast|const|delete|dynamic_cast|enum|explicit|export|extern|friend|inline|main|mutable|new|operator|private|protected|public|register|reinterpret_cast|sizeof|static_cast|static|struct|template|this|typedef|typeid|typename|union|virtual|volatile|and_eq|and|bitand|bitor|compl|not_eq|not|or_eq|or|xor_eq|xor|package|import)\b/mg}));
			break;
		case "c#":
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|object)\b/mg}));
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:break|case|catch|continue|default|do|else|for|goto|if|return|switch|throw|try|while)\b/mg}));
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:auto|class|const_cast|const|delete|dynamic_cast|enum|explicit|export|extern|friend|inline|main|mutable|namespace|new|operator|private|protected|public|register|reinterpret_cast|sizeof|static_cast|static|struct|template|this|typedef|typeid|typename|union|using|virtual|volatile|and_eq|and|bitand|bitor|compl|not_eq|not|or_eq|or|xor_eq|xor)\b/mg}));
			break;
		case "javascript":
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/mg}));
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:break|case|catch|continue|default|do|else|for|goto|if|return|switch|throw|try|while)\b/mg}));
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:var|class|enum|explicit|export|extern|friend|inline|main|mutable|namespace|new|operator|private|protected|public|register|reinterpret_cast|sizeof|static_cast|static|struct|template|this|typedef|typeid|typename|union|using|virtual|volatile|and_eq|and|bitand|bitor|compl|not_eq|not|or_eq|or|xor_eq|xor)\b/mg}));
			break;
		case "php":
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:bool|char|double|float|int|long|short|signed|unsigned|void|wchar_t)\b/mg}));
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:break|case|catch|continue|default|do|else|for|goto|if|return|switch|throw|try|while)\b/mg}));
			this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*\b(?:asm|auto|class|const_cast|const|delete|dynamic_cast|enum|explicit|export|extern|friend|inline|main|mutable|namespace|new|operator|private|protected|public|register|reinterpret_cast|sizeof|static_cast|static|struct|template|this|typedef|typeid|typename|union|using|virtual|volatile|and_eq|and|bitand|bitor|compl|not_eq|not|or_eq|or|xor_eq|xor)\b/mg}));
			break;
	}
	
    this.codeConverters.push(new CodeItemConverter(codeItems[i++], {start:/\s*[\{\}\[\]\(\)<>%:;\.\?\*\+\-\^&\|~!=,\\]+|\s*\//mg}));
  },
  convert: function(code) {
    var keyString = "";
    var previousMatch = -1;
    var html = "";
	
    code = code.replace(/\r\n?/gm, "\n");

    //initialize this.codeConverters
    this.codeConverters.each(function(item) { item.options.startPos = -1; });

	for(var position = 0; position < code.length; position = this.codeConverters[match].options.endPos) {
		
		this.codeConverters.each(function(item) { 
			if (item.options.startPos < position) {
			  item.options.start.lastIndex = position;
			  var result = item.options.start.exec(code);
			  if (result != null) {
				item.options.startPos = result.index;
				item.options.endPos = item.options.start.lastIndex;
				
				if (item.options.end != undefined) { // end must be found
					var end = new RegExp(item.options.end.source + "|" + item.options.neglect.source, "mg");
					end.lastIndex = item.options.endPos;
					while (item.options.endPos !== code.length) {
					  var endResult = end.exec(code);
					  if (endResult != null) {
						if (endResult[0].search(item.options.end) == 0) {
						  item.options.endPos = end.lastIndex;
						  break;
						}
					  }
					  else {
						item.options.endPos = code.length;
					  }
					}
				}
			  }
			  else {
				item.options.startPos = item.options.endPos = code.length;
			  }
			}
		});

		var match = -1;
		var minPos = code.length;
		
		this.codeConverters.each(function(item, index) { 
			if (item.options.startPos >= position && item.options.startPos < minPos) {
				minPos = item.options.startPos;
				match = index;
			}
		});
		
		if (match >= 0) {
		
			var matchedConverter = this.codeConverters[match];
			
			var before = code.substring(position, matchedConverter.options.startPos);
			var keyString = code.substring(matchedConverter.options.startPos, matchedConverter.options.endPos);
			var output = "";
		    if ((before == "") && (match == previousMatch)){
				output += this.convertSpecialChar(keyString)
			}
			else {
				if (previousMatch != -1) 
					output += this.codeConverters[previousMatch].codeItem.after;
		
				output += this.convertSpecialChar(before);
				if (keyString != "") 
					output += matchedConverter.codeItem.before + this.convertSpecialChar(keyString);
			}
      
			  previousMatch = match;
			  html += output;
			  if (keyString != "") 
				output = matchedConverter.codeItem.after;
		}
		else {
			output = "";
			if (previousMatch != -1) 
					output += this.codeConverters[previousMatch].codeItem.after;
			html += code.substring(position);
			break;
		}
	}
	if (output !== undefined)
		html += output;
	html = html.split("\n").join("<br/>");
    return html;
  },
  getStyle: function() {
    var style = "";
    this.codeConverters.each(function(converter){ 
      style += converter.codeItem.toStyle() + "\n";
    });
    return style;
  },
  generateCSS: function(){
	var out = window.open("", "", "menubar,scrollbars,status,resizable")
    out.document.open();
    out.document.write(this.getStyle());
    out.document.close();
  },
  generateHTML: function(code, embeddedStyle) {
    
    var html = "<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.1//EN\" \"http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd\">\n" +
	"<html xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en\">\n" +
	"<head>\n<meta http-equiv=\"content-type\" content=\"text/html; charset=utf-8\" />\n" +
	"<title>Syntax Highlighting</title>\n";
      
    if (embeddedStyle)
	{
		html += "<style type=\"text/css\">\n" + this.getStyle() + "</style>\n";
	}
	
    html += "</head>\n<body>\n<pre>" + this.convert(code) + "</pre>\n</body>\n</html>\n";
    var out = window.open("", "", "menubar,scrollbars,status,resizable")
    out.document.open();
    out.document.write(html);
    out.document.close();
  },
  convertSpecialChar: function(s) { // convert special chars
    s = s.split("&").join("&amp;");
    s = s.split("<").join("&lt;");
	s = s.split(" ").join("&nbsp;");
    return s.split(">").join("&gt;");
  } 
  
});