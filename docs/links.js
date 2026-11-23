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
// After a free Starter download or signup, show one One-File ($9) upsell under the form, once.
// Tagged client_reference_id/utm_content=starter-dl so buy clicks are countable via the beacon above.
function akdNextStep(f){
  if(!f||f.querySelector(".news-up"))return;
  var p=document.createElement("p");p.className="news-up mono";
  p.appendChild(document.createTextNode("One-File Agent Rules ($9) adds stack modules for Next.js + Supabase, FastAPI, Node and Godot; /plan /review /fix /test /ship commands; a self-review gate; and per-tool setup. 14-day refund. "));
  var a=document.createElement("a");
  a.className="btn";
  a.href="https://buy.stripe.com/fZu7sKdJ20oP7md93o7kc06?client_reference_id=drw-00_starter-dl&utm_source=agentkitdrawer&utm_medium=site&utm_campaign=starter&utm_content=starter-dl";
  a.target="_blank";a.rel="noopener noreferrer";
  a.textContent="Buy One-File Agent Rules \u00b7 $9";
  p.appendChild(document.createElement("br"));p.appendChild(a);f.appendChild(p);
}
(function(){
  document.querySelectorAll(".news-f .news-m").forEach(function(m){
    var f=m.parentNode;
    new MutationObserver(function(){
      var t=m.textContent||"";if(!/^(Sent!|You're already)/.test(t))return;
      akdNextStep(f);
    }).observe(m,{childList:true,characterData:true,subtree:true});
  });
})();
// Free Starter is ungated: direct download first, email opt-in offered after (optional).
(function(){
  document.querySelectorAll("form.news-f").forEach(function(f){
    if(f.querySelector(".news-dl"))return;
    var sec=f.closest("section")||f.parentNode;sec.querySelectorAll("p").forEach(function(p){if(p.closest("form"))return;p.childNodes.forEach(function(t){if(t.nodeType===3)t.nodeValue=t.nodeValue.replace(/We email it to you instantly[^.]*\./,"Download it in one click, no email needed.");});});
    var s=f.querySelector('input[name="source"]'),src=(s&&s.value)||"unknown",u="";
    try{u=sessionStorage.getItem("akd_src")||"";}catch(e){}
    var qa="";try{if(sessionStorage.getItem("akd_qa")==="1")qa="&qa=1";}catch(e){}
    var box=document.createElement("div");box.className="news-dl";
    var a=document.createElement("a");a.className="btn";a.textContent="Download AGENTS.md (free)";
    a.href="https://dl.agentkitdrawer.com/starter/free?src="+encodeURIComponent(src)+(u?"&utm_source="+encodeURIComponent(u):"")+qa;
    a.setAttribute("download","AGENTS.md");
    var n=document.createElement("span");n.className="mono";n.textContent="No email needed.";
    box.appendChild(a);box.appendChild(n);f.insertBefore(box,f.firstChild);
    var rest=[].slice.call(f.children).filter(function(c){return c!==box&&!c.classList.contains("news-m");});
    rest.forEach(function(c){c.hidden=true;});
    var btn=f.querySelector('button[type="submit"]');if(btn)btn.textContent="Send me tips + new packs";
    a.addEventListener("click",function(){
      if(s&&!/-afterdl$/.test(s.value))s.value=(s.value+"-afterdl").slice(0,60);
      n.textContent="Downloading. Want the setup tips and a note when a new pack ships? Optional:";
      rest.forEach(function(c){if(!c.classList.contains("hp"))c.hidden=false;});
      akdNextStep(f);
    });
  });
})();
