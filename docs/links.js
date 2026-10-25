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
  try{var u=new URLSearchParams(location.search).get("utm_source");if(u)sessionStorage.setItem("akd_src",u.slice(0,40));if(new URLSearchParams(location.search).get("qa")==="1")sessionStorage.setItem("akd_qa","1");}catch(e){}
  document.addEventListener("click",function(e){
    var a=e.target&&e.target.closest&&e.target.closest('a[href*="buy.stripe.com/"]');if(!a)return;
    var q=new URL(a.href).searchParams,cr=q.get("client_reference_id")||"",i=cr.indexOf("_");
    var p=i>0?cr.slice(0,i):"",pg=i>0?cr.slice(i+1):"";if(!p)return;
    var src="";try{src=sessionStorage.getItem("akd_src")||"";}catch(e){}
    var qa=false;try{qa=new URLSearchParams(location.search).get("qa")==="1"||q.get("qa")==="1"||sessionStorage.getItem("akd_qa")==="1";}catch(e){}
    var body=JSON.stringify({p:p,pg:pg,src:src,cr:cr,utm:q.get("utm_content")||"",path:location.pathname,qa:qa});
    try{if(!(navigator.sendBeacon&&navigator.sendBeacon("https://dl.agentkitdrawer.com/c",new Blob([body],{type:"text/plain"}))))fetch("https://dl.agentkitdrawer.com/c",{method:"POST",body:body,keepalive:true,mode:"no-cors"});}catch(e){}
  },true);
})();
// Copy buttons for install commands: <button class="copy" data-copy="#id" hidden>. Shown only when the Clipboard API works.
(function(){
  if(!(navigator.clipboard&&window.isSecureContext))return;
  document.querySelectorAll("button.copy[data-copy]").forEach(function(b){
    var t=document.querySelector(b.getAttribute("data-copy"));if(!t)return;
    b.hidden=false;b.setAttribute("aria-label","Copy command");
    b.addEventListener("click",function(){
      navigator.clipboard.writeText(t.textContent.trim()).then(function(){b.textContent="Copied";setTimeout(function(){b.textContent="Copy";},1800);},function(){b.textContent="Select it";});
    });
  });
})();
// After a successful free Starter signup, show the next step (the $9 full file) under the form.
(function(){
  document.querySelectorAll(".news-f .news-m").forEach(function(m){
    var f=m.parentNode;
    new MutationObserver(function(){
      var t=m.textContent||"";if(!/^(Sent!|You're already)/.test(t)||f.querySelector(".news-up"))return;
      var p=document.createElement("p");p.className="news-up mono";
      p.appendChild(document.createTextNode("Next step: the full file adds stack modules (Next.js + Supabase, FastAPI, Node, Godot), /plan /review /ship commands and a self-review gate. "));
      var a=document.createElement("a");a.href="/#one-file";a.textContent="See One-File Agent Rules ($9)";p.appendChild(a);
      f.appendChild(p);
    }).observe(m,{childList:true,characterData:true,subtree:true});
  });
})();
