var ee=Object.defineProperty;var _=(t,e)=>ee(t,"name",{value:e,configurable:!0});var Ot=(t,e,n)=>new Promise((s,c)=>{var u=r=>{try{y(n.next(r))}catch(T){c(T)}},S=r=>{try{y(n.throw(r))}catch(T){c(T)}},y=r=>r.done?s(r.value):Promise.resolve(r.value).then(u,S);y((n=n.apply(t,e)).next())});import{g as se}from"./chunk-55IACEB6-ZrMO2I2u.js";import{s as ie}from"./chunk-QN33PNHL-Qy54WgYz.js";import{_ as d,l as m,c as $,r as re,u as ae,a as ne,b as oe,g as le,s as ce,q as he,t as ue,ab as de,k as j,z as fe}from"./mermaid.core-CmbX8jIc.js";var vt=(function(){var t=d(function(G,o,h,a){for(h=h||{},a=G.length;a--;h[G[a]]=o);return h},"o"),e=[1,2],n=[1,3],s=[1,4],c=[2,4],u=[1,9],S=[1,11],y=[1,16],r=[1,17],T=[1,18],D=[1,19],A=[1,33],x=[1,20],v=[1,21],f=[1,22],k=[1,23],N=[1,24],I=[1,26],P=[1,27],O=[1,28],F=[1,29],st=[1,30],it=[1,31],rt=[1,32],at=[1,35],nt=[1,36],ot=[1,37],lt=[1,38],H=[1,34],p=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],ct=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],xt=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],gt={trace:d(_(function(){},"trace"),"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"CLICK",39:"STRING",40:"HREF",41:"classDef",42:"CLASSDEF_ID",43:"CLASSDEF_STYLEOPTS",44:"DEFAULT",45:"style",46:"STYLE_IDS",47:"STYLEDEF_STYLEOPTS",48:"class",49:"CLASSENTITY_IDS",50:"STYLECLASS",51:"direction_tb",52:"direction_bt",53:"direction_rl",54:"direction_lr",56:";",57:"EDGE_STATE",58:"STYLE_SEPARATOR",59:"left_of",60:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:d(_(function(o,h,a,g,E,i,J){var l=i.length-1;switch(E){case 3:return g.setRootDoc(i[l]),i[l];case 4:this.$=[];break;case 5:i[l]!="nl"&&(i[l-1].push(i[l]),this.$=i[l-1]);break;case 6:case 7:this.$=i[l];break;case 8:this.$="nl";break;case 12:this.$=i[l];break;case 13:const q=i[l-1];q.description=g.trimColon(i[l]),this.$=q;break;case 14:this.$={stmt:"relation",state1:i[l-2],state2:i[l]};break;case 15:const Tt=g.trimColon(i[l]);this.$={stmt:"relation",state1:i[l-3],state2:i[l-1],description:Tt};break;case 19:this.$={stmt:"state",id:i[l-3],type:"default",description:"",doc:i[l-1]};break;case 20:var V=i[l],z=i[l-2].trim();if(i[l].match(":")){var ut=i[l].split(":");V=ut[0],z=[z,ut[1]]}this.$={stmt:"state",id:V,type:"default",description:z};break;case 21:this.$={stmt:"state",id:i[l-3],type:"default",description:i[l-5],doc:i[l-1]};break;case 22:this.$={stmt:"state",id:i[l],type:"fork"};break;case 23:this.$={stmt:"state",id:i[l],type:"join"};break;case 24:this.$={stmt:"state",id:i[l],type:"choice"};break;case 25:this.$={stmt:"state",id:g.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:i[l-1].trim(),note:{position:i[l-2].trim(),text:i[l].trim()}};break;case 29:this.$=i[l].trim(),g.setAccTitle(this.$);break;case 30:case 31:this.$=i[l].trim(),g.setAccDescription(this.$);break;case 32:this.$={stmt:"click",id:i[l-3],url:i[l-2],tooltip:i[l-1]};break;case 33:this.$={stmt:"click",id:i[l-3],url:i[l-1],tooltip:""};break;case 34:case 35:this.$={stmt:"classDef",id:i[l-1].trim(),classes:i[l].trim()};break;case 36:this.$={stmt:"style",id:i[l-1].trim(),styleClass:i[l].trim()};break;case 37:this.$={stmt:"applyClass",id:i[l-1].trim(),styleClass:i[l].trim()};break;case 38:g.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 39:g.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 40:g.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 41:g.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 44:case 45:this.$={stmt:"state",id:i[l].trim(),type:"default",description:""};break;case 46:this.$={stmt:"state",id:i[l-2].trim(),classes:[i[l].trim()],type:"default",description:""};break;case 47:this.$={stmt:"state",id:i[l-2].trim(),classes:[i[l].trim()],type:"default",description:""};break}},"anonymous"),"anonymous"),table:[{3:1,4:e,5:n,6:s},{1:[3]},{3:5,4:e,5:n,6:s},{3:6,4:e,5:n,6:s},t([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],c,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:u,5:S,8:8,9:10,10:12,11:13,12:14,13:15,16:y,17:r,19:T,22:D,24:A,25:x,26:v,27:f,28:k,29:N,32:25,33:I,35:P,37:O,38:F,41:st,45:it,48:rt,51:at,52:nt,53:ot,54:lt,57:H},t(p,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:y,17:r,19:T,22:D,24:A,25:x,26:v,27:f,28:k,29:N,32:25,33:I,35:P,37:O,38:F,41:st,45:it,48:rt,51:at,52:nt,53:ot,54:lt,57:H},t(p,[2,7]),t(p,[2,8]),t(p,[2,9]),t(p,[2,10]),t(p,[2,11]),t(p,[2,12],{14:[1,40],15:[1,41]}),t(p,[2,16]),{18:[1,42]},t(p,[2,18],{20:[1,43]}),{23:[1,44]},t(p,[2,22]),t(p,[2,23]),t(p,[2,24]),t(p,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},t(p,[2,28]),{34:[1,49]},{36:[1,50]},t(p,[2,31]),{13:51,24:A,57:H},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},t(ct,[2,44],{58:[1,56]}),t(ct,[2,45],{58:[1,57]}),t(p,[2,38]),t(p,[2,39]),t(p,[2,40]),t(p,[2,41]),t(p,[2,6]),t(p,[2,13]),{13:58,24:A,57:H},t(p,[2,17]),t(xt,c,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},t(p,[2,29]),t(p,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},t(p,[2,14],{14:[1,71]}),{4:u,5:S,8:8,9:10,10:12,11:13,12:14,13:15,16:y,17:r,19:T,21:[1,72],22:D,24:A,25:x,26:v,27:f,28:k,29:N,32:25,33:I,35:P,37:O,38:F,41:st,45:it,48:rt,51:at,52:nt,53:ot,54:lt,57:H},t(p,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},t(p,[2,34]),t(p,[2,35]),t(p,[2,36]),t(p,[2,37]),t(ct,[2,46]),t(ct,[2,47]),t(p,[2,15]),t(p,[2,19]),t(xt,c,{7:78}),t(p,[2,26]),t(p,[2,27]),{5:[1,79]},{5:[1,80]},{4:u,5:S,8:8,9:10,10:12,11:13,12:14,13:15,16:y,17:r,19:T,21:[1,81],22:D,24:A,25:x,26:v,27:f,28:k,29:N,32:25,33:I,35:P,37:O,38:F,41:st,45:it,48:rt,51:at,52:nt,53:ot,54:lt,57:H},t(p,[2,32]),t(p,[2,33]),t(p,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:d(_(function(o,h){if(h.recoverable)this.trace(o);else{var a=new Error(o);throw a.hash=h,a}},"parseError"),"parseError"),parse:d(_(function(o){var h=this,a=[0],g=[],E=[null],i=[],J=this.table,l="",V=0,z=0,ut=2,q=1,Tt=i.slice.call(arguments,1),b=Object.create(this.lexer),M={yy:{}};for(var Et in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Et)&&(M.yy[Et]=this.yy[Et]);b.setInput(o,M.yy),M.yy.lexer=b,M.yy.parser=this,typeof b.yylloc>"u"&&(b.yylloc={});var _t=b.yylloc;i.push(_t);var Zt=b.options&&b.options.ranges;typeof M.yy.parseError=="function"?this.parseError=M.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function te(R){a.length=a.length-2*R,E.length=E.length-R,i.length=i.length-R}_(te,"popStack"),d(te,"popStack");function Lt(){var R;return R=g.pop()||b.lex()||q,typeof R!="number"&&(R instanceof Array&&(g=R,R=g.pop()),R=h.symbols_[R]||R),R}_(Lt,"lex"),d(Lt,"lex");for(var L,U,w,mt,W={},dt,Y,It,ft;;){if(U=a[a.length-1],this.defaultActions[U]?w=this.defaultActions[U]:((L===null||typeof L>"u")&&(L=Lt()),w=J[U]&&J[U][L]),typeof w>"u"||!w.length||!w[0]){var bt="";ft=[];for(dt in J[U])this.terminals_[dt]&&dt>ut&&ft.push("'"+this.terminals_[dt]+"'");b.showPosition?bt="Parse error on line "+(V+1)+`:
`+b.showPosition()+`
Expecting `+ft.join(", ")+", got '"+(this.terminals_[L]||L)+"'":bt="Parse error on line "+(V+1)+": Unexpected "+(L==q?"end of input":"'"+(this.terminals_[L]||L)+"'"),this.parseError(bt,{text:b.match,token:this.terminals_[L]||L,line:b.yylineno,loc:_t,expected:ft})}if(w[0]instanceof Array&&w.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+L);switch(w[0]){case 1:a.push(L),E.push(b.yytext),i.push(b.yylloc),a.push(w[1]),L=null,z=b.yyleng,l=b.yytext,V=b.yylineno,_t=b.yylloc;break;case 2:if(Y=this.productions_[w[1]][1],W.$=E[E.length-Y],W._$={first_line:i[i.length-(Y||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(Y||1)].first_column,last_column:i[i.length-1].last_column},Zt&&(W._$.range=[i[i.length-(Y||1)].range[0],i[i.length-1].range[1]]),mt=this.performAction.apply(W,[l,z,V,M.yy,w[1],E,i].concat(Tt)),typeof mt<"u")return mt;Y&&(a=a.slice(0,-1*Y*2),E=E.slice(0,-1*Y),i=i.slice(0,-1*Y)),a.push(this.productions_[w[1]][0]),E.push(W.$),i.push(W._$),It=J[a[a.length-2]][a[a.length-1]],a.push(It);break;case 3:return!0}}return!0},"parse"),"parse")},Qt=(function(){var G={EOF:1,parseError:d(_(function(h,a){if(this.yy.parser)this.yy.parser.parseError(h,a);else throw new Error(h)},"parseError"),"parseError"),setInput:d(function(o,h){return this.yy=h||this.yy||{},this._input=o,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:d(function(){var o=this._input[0];this.yytext+=o,this.yyleng++,this.offset++,this.match+=o,this.matched+=o;var h=o.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),o},"input"),unput:d(function(o){var h=o.length,a=o.split(/(?:\r\n?|\n)/g);this._input=o+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),a.length-1&&(this.yylineno-=a.length-1);var E=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:a?(a.length===g.length?this.yylloc.first_column:0)+g[g.length-a.length].length-a[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[E[0],E[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},"unput"),more:d(function(){return this._more=!0,this},"more"),reject:d(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:d(function(o){this.unput(this.match.slice(o))},"less"),pastInput:d(function(){var o=this.matched.substr(0,this.matched.length-this.match.length);return(o.length>20?"...":"")+o.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:d(function(){var o=this.match;return o.length<20&&(o+=this._input.substr(0,20-o.length)),(o.substr(0,20)+(o.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:d(function(){var o=this.pastInput(),h=new Array(o.length+1).join("-");return o+this.upcomingInput()+`
`+h+"^"},"showPosition"),test_match:d(function(o,h){var a,g,E;if(this.options.backtrack_lexer&&(E={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(E.yylloc.range=this.yylloc.range.slice(0))),g=o[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+o[0].length},this.yytext+=o[0],this.match+=o[0],this.matches=o,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(o[0].length),this.matched+=o[0],a=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),a)return a;if(this._backtrack){for(var i in E)this[i]=E[i];return!1}return!1},"test_match"),next:d(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var o,h,a,g;this._more||(this.yytext="",this.match="");for(var E=this._currentRules(),i=0;i<E.length;i++)if(a=this._input.match(this.rules[E[i]]),a&&(!h||a[0].length>h[0].length)){if(h=a,g=i,this.options.backtrack_lexer){if(o=this.test_match(a,E[i]),o!==!1)return o;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(o=this.test_match(h,E[g]),o!==!1?o:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:d(_(function(){var h=this.next();return h||this.lex()},"lex"),"lex"),begin:d(_(function(h){this.conditionStack.push(h)},"begin"),"begin"),popState:d(_(function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),"popState"),_currentRules:d(_(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),"_currentRules"),topState:d(_(function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},"topState"),"topState"),pushState:d(_(function(h){this.begin(h)},"pushState"),"pushState"),stateStackSize:d(_(function(){return this.conditionStack.length},"stateStackSize"),"stateStackSize"),options:{"case-insensitive":!0},performAction:d(_(function(h,a,g,E){switch(g){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:break;case 9:break;case 10:return 5;case 11:break;case 12:break;case 13:break;case 14:break;case 15:return this.pushState("SCALE"),17;case 16:return 18;case 17:this.popState();break;case 18:return this.begin("acc_title"),33;case 19:return this.popState(),"acc_title_value";case 20:return this.begin("acc_descr"),35;case 21:return this.popState(),"acc_descr_value";case 22:this.begin("acc_descr_multiline");break;case 23:this.popState();break;case 24:return"acc_descr_multiline_value";case 25:return this.pushState("CLASSDEF"),41;case 26:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";case 27:return this.popState(),this.pushState("CLASSDEFID"),42;case 28:return this.popState(),43;case 29:return this.pushState("CLASS"),48;case 30:return this.popState(),this.pushState("CLASS_STYLE"),49;case 31:return this.popState(),50;case 32:return this.pushState("STYLE"),45;case 33:return this.popState(),this.pushState("STYLEDEF_STYLES"),46;case 34:return this.popState(),47;case 35:return this.pushState("SCALE"),17;case 36:return 18;case 37:this.popState();break;case 38:this.pushState("STATE");break;case 39:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),25;case 40:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),26;case 41:return this.popState(),a.yytext=a.yytext.slice(0,-10).trim(),27;case 42:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),25;case 43:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),26;case 44:return this.popState(),a.yytext=a.yytext.slice(0,-10).trim(),27;case 45:return 51;case 46:return 52;case 47:return 53;case 48:return 54;case 49:this.pushState("STATE_STRING");break;case 50:return this.pushState("STATE_ID"),"AS";case 51:return this.popState(),"ID";case 52:this.popState();break;case 53:return"STATE_DESCR";case 54:return 19;case 55:this.popState();break;case 56:return this.popState(),this.pushState("struct"),20;case 57:break;case 58:return this.popState(),21;case 59:break;case 60:return this.begin("NOTE"),29;case 61:return this.popState(),this.pushState("NOTE_ID"),59;case 62:return this.popState(),this.pushState("NOTE_ID"),60;case 63:this.popState(),this.pushState("FLOATING_NOTE");break;case 64:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";case 65:break;case 66:return"NOTE_TEXT";case 67:return this.popState(),"ID";case 68:return this.popState(),this.pushState("NOTE_TEXT"),24;case 69:return this.popState(),a.yytext=a.yytext.substr(2).trim(),31;case 70:return this.popState(),a.yytext=a.yytext.slice(0,-8).trim(),31;case 71:return 6;case 72:return 6;case 73:return 16;case 74:return 57;case 75:return 24;case 76:return a.yytext=a.yytext.trim(),14;case 77:return 15;case 78:return 28;case 79:return 58;case 80:return 5;case 81:return"INVALID"}},"anonymous"),"anonymous"),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[12,13],inclusive:!1},struct:{rules:[12,13,25,29,32,38,45,46,47,48,57,58,59,60,74,75,76,77,78],inclusive:!1},FLOATING_NOTE_ID:{rules:[67],inclusive:!1},FLOATING_NOTE:{rules:[64,65,66],inclusive:!1},NOTE_TEXT:{rules:[69,70],inclusive:!1},NOTE_ID:{rules:[68],inclusive:!1},NOTE:{rules:[61,62,63],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[34],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[33],inclusive:!1},CLASS_STYLE:{rules:[31],inclusive:!1},CLASS:{rules:[30],inclusive:!1},CLASSDEFID:{rules:[28],inclusive:!1},CLASSDEF:{rules:[26,27],inclusive:!1},acc_descr_multiline:{rules:[23,24],inclusive:!1},acc_descr:{rules:[21],inclusive:!1},acc_title:{rules:[19],inclusive:!1},SCALE:{rules:[16,17,36,37],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[51],inclusive:!1},STATE_STRING:{rules:[52,53],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[12,13,39,40,41,42,43,44,49,50,54,55,56],inclusive:!1},ID:{rules:[12,13],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,13,14,15,18,20,22,25,29,32,35,38,56,60,71,72,73,74,75,76,77,79,80,81],inclusive:!0}}};return G})();gt.lexer=Qt;function ht(){this.yy={}}return _(ht,"Parser"),d(ht,"Parser"),ht.prototype=gt,gt.Parser=ht,new ht})();vt.parser=vt;var Ue=vt,pe="TB",Gt="TB",Rt="dir",X="state",K="root",Ct="relation",Se="classDef",ye="style",ge="applyClass",tt="default",Bt="divider",Vt="fill:none",Mt="fill: #333",Ut="c",jt="text",Ht="normal",Dt="rect",kt="rectWithTitle",Te="stateStart",Ee="stateEnd",Nt="divider",wt="roundedWithTitle",_e="note",me="noteGroup",et="statediagram",be="state",De=`${et}-${be}`,zt="transition",ke="note",ve="note-edge",Ce=`${zt} ${ve}`,Ae=`${et}-${ke}`,xe="cluster",Le=`${et}-${xe}`,Ie="cluster-alt",Oe=`${et}-${Ie}`,Wt="parent",Kt="note",Re="state",At="----",Ne=`${At}${Kt}`,$t=`${At}${Wt}`,Xt=d((t,e=Gt)=>{if(!t.doc)return e;let n=e;for(const s of t.doc)s.stmt==="dir"&&(n=s.value);return n},"getDir"),we=d(function(t,e){return e.db.getClasses()},"getClasses"),$e=d(function(t,e,n,s){return Ot(this,null,function*(){m.info("REF0:"),m.info("Drawing state diagram (v2)",e);const{securityLevel:c,state:u,layout:S}=$();s.db.extract(s.db.getRootDocV2());const y=s.db.getData(),r=se(e,c);y.type=s.type,y.layoutAlgorithm=S,y.nodeSpacing=u?.nodeSpacing||50,y.rankSpacing=u?.rankSpacing||50,y.markers=["barb"],y.diagramId=e,yield re(y,r);const T=8;try{(typeof s.db.getLinks=="function"?s.db.getLinks():new Map).forEach((A,x)=>{const v=typeof x=="string"?x:typeof x?.id=="string"?x.id:"";if(!v){m.warn("⚠️ Invalid or missing stateId from key:",JSON.stringify(x));return}const f=r.node()?.querySelectorAll("g");let k;if(f?.forEach(O=>{O.textContent?.trim()===v&&(k=O)}),!k){m.warn("⚠️ Could not find node matching text:",v);return}const N=k.parentNode;if(!N){m.warn("⚠️ Node has no parent, cannot wrap:",v);return}const I=document.createElementNS("http://www.w3.org/2000/svg","a"),P=A.url.replace(/^"+|"+$/g,"");if(I.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",P),I.setAttribute("target","_blank"),A.tooltip){const O=A.tooltip.replace(/^"+|"+$/g,"");I.setAttribute("title",O)}N.replaceChild(I,k),I.appendChild(k),m.info("🔗 Wrapped node in <a> tag for:",v,A.url)})}catch(D){m.error("❌ Error injecting clickable links:",D)}ae.insertTitle(r,"statediagramTitleText",u?.titleTopMargin??25,s.db.getDiagramTitle()),ie(r,T,et,u?.useMaxWidth??!0)})},"draw"),je={getClasses:we,draw:$e,getDir:Xt},St=new Map,B=0;function yt(t="",e=0,n="",s=At){const c=n!==null&&n.length>0?`${s}${n}`:"";return`${Re}-${t}${c}-${e}`}_(yt,"stateDomId");d(yt,"stateDomId");var Pe=d((t,e,n,s,c,u,S,y)=>{m.trace("items",e),e.forEach(r=>{switch(r.stmt){case X:Z(t,r,n,s,c,u,S,y);break;case tt:Z(t,r,n,s,c,u,S,y);break;case Ct:{Z(t,r.state1,n,s,c,u,S,y),Z(t,r.state2,n,s,c,u,S,y);const T={id:"edge"+B,start:r.state1.id,end:r.state2.id,arrowhead:"normal",arrowTypeEnd:"arrow_barb",style:Vt,labelStyle:"",label:j.sanitizeText(r.description??"",$()),arrowheadStyle:Mt,labelpos:Ut,labelType:jt,thickness:Ht,classes:zt,look:S};c.push(T),B++}break}})},"setupDoc"),Pt=d((t,e=Gt)=>{let n=e;if(t.doc)for(const s of t.doc)s.stmt==="dir"&&(n=s.value);return n},"getDir");function Q(t,e,n){if(!e.id||e.id==="</join></fork>"||e.id==="</choice>")return;e.cssClasses&&(Array.isArray(e.cssCompiledStyles)||(e.cssCompiledStyles=[]),e.cssClasses.split(" ").forEach(c=>{const u=n.get(c);u&&(e.cssCompiledStyles=[...e.cssCompiledStyles??[],...u.styles])}));const s=t.find(c=>c.id===e.id);s?Object.assign(s,e):t.push(e)}_(Q,"insertOrUpdateNode");d(Q,"insertOrUpdateNode");function Jt(t){return t?.classes?.join(" ")??""}_(Jt,"getClassesFromDbInfo");d(Jt,"getClassesFromDbInfo");function qt(t){return t?.styles??[]}_(qt,"getStylesFromDbInfo");d(qt,"getStylesFromDbInfo");var Z=d((t,e,n,s,c,u,S,y)=>{const r=e.id,T=n.get(r),D=Jt(T),A=qt(T),x=$();if(m.info("dataFetcher parsedItem",e,T,A),r!=="root"){let v=Dt;e.start===!0?v=Te:e.start===!1&&(v=Ee),e.type!==tt&&(v=e.type),St.get(r)||St.set(r,{id:r,shape:v,description:j.sanitizeText(r,x),cssClasses:`${D} ${De}`,cssStyles:A});const f=St.get(r);e.description&&(Array.isArray(f.description)?(f.shape=kt,f.description.push(e.description)):f.description?.length&&f.description.length>0?(f.shape=kt,f.description===r?f.description=[e.description]:f.description=[f.description,e.description]):(f.shape=Dt,f.description=e.description),f.description=j.sanitizeTextOrArray(f.description,x)),f.description?.length===1&&f.shape===kt&&(f.type==="group"?f.shape=wt:f.shape=Dt),!f.type&&e.doc&&(m.info("Setting cluster for XCX",r,Pt(e)),f.type="group",f.isGroup=!0,f.dir=Pt(e),f.shape=e.type===Bt?Nt:wt,f.cssClasses=`${f.cssClasses} ${Le} ${u?Oe:""}`);const k={labelStyle:"",shape:f.shape,label:f.description,cssClasses:f.cssClasses,cssCompiledStyles:[],cssStyles:f.cssStyles,id:r,dir:f.dir,domId:yt(r,B),type:f.type,isGroup:f.type==="group",padding:8,rx:10,ry:10,look:S};if(k.shape===Nt&&(k.label=""),t&&t.id!=="root"&&(m.trace("Setting node ",r," to be child of its parent ",t.id),k.parentId=t.id),k.centerLabel=!0,e.note){const N={labelStyle:"",shape:_e,label:e.note.text,cssClasses:Ae,cssStyles:[],cssCompiledStyles:[],id:r+Ne+"-"+B,domId:yt(r,B,Kt),type:f.type,isGroup:f.type==="group",padding:x.flowchart?.padding,look:S,position:e.note.position},I=r+$t,P={labelStyle:"",shape:me,label:e.note.text,cssClasses:f.cssClasses,cssStyles:[],id:r+$t,domId:yt(r,B,Wt),type:"group",isGroup:!0,padding:16,look:S,position:e.note.position};B++,P.id=I,N.parentId=I,Q(s,P,y),Q(s,N,y),Q(s,k,y);let O=r,F=N.id;e.note.position==="left of"&&(O=N.id,F=r),c.push({id:O+"-"+F,start:O,end:F,arrowhead:"none",arrowTypeEnd:"",style:Vt,labelStyle:"",classes:Ce,arrowheadStyle:Mt,labelpos:Ut,labelType:jt,thickness:Ht,look:S})}else Q(s,k,y)}e.doc&&(m.trace("Adding nodes children "),Pe(e,e.doc,n,s,c,!u,S,y))},"dataFetcher"),Fe=d(()=>{St.clear(),B=0},"reset"),C={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},Ft=d(()=>new Map,"newClassesList"),Yt=d(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),pt=d(t=>JSON.parse(JSON.stringify(t)),"clone"),He=class{static{_(this,"StateDB")}constructor(t){this.version=t,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=Ft(),this.documents={root:Yt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.getAccTitle=ne,this.setAccTitle=oe,this.getAccDescription=le,this.setAccDescription=ce,this.setDiagramTitle=he,this.getDiagramTitle=ue,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this)}static{d(this,"StateDB")}static{this.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3}}extract(t){this.clear(!0);for(const s of Array.isArray(t)?t:t.doc)switch(s.stmt){case X:this.addState(s.id.trim(),s.type,s.doc,s.description,s.note);break;case Ct:this.addRelation(s.state1,s.state2,s.description);break;case Se:this.addStyleClass(s.id.trim(),s.classes);break;case ye:this.handleStyleDef(s);break;case ge:this.setCssClass(s.id.trim(),s.styleClass);break;case"click":this.addLink(s.id,s.url,s.tooltip);break}const e=this.getStates(),n=$();Fe(),Z(void 0,this.getRootDocV2(),e,this.nodes,this.edges,!0,n.look,this.classes);for(const s of this.nodes)if(Array.isArray(s.label)){if(s.description=s.label.slice(1),s.isGroup&&s.description.length>0)throw new Error(`Group nodes can only have label. Remove the additional description for node [${s.id}]`);s.label=s.label[0]}}handleStyleDef(t){const e=t.id.trim().split(","),n=t.styleClass.split(",");for(const s of e){let c=this.getState(s);if(!c){const u=s.trim();this.addState(u),c=this.getState(u)}c&&(c.styles=n.map(u=>u.replace(/;/g,"")?.trim()))}}setRootDoc(t){m.info("Setting root doc",t),this.rootDoc=t,this.version===1?this.extract(t):this.extract(this.getRootDocV2())}docTranslator(t,e,n){if(e.stmt===Ct){this.docTranslator(t,e.state1,!0),this.docTranslator(t,e.state2,!1);return}if(e.stmt===X&&(e.id===C.START_NODE?(e.id=t.id+(n?"_start":"_end"),e.start=n):e.id=e.id.trim()),e.stmt!==K&&e.stmt!==X||!e.doc)return;const s=[];let c=[];for(const u of e.doc)if(u.type===Bt){const S=pt(u);S.doc=pt(c),s.push(S),c=[]}else c.push(u);if(s.length>0&&c.length>0){const u={stmt:X,id:de(),type:"divider",doc:pt(c)};s.push(pt(u)),e.doc=s}e.doc.forEach(u=>this.docTranslator(e,u,!0))}getRootDocV2(){return this.docTranslator({id:K,stmt:K},{id:K,stmt:K,doc:this.rootDoc},!0),{id:K,doc:this.rootDoc}}addState(t,e=tt,n=void 0,s=void 0,c=void 0,u=void 0,S=void 0,y=void 0){const r=t?.trim();if(!this.currentDocument.states.has(r))m.info("Adding state ",r,s),this.currentDocument.states.set(r,{stmt:X,id:r,descriptions:[],type:e,doc:n,note:c,classes:[],styles:[],textStyles:[]});else{const T=this.currentDocument.states.get(r);if(!T)throw new Error(`State not found: ${r}`);T.doc||(T.doc=n),T.type||(T.type=e)}if(s&&(m.info("Setting state description",r,s),(Array.isArray(s)?s:[s]).forEach(D=>this.addDescription(r,D.trim()))),c){const T=this.currentDocument.states.get(r);if(!T)throw new Error(`State not found: ${r}`);T.note=c,T.note.text=j.sanitizeText(T.note.text,$())}u&&(m.info("Setting state classes",r,u),(Array.isArray(u)?u:[u]).forEach(D=>this.setCssClass(r,D.trim()))),S&&(m.info("Setting state styles",r,S),(Array.isArray(S)?S:[S]).forEach(D=>this.setStyle(r,D.trim()))),y&&(m.info("Setting state styles",r,S),(Array.isArray(y)?y:[y]).forEach(D=>this.setTextStyle(r,D.trim())))}clear(t){this.nodes=[],this.edges=[],this.documents={root:Yt()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=Ft(),t||(this.links=new Map,fe())}getState(t){return this.currentDocument.states.get(t)}getStates(){return this.currentDocument.states}logDocuments(){m.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}addLink(t,e,n){this.links.set(t,{url:e,tooltip:n}),m.warn("Adding link",t,e,n)}getLinks(){return this.links}startIdIfNeeded(t=""){return t===C.START_NODE?(this.startEndCount++,`${C.START_TYPE}${this.startEndCount}`):t}startTypeIfNeeded(t="",e=tt){return t===C.START_NODE?C.START_TYPE:e}endIdIfNeeded(t=""){return t===C.END_NODE?(this.startEndCount++,`${C.END_TYPE}${this.startEndCount}`):t}endTypeIfNeeded(t="",e=tt){return t===C.END_NODE?C.END_TYPE:e}addRelationObjs(t,e,n=""){const s=this.startIdIfNeeded(t.id.trim()),c=this.startTypeIfNeeded(t.id.trim(),t.type),u=this.startIdIfNeeded(e.id.trim()),S=this.startTypeIfNeeded(e.id.trim(),e.type);this.addState(s,c,t.doc,t.description,t.note,t.classes,t.styles,t.textStyles),this.addState(u,S,e.doc,e.description,e.note,e.classes,e.styles,e.textStyles),this.currentDocument.relations.push({id1:s,id2:u,relationTitle:j.sanitizeText(n,$())})}addRelation(t,e,n){if(typeof t=="object"&&typeof e=="object")this.addRelationObjs(t,e,n);else if(typeof t=="string"&&typeof e=="string"){const s=this.startIdIfNeeded(t.trim()),c=this.startTypeIfNeeded(t),u=this.endIdIfNeeded(e.trim()),S=this.endTypeIfNeeded(e);this.addState(s,c),this.addState(u,S),this.currentDocument.relations.push({id1:s,id2:u,relationTitle:n?j.sanitizeText(n,$()):void 0})}}addDescription(t,e){const n=this.currentDocument.states.get(t),s=e.startsWith(":")?e.replace(":","").trim():e;n?.descriptions?.push(j.sanitizeText(s,$()))}cleanupLabel(t){return t.startsWith(":")?t.slice(2).trim():t.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(t,e=""){this.classes.has(t)||this.classes.set(t,{id:t,styles:[],textStyles:[]});const n=this.classes.get(t);e&&n&&e.split(C.STYLECLASS_SEP).forEach(s=>{const c=s.replace(/([^;]*);/,"$1").trim();if(RegExp(C.COLOR_KEYWORD).exec(s)){const S=c.replace(C.FILL_KEYWORD,C.BG_FILL).replace(C.COLOR_KEYWORD,C.FILL_KEYWORD);n.textStyles.push(S)}n.styles.push(c)})}getClasses(){return this.classes}setCssClass(t,e){t.split(",").forEach(n=>{let s=this.getState(n);if(!s){const c=n.trim();this.addState(c),s=this.getState(c)}s?.classes?.push(e)})}setStyle(t,e){this.getState(t)?.styles?.push(e)}setTextStyle(t,e){this.getState(t)?.textStyles?.push(e)}getDirectionStatement(){return this.rootDoc.find(t=>t.stmt===Rt)}getDirection(){return this.getDirectionStatement()?.value??pe}setDirection(t){const e=this.getDirectionStatement();e?e.value=t:this.rootDoc.unshift({stmt:Rt,value:t})}trimColon(t){return t.startsWith(":")?t.slice(1).trim():t.trim()}getData(){const t=$();return{nodes:this.nodes,edges:this.edges,other:{},config:t,direction:Xt(this.getRootDocV2())}}getConfig(){return $().state}},Ye=d(t=>`
defs #statediagram-barbEnd {
    fill: ${t.transitionColor};
    stroke: ${t.transitionColor};
  }
g.stateGroup text {
  fill: ${t.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${t.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${t.stateLabelColor};
}

g.stateGroup rect {
  fill: ${t.mainBkg};
  stroke: ${t.nodeBorder};
}

g.stateGroup line {
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.transition {
  stroke: ${t.transitionColor};
  stroke-width: 1;
  fill: none;
}

.stateGroup .composit {
  fill: ${t.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${t.noteBorderColor};
  fill: ${t.noteBkgColor};

  text {
    fill: ${t.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${t.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${t.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${t.edgeLabelBackground};
  p {
    background-color: ${t.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${t.edgeLabelBackground};
    fill: ${t.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${t.transitionLabelColor||t.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${t.transitionLabelColor||t.tertiaryTextColor};
}

.stateLabel text {
  fill: ${t.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node .fork-join {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node circle.state-end {
  fill: ${t.innerEndBackground};
  stroke: ${t.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${t.compositeBackground||t.background};
  // stroke: ${t.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${t.stateBkg||t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}
.node polygon {
  fill: ${t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};;
  stroke-width: 1px;
}
#statediagram-barbEnd {
  fill: ${t.lineColor};
}

.statediagram-cluster rect {
  fill: ${t.compositeTitleBackground};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}

.cluster-label, .nodeLabel {
  color: ${t.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${t.stateBorder||t.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${t.compositeBackground||t.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${t.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${t.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${t.noteTextColor};
}

#dependencyStart, #dependencyEnd {
  fill: ${t.lineColor};
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${t.textColor};
}
`,"getStyles"),ze=Ye;export{He as S,Ue as a,je as b,ze as s};
