var C=Object.defineProperty;var m=(t,e)=>C(t,"name",{value:e,configurable:!0});var u=(t,e,r)=>new Promise((i,n)=>{var d=s=>{try{o(r.next(s))}catch(l){n(l)}},a=s=>{try{o(r.throw(s))}catch(l){n(l)}},o=s=>s.done?i(s.value):Promise.resolve(s.value).then(d,a);o((r=r.apply(t,e)).next())});import{_ as b,F as w,K as S,e as D,l as v,b as T,a as z,q as F,t as P,g as E,s as A,G as W,H as _,z as N}from"./mermaid.core-CmbX8jIc.js";import{p as L}from"./chunk-4BX2VUAB-JcjM9Ijh.js";import{p as M}from"./treemap-GDKQZRPO-DnLkl3__.js";import"./index-Dkb6wQiz.js";import"./string-B6VGc56F.js";import"./_baseUniq-CKSlxNc8.js";import"./_basePickBy-CKjjW-KR.js";import"./clone-B7PsTYLv.js";var Y=W.packet,x=class{static{m(this,"PacketDB")}constructor(){this.packet=[],this.setAccTitle=T,this.getAccTitle=z,this.setDiagramTitle=F,this.getDiagramTitle=P,this.getAccDescription=E,this.setAccDescription=A}static{b(this,"PacketDB")}getConfig(){const t=w({...Y,..._().packet});return t.showBits&&(t.paddingY+=10),t}getPacket(){return this.packet}pushWord(t){t.length>0&&this.packet.push(t)}clear(){N(),this.packet=[]}},G=1e4,H=b((t,e)=>{L(t,e);let r=-1,i=[],n=1;const{bitsPerRow:d}=e.getConfig();for(let{start:a,end:o,bits:s,label:l}of t.blocks){if(a!==void 0&&o!==void 0&&o<a)throw new Error(`Packet block ${a} - ${o} is invalid. End must be greater than start.`);if(a??=r+1,a!==r+1)throw new Error(`Packet block ${a} - ${o??a} is not contiguous. It should start from ${r+1}.`);if(s===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(o??=a+(s??1)-1,s??=o-a+1,r=o,v.debug(`Packet block ${a} - ${r} with label ${l}`);i.length<=d+1&&e.getPacket().length<G;){const[p,c]=I({start:a,end:o,bits:s,label:l},n,d);if(i.push(p),p.end+1===n*d&&(e.pushWord(i),i=[],n++),!c)break;({start:a,end:o,bits:s,label:l}=c)}}e.pushWord(i)},"populate"),I=b((t,e,r)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*r)return[t,void 0];const i=e*r-1,n=e*r;return[{start:t.start,end:i,label:t.label,bits:i-t.start},{start:n,end:t.end,label:t.label,bits:t.end-n}]},"getNextFittingBlock"),y={parser:{yy:void 0},parse:b(t=>u(null,null,function*(){const e=yield M("packet",t),r=y.parser?.yy;if(!(r instanceof x))throw new Error("parser.parser?.yy was not a PacketDB. This is due to a bug within Mermaid, please report this issue at https://github.com/mermaid-js/mermaid/issues.");v.debug(e),H(e,r)}),"parse")},K=b((t,e,r,i)=>{const n=i.db,d=n.getConfig(),{rowHeight:a,paddingY:o,bitWidth:s,bitsPerRow:l}=d,p=n.getPacket(),c=n.getDiagramTitle(),h=a+o,g=h*(p.length+1)-(c?0:a),k=s*l+2,f=S(e);f.attr("viewbox",`0 0 ${k} ${g}`),D(f,g,k,d.useMaxWidth);for(const[$,B]of p.entries())O(f,B,$,d);f.append("text").text(c).attr("x",k/2).attr("y",g-h/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),O=b((t,e,r,{rowHeight:i,paddingX:n,paddingY:d,bitWidth:a,bitsPerRow:o,showBits:s})=>{const l=t.append("g"),p=r*(i+d)+d;for(const c of e){const h=c.start%o*a+1,g=(c.end-c.start+1)*a-n;if(l.append("rect").attr("x",h).attr("y",p).attr("width",g).attr("height",i).attr("class","packetBlock"),l.append("text").attr("x",h+g/2).attr("y",p+i/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(c.label),!s)continue;const k=c.end===c.start,f=p-2;l.append("text").attr("x",h+(k?g/2:0)).attr("y",f).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",k?"middle":"start").text(c.start),k||l.append("text").attr("x",h+g).attr("y",f).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(c.end)}},"drawWord"),j={draw:K},q={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},R=b(({packet:t}={})=>{const e=w(q,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),rt={parser:y,get db(){return new x},renderer:j,styles:R};export{rt as diagram};
