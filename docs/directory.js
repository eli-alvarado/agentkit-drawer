(function () {
  var cards = document.querySelectorAll("#dir-grid [data-tags]");
  var empty = document.getElementById("dir-empty");
  var count = document.getElementById("dir-count");
  var active = { tool: "all", stack: "all" };

  function apply() {
    var shown = 0;
    cards.forEach(function (card) {
      var tags = (card.getAttribute("data-tags") || "").split(/\s+/);
      var okTool = active.tool === "all" || tags.indexOf("tool:" + active.tool) !== -1;
      var okStack = active.stack === "all" || tags.indexOf("stack:" + active.stack) !== -1;
      var show = okTool && okStack;
      card.hidden = !show;
      if (show) shown += 1;
    });
    if (count) count.textContent = shown + " shown";
    if (empty) empty.hidden = shown !== 0;
  }

  document.querySelectorAll(".dir-filters button[data-filter]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var dim = btn.getAttribute("data-dim");
      if (!dim || !Object.prototype.hasOwnProperty.call(active, dim)) return;
      active[dim] = btn.getAttribute("data-filter") || "all";
      document.querySelectorAll('.dir-filters button[data-dim="' + dim + '"]').forEach(function (other) {
        other.setAttribute("aria-pressed", other === btn ? "true" : "false");
      });
      apply();
    });
  });
})();
