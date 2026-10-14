(() => {
  const S = {
    off: [
      ["p", "> add a paid plan with Stripe"],
      ["d", "Sure! Let me set that up."],
      ["d", "✎ rewriting lib/auth.ts (412 lines)"],
      ["d", "✎ creating utils/stripeHelper2.js"],
      ["w", "⚠ NEXT_PUBLIC_STRIPE_SECRET added to .env"],
      ["d", "✎ success page sets user.plan = 'pro'"],
      ["w", "⚠ RLS disabled on subscriptions \"to fix the error\""],
      ["d", "✎ upgrading next 14 → 15, react 18 → 19"],
      ["e", "✗ 23 type errors. Trying a different approach…"],
      ["e", "✗ login loop on /dashboard"],
      ["d", "Done! 🎉 Everything should work now."]
    ],
    on: [
      ["p", "> add a paid plan with Stripe"],
      ["d", "reading AGENTS.md, rules/40-stripe.mdc, rules/30-database-rls.mdc"],
      ["k", "PLAN  5 files · 1 migration · 2 env vars, waiting for ok"],
      ["p", "> ok"],
      ["k", "✓ migration: entitlements table + RLS + policies"],
      ["k", "✓ server action creates Checkout Session (client_reference_id)"],
      ["k", "✓ webhook verifies signature, idempotent on event.id"],
      ["k", "✓ access granted from webhook only, not the redirect"],
      ["k", "✓ STRIPE_SECRET_KEY server-only → .env.example, lib/env.ts"],
      ["k", "✓ typecheck · lint · 14 tests passed"],
      ["d", "Verify: stripe trigger checkout.session.completed"]
    ]
  };
  const pre = document.getElementById("term"), title = document.getElementById("term-title");
  const btns = document.querySelectorAll(".toggle button");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let timer, run = 0;
  function play(mode) {
    const id = ++run; clearTimeout(timer); pre.textContent = "";
    title.textContent = mode === "on" ? "~/my-app: agent + drawer rules" : "~/my-app: agent (no rules)";
    pre.parentElement.dataset.mode = mode;
    const lines = S[mode];
    const add = (i) => {
      if (id !== run || i >= lines.length) return;
      const [t, s] = lines[i], el = document.createElement("span");
      el.className = "ln " + t; el.textContent = s + "\n"; pre.appendChild(el);
      timer = setTimeout(() => add(i + 1), reduce ? 0 : (t === "p" ? 700 : 380));
    };
    add(0);
  }
  btns.forEach(b => b.addEventListener("click", () => {
    btns.forEach(x => x.setAttribute("aria-checked", x === b ? "true" : "false"));
    play(b.dataset.mode);
  }));
  const io = new IntersectionObserver(es => { if (es[0].isIntersecting) { play("off"); io.disconnect(); } });
  io.observe(pre);
})();
