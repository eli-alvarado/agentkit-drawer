// Open the drawer named in the URL hash (e.g. /packs/#drw-04) and scroll to it.
(function(){
  function go(){
    var id=location.hash.slice(1); if(!/^drw-0\d$/.test(id))return;
    var d=document.getElementById(id); if(!d||d.tagName!=="DETAILS")return;
    d.open=true; d.scrollIntoView({block:"start"});
    var s=d.querySelector("summary"); if(s)s.focus({preventScroll:true});
  }
  window.addEventListener("hashchange",go); go();
})();
