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
