// Open off-domain links in a new tab, including links added later.
(function(){
  function fix(a){
    if(!a.href||a.protocol.indexOf("http")!==0||a.hostname===location.hostname||/(^|\.)agentkitdrawer\.com$/.test(a.hostname))return;
    a.target="_blank";a.rel="noopener noreferrer";
  }
  function all(r){(r.querySelectorAll?r.querySelectorAll("a[href]"):[]).forEach(fix);if(r.tagName==="A")fix(r);}
  all(document);
  new MutationObserver(function(ms){ms.forEach(function(m){m.addedNodes.forEach(function(n){if(n.nodeType===1)all(n);});if(m.type==="attributes"&&m.target.tagName==="A")fix(m.target);});})
    .observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:["href"]});
})();
// Count Buy clicks per product/page (no cookies): beacon to the dl worker, tallied server-side.
(function(){
  try{var u=new URLSearchParams(location.search).get("utm_source");if(u)sessionStorage.setItem("akd_src",u.slice(0,40));}catch(e){}
  document.addEventListener("click",function(e){
    var a=e.target&&e.target.closest&&e.target.closest('a[href*="buy.stripe.com/"]');if(!a)return;
    var q=new URL(a.href).searchParams,cr=q.get("client_reference_id")||"",i=cr.indexOf("_");
    var p=i>0?cr.slice(0,i):"",pg=i>0?cr.slice(i+1):"";if(!p)return;
    var src="";try{src=sessionStorage.getItem("akd_src")||"";}catch(e){}
    var body=JSON.stringify({p:p,pg:pg,src:src});
    try{if(!(navigator.sendBeacon&&navigator.sendBeacon("https://dl.agentkitdrawer.com/c",new Blob([body],{type:"text/plain"}))))fetch("https://dl.agentkitdrawer.com/c",{method:"POST",body:body,keepalive:true,mode:"no-cors"});}catch(e){}
  },true);
})();
