var F=Object.defineProperty;var $=(a,t)=>F(a,"name",{value:t,configurable:!0});var w=(a,t,e)=>new Promise((r,s)=>{var i=o=>{try{n(e.next(o))}catch(d){s(d)}},l=o=>{try{n(e.throw(o))}catch(d){s(d)}},n=o=>o.done?r(o.value):Promise.resolve(o.value).then(i,l);n((e=e.apply(a,t)).next())});import{s as I,g as _,t as E,q as D,a as G,b as z,_ as c,K as P,z as H,F as C,G as V,H as b,l as W,a1 as B}from"./mermaid.core-CmbX8jIc.js";import{p as j}from"./chunk-4BX2VUAB-JcjM9Ijh.js";import{p as q}from"./treemap-GDKQZRPO-DnLkl3__.js";import"./index-Dkb6wQiz.js";import"./string-B6VGc56F.js";import"./_baseUniq-CKSlxNc8.js";import"./_basePickBy-CKjjW-KR.js";import"./clone-B7PsTYLv.js";var h={showLegend:!0,ticks:5,max:null,min:0,graticule:"circle"},M={axes:[],curves:[],options:h},m=structuredClone(M),K=V.radar,N=c(()=>C({...K,...b().radar}),"getConfig"),A=c(()=>m.axes,"getAxes"),U=c(()=>m.curves,"getCurves"),X=c(()=>m.options,"getOptions"),Y=c(a=>{m.axes=a.map(t=>({name:t.name,label:t.label??t.name}))},"setAxes"),Z=c(a=>{m.curves=a.map(t=>({name:t.name,label:t.label??t.name,entries:J(t.entries)}))},"setCurves"),J=c(a=>{if(a[0].axis==null)return a.map(e=>e.value);const t=A();if(t.length===0)throw new Error("Axes must be populated before curves for reference entries");return t.map(e=>{const r=a.find(s=>s.axis?.$refText===e.name);if(r===void 0)throw new Error("Missing entry for axis "+e.label);return r.value})},"computeCurveEntries"),Q=c(a=>{const t=a.reduce((e,r)=>(e[r.name]=r,e),{});m.options={showLegend:t.showLegend?.value??h.showLegend,ticks:t.ticks?.value??h.ticks,max:t.max?.value??h.max,min:t.min?.value??h.min,graticule:t.graticule?.value??h.graticule}},"setOptions"),tt=c(()=>{H(),m=structuredClone(M)},"clear"),f={getAxes:A,getCurves:U,getOptions:X,setAxes:Y,setCurves:Z,setOptions:Q,getConfig:N,clear:tt,setAccTitle:z,getAccTitle:G,setDiagramTitle:D,getDiagramTitle:E,getAccDescription:_,setAccDescription:I},et=c(a=>{j(a,f);const{axes:t,curves:e,options:r}=a;f.setAxes(t),f.setCurves(e),f.setOptions(r)},"populate"),at={parse:c(a=>w(null,null,function*(){const t=yield q("radar",a);W.debug(t),et(t)}),"parse")},rt=c((a,t,e,r)=>{const s=r.db,i=s.getAxes(),l=s.getCurves(),n=s.getOptions(),o=s.getConfig(),d=s.getDiagramTitle(),u=P(t),p=st(u,o),g=n.max??Math.max(...l.map(y=>Math.max(...y.entries))),x=n.min,v=Math.min(o.width,o.height)/2;nt(p,i,v,n.ticks,n.graticule),ot(p,i,v,o),L(p,i,l,x,g,n.graticule,o),S(p,l,n.showLegend,o),p.append("text").attr("class","radarTitle").text(d).attr("x",0).attr("y",-o.height/2-o.marginTop)},"draw"),st=c((a,t)=>{const e=t.width+t.marginLeft+t.marginRight,r=t.height+t.marginTop+t.marginBottom,s={x:t.marginLeft+t.width/2,y:t.marginTop+t.height/2};return a.attr("viewbox",`0 0 ${e} ${r}`).attr("width",e).attr("height",r),a.append("g").attr("transform",`translate(${s.x}, ${s.y})`)},"drawFrame"),nt=c((a,t,e,r,s)=>{if(s==="circle")for(let i=0;i<r;i++){const l=e*(i+1)/r;a.append("circle").attr("r",l).attr("class","radarGraticule")}else if(s==="polygon"){const i=t.length;for(let l=0;l<r;l++){const n=e*(l+1)/r,o=t.map((d,u)=>{const p=2*u*Math.PI/i-Math.PI/2,g=n*Math.cos(p),x=n*Math.sin(p);return`${g},${x}`}).join(" ");a.append("polygon").attr("points",o).attr("class","radarGraticule")}}},"drawGraticule"),ot=c((a,t,e,r)=>{const s=t.length;for(let i=0;i<s;i++){const l=t[i].label,n=2*i*Math.PI/s-Math.PI/2;a.append("line").attr("x1",0).attr("y1",0).attr("x2",e*r.axisScaleFactor*Math.cos(n)).attr("y2",e*r.axisScaleFactor*Math.sin(n)).attr("class","radarAxisLine"),a.append("text").text(l).attr("x",e*r.axisLabelFactor*Math.cos(n)).attr("y",e*r.axisLabelFactor*Math.sin(n)).attr("class","radarAxisLabel")}},"drawAxes");function L(a,t,e,r,s,i,l){const n=t.length,o=Math.min(l.width,l.height)/2;e.forEach((d,u)=>{if(d.entries.length!==n)return;const p=d.entries.map((g,x)=>{const v=2*Math.PI*x/n-Math.PI/2,y=T(g,r,s,o),k=y*Math.cos(v),R=y*Math.sin(v);return{x:k,y:R}});i==="circle"?a.append("path").attr("d",O(p,l.curveTension)).attr("class",`radarCurve-${u}`):i==="polygon"&&a.append("polygon").attr("points",p.map(g=>`${g.x},${g.y}`).join(" ")).attr("class",`radarCurve-${u}`)})}$(L,"drawCurves");c(L,"drawCurves");function T(a,t,e,r){const s=Math.min(Math.max(a,t),e);return r*(s-t)/(e-t)}$(T,"relativeRadius");c(T,"relativeRadius");function O(a,t){const e=a.length;let r=`M${a[0].x},${a[0].y}`;for(let s=0;s<e;s++){const i=a[(s-1+e)%e],l=a[s],n=a[(s+1)%e],o=a[(s+2)%e],d={x:l.x+(n.x-i.x)*t,y:l.y+(n.y-i.y)*t},u={x:n.x-(o.x-l.x)*t,y:n.y-(o.y-l.y)*t};r+=` C${d.x},${d.y} ${u.x},${u.y} ${n.x},${n.y}`}return`${r} Z`}$(O,"closedRoundCurve");c(O,"closedRoundCurve");function S(a,t,e,r){if(!e)return;const s=(r.width/2+r.marginRight)*3/4,i=-(r.height/2+r.marginTop)*3/4,l=20;t.forEach((n,o)=>{const d=a.append("g").attr("transform",`translate(${s}, ${i+o*l})`);d.append("rect").attr("width",12).attr("height",12).attr("class",`radarLegendBox-${o}`),d.append("text").attr("x",16).attr("y",0).attr("class","radarLegendText").text(n.label)})}$(S,"drawLegend");c(S,"drawLegend");var it={draw:rt},lt=c((a,t)=>{let e="";for(let r=0;r<a.THEME_COLOR_LIMIT;r++){const s=a[`cScale${r}`];e+=`
		.radarCurve-${r} {
			color: ${s};
			fill: ${s};
			fill-opacity: ${t.curveOpacity};
			stroke: ${s};
			stroke-width: ${t.curveStrokeWidth};
		}
		.radarLegendBox-${r} {
			fill: ${s};
			fill-opacity: ${t.curveOpacity};
			stroke: ${s};
		}
		`}return e},"genIndexStyles"),ct=c(a=>{const t=B(),e=b(),r=C(t,e.themeVariables),s=C(r.radar,a);return{themeVariables:r,radarOptions:s}},"buildRadarStyleOptions"),dt=c(({radar:a}={})=>{const{themeVariables:t,radarOptions:e}=ct(a);return`
	.radarTitle {
		font-size: ${t.fontSize};
		color: ${t.titleColor};
		dominant-baseline: hanging;
		text-anchor: middle;
	}
	.radarAxisLine {
		stroke: ${e.axisColor};
		stroke-width: ${e.axisStrokeWidth};
	}
	.radarAxisLabel {
		dominant-baseline: middle;
		text-anchor: middle;
		font-size: ${e.axisLabelFontSize}px;
		color: ${e.axisColor};
	}
	.radarGraticule {
		fill: ${e.graticuleColor};
		fill-opacity: ${e.graticuleOpacity};
		stroke: ${e.graticuleColor};
		stroke-width: ${e.graticuleStrokeWidth};
	}
	.radarLegendText {
		text-anchor: start;
		font-size: ${e.legendFontSize}px;
		dominant-baseline: hanging;
	}
	${lt(t,e)}
	`},"styles"),yt={parser:at,db:f,renderer:it,styles:dt};export{yt as diagram};
