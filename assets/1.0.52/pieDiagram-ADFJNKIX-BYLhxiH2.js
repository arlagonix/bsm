var K=Object.defineProperty;var C=(e,a)=>K(e,"name",{value:a,configurable:!0});var L=(e,a,u)=>new Promise((m,i)=>{var c=r=>{try{t(u.next(r))}catch(o){i(o)}},l=r=>{try{t(u.throw(r))}catch(o){i(o)}},t=r=>r.done?m(r.value):Promise.resolve(r.value).then(c,l);t((u=u.apply(e,a)).next())});import{Q as x,T as F,aG as Q,g as Z,s as H,a as J,b as X,t as Y,q as ee,_ as d,l as G,c as te,F as ae,K as re,a4 as ne,e as ie,z as se,G as le}from"./mermaid.core-CmbX8jIc.js";import{p as oe}from"./chunk-4BX2VUAB-JcjM9Ijh.js";import{p as ce}from"./treemap-GDKQZRPO-DnLkl3__.js";import{d as _}from"./arc-BOnbBQbM.js";import{o as ue}from"./ordinal-Dk_P3Emm.js";import"./index-Dkb6wQiz.js";import"./string-B6VGc56F.js";import"./_baseUniq-CKSlxNc8.js";import"./_basePickBy-CKjjW-KR.js";import"./clone-B7PsTYLv.js";import"./init-GRbUuopv.js";function pe(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}C(pe,"descending");function de(e){return e}C(de,"identity");function ge(){var e=de,a=pe,u=null,m=x(0),i=x(F),c=x(0);function l(t){var r,o=(t=Q(t)).length,g,y,v=0,p=new Array(o),s=new Array(o),S=+m.apply(this,arguments),w=Math.min(F,Math.max(-F,i.apply(this,arguments)-S)),h,$=Math.min(Math.abs(w)/o,c.apply(this,arguments)),T=$*(w<0?-1:1),f;for(r=0;r<o;++r)(f=s[p[r]=r]=+e(t[r],r,t))>0&&(v+=f);for(a!=null?p.sort(function(A,D){return a(s[A],s[D])}):u!=null&&p.sort(function(A,D){return u(t[A],t[D])}),r=0,y=v?(w-o*T)/v:0;r<o;++r,S=h)g=p[r],f=s[g],h=S+(f>0?f*y:0)+T,s[g]={data:t[g],index:r,value:f,startAngle:S,endAngle:h,padAngle:$};return s}return C(l,"pie"),l.value=function(t){return arguments.length?(e=typeof t=="function"?t:x(+t),l):e},l.sortValues=function(t){return arguments.length?(a=t,u=null,l):a},l.sort=function(t){return arguments.length?(u=t,a=null,l):u},l.startAngle=function(t){return arguments.length?(m=typeof t=="function"?t:x(+t),l):m},l.endAngle=function(t){return arguments.length?(i=typeof t=="function"?t:x(+t),l):i},l.padAngle=function(t){return arguments.length?(c=typeof t=="function"?t:x(+t),l):c},l}C(ge,"d3pie");var fe=le.pie,N={sections:new Map,showData:!1},b=N.sections,W=N.showData,me=structuredClone(fe),he=d(()=>structuredClone(me),"getConfig"),ve=d(()=>{b=new Map,W=N.showData,se()},"clear"),Se=d(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);b.has(e)||(b.set(e,a),G.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),xe=d(()=>b,"getSections"),ye=d(e=>{W=e},"setShowData"),we=d(()=>W,"getShowData"),B={getConfig:he,clear:ve,setDiagramTitle:ee,getDiagramTitle:Y,setAccTitle:X,getAccTitle:J,setAccDescription:H,getAccDescription:Z,addSection:Se,getSections:xe,setShowData:ye,getShowData:we},Ae=d((e,a)=>{oe(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),De={parse:d(e=>L(null,null,function*(){const a=yield ce("pie",e);G.debug(a),Ae(a,B)}),"parse")},Ce=d(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),$e=Ce,Te=d(e=>{const a=[...e.values()].reduce((i,c)=>i+c,0),u=[...e.entries()].map(([i,c])=>({label:i,value:c})).filter(i=>i.value/a*100>=1).sort((i,c)=>c.value-i.value);return ge().value(i=>i.value)(u)},"createPieArcs"),be=d((e,a,u,m)=>{G.debug(`rendering pie chart
`+e);const i=m.db,c=te(),l=ae(i.getConfig(),c.pie),t=40,r=18,o=4,g=450,y=g,v=re(a),p=v.append("g");p.attr("transform","translate("+y/2+","+g/2+")");const{themeVariables:s}=c;let[S]=ne(s.pieOuterStrokeWidth);S??=2;const w=l.textPosition,h=Math.min(y,g)/2-t,$=_().innerRadius(0).outerRadius(h),T=_().innerRadius(h*w).outerRadius(h*w);p.append("circle").attr("cx",0).attr("cy",0).attr("r",h+S/2).attr("class","pieOuterCircle");const f=i.getSections(),A=Te(f),D=[s.pie1,s.pie2,s.pie3,s.pie4,s.pie5,s.pie6,s.pie7,s.pie8,s.pie9,s.pie10,s.pie11,s.pie12];let E=0;f.forEach(n=>{E+=n});const O=A.filter(n=>(n.data.value/E*100).toFixed(0)!=="0"),k=ue(D);p.selectAll("mySlices").data(O).enter().append("path").attr("d",$).attr("fill",n=>k(n.data.label)).attr("class","pieCircle"),p.selectAll("mySlices").data(O).enter().append("text").text(n=>(n.data.value/E*100).toFixed(0)+"%").attr("transform",n=>"translate("+T.centroid(n)+")").style("text-anchor","middle").attr("class","slice"),p.append("text").text(i.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const P=[...f.entries()].map(([n,z])=>({label:n,value:z})),M=p.selectAll(".legend").data(P).enter().append("g").attr("class","legend").attr("transform",(n,z)=>{const I=r+o,U=I*P.length/2,j=12*r,q=z*I-U;return"translate("+j+","+q+")"});M.append("rect").attr("width",r).attr("height",r).style("fill",n=>k(n.label)).style("stroke",n=>k(n.label)),M.append("text").attr("x",r+o).attr("y",r-o).text(n=>i.getShowData()?`${n.label} [${n.value}]`:n.label);const V=Math.max(...M.selectAll("text").nodes().map(n=>n?.getBoundingClientRect().width??0)),R=y+t+r+o+V;v.attr("viewBox",`0 0 ${R} ${g}`),ie(v,g,R,l.useMaxWidth)},"draw"),Ee={draw:be},_e={parser:De,db:B,renderer:Ee,styles:$e};export{_e as diagram};
