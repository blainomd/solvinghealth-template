/**
 * SolvingHealth Ecosystem Invite Widget
 * https://solvinghealth.com/referral-widget.js
 *
 * Drop-in script. Add to any site in the ecosystem:
 *
 *   <script
 *     src="https://solvinghealth.com/referral-widget.js"
 *     data-user="USER_UUID"
 *     defer
 *   ></script>
 *
 * Without data-user, the widget detects a logged-in session from the
 * solvinghealth.com SSO cookie and fetches the user id automatically.
 * If no user is present, the widget does nothing.
 *
 * The widget also reads ?ref=CODE from the current URL on every page load
 * and stores it in a cookie for later attribution.
 */
(function () {
  "use strict";

  var API_BASE = "https://solvinghealth.com/api/referral";
  var COOKIE_NAME = "sh_ref";
  var COOKIE_DAYS = 30;

  /* ── Utility ──────────────────────────────────────────────── */

  function setCookie(name, value, days) {
    var expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie =
      name + "=" + encodeURIComponent(value) + "; expires=" + expires + "; path=/; SameSite=Lax";
  }

  function getCookie(name) {
    var match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  }

  function getParam(name) {
    var url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  function currentSite() {
    return window.location.hostname.replace(/^www\./, "");
  }

  /* ── Step 1: capture ?ref=CODE on every page load ─────────── */

  var refCode = getParam("ref");
  if (refCode) {
    setCookie(COOKIE_NAME, refCode, COOKIE_DAYS);
  }

  /* ── Step 2: render the invite widget if a user is present ── */

  var scriptEl = document.currentScript || (function () {
    var scripts = document.getElementsByTagName("script");
    return scripts[scripts.length - 1];
  })();

  var userId = scriptEl ? scriptEl.getAttribute("data-user") : null;

  if (!userId) {
    // No user — still captured the ref code if present. Done.
    return;
  }

  /* ── Fetch or create this user's referral code ─────────────── */

  function fetchCode(callback) {
    fetch(API_BASE + "/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    })
      .then(function (r) { return r.json(); })
      .then(callback)
      .catch(function (e) { console.warn("[sh-invite] fetch code error", e); });
  }

  /* ── Build & mount the widget ───────────────────────────────── */

  function buildWidget(data) {
    if (!data || !data.code) return;

    var shareUrl = data.url || ("https://solvinghealth.com?ref=" + data.code);
    var uses = data.uses || 0;
    var credits = data.credits_earned || {};
    var careHours = credits.care_hours || 0;

    /* SVG icons — no emojis */
    var iconShare =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>';
    var iconClose =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    var iconCopy =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    var iconCheck =
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0D7377" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

    /* Templates */
    var smsText =
      "I found something that actually helps with navigating care for aging parents. Free to start. " +
      shareUrl;
    var emailSubject = "Something useful for family care";
    var emailBody =
      "Hi%2C%0A%0AI%27ve been using this platform to help with care for my family and thought you might find it useful too.%0A%0A" +
      encodeURIComponent(shareUrl) +
      "%0A%0ANo signup required to start. Just a conversation.";

    /* Outer trigger button */
    var btn = document.createElement("button");
    btn.id = "sh-invite-btn";
    btn.setAttribute("aria-label", "Share with a neighbor");
    btn.innerHTML = iconShare + '<span>Share</span>';
    btn.style.cssText = [
      "position:fixed",
      "bottom:72px",
      "right:16px",
      "z-index:9998",
      "display:flex",
      "align-items:center",
      "gap:6px",
      "padding:8px 14px",
      "background:#1B2A4A",
      "color:#fff",
      "border:none",
      "border-radius:20px",
      "font-family:Inter,system-ui,sans-serif",
      "font-size:13px",
      "font-weight:500",
      "cursor:pointer",
      "box-shadow:0 2px 8px rgba(0,0,0,0.18)",
      "transition:opacity 0.15s",
    ].join(";");

    /* Modal overlay */
    var overlay = document.createElement("div");
    overlay.id = "sh-invite-overlay";
    overlay.style.cssText = [
      "display:none",
      "position:fixed",
      "inset:0",
      "z-index:9999",
      "background:rgba(0,0,0,0.45)",
      "align-items:center",
      "justify-content:center",
    ].join(";");

    /* Modal card */
    var modal = document.createElement("div");
    modal.style.cssText = [
      "background:#fff",
      "border-radius:12px",
      "padding:28px 24px 24px",
      "max-width:380px",
      "width:calc(100% - 32px)",
      "font-family:Inter,system-ui,sans-serif",
      "position:relative",
      "box-shadow:0 8px 32px rgba(0,0,0,0.18)",
    ].join(";");

    var creditLine = "";
    if (careHours > 0) {
      creditLine =
        '<p style="margin:0 0 16px;font-size:13px;color:#0D7377;font-weight:500;">' +
        "You have " + careHours + " Care Hour" + (careHours !== 1 ? "s" : "") +
        " from " + uses + " referral" + (uses !== 1 ? "s" : "") + " so far." +
        "</p>";
    }

    modal.innerHTML =
      '<button id="sh-invite-close" aria-label="Close" style="position:absolute;top:12px;right:12px;background:none;border:none;cursor:pointer;color:#888;padding:4px;">' +
        iconClose +
      "</button>" +
      '<h2 style="margin:0 0 6px;font-size:17px;font-weight:700;color:#1B2A4A;">Share with a neighbor</h2>' +
      '<p style="margin:0 0 16px;font-size:13px;color:#555;line-height:1.5;">If someone you know could use help navigating care, send them this link. If they join, you both benefit.</p>' +
      creditLine +
      '<div style="background:#f5f6f8;border-radius:8px;padding:10px 12px;margin-bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:8px;">' +
        '<span id="sh-invite-url" style="font-size:12px;color:#1B2A4A;word-break:break-all;flex:1;">' + shareUrl + "</span>" +
        '<button id="sh-copy-btn" aria-label="Copy link" style="flex-shrink:0;background:none;border:none;cursor:pointer;color:#0D7377;display:flex;align-items:center;gap:4px;font-size:12px;font-weight:600;white-space:nowrap;">' +
          iconCopy + " Copy" +
        "</button>" +
      "</div>" +
      '<div style="display:flex;gap:8px;flex-wrap:wrap;">' +
        '<a href="sms:?body=' + encodeURIComponent(smsText) + '" style="flex:1;min-width:100px;text-align:center;padding:9px 12px;background:#0D7377;color:#fff;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Text</a>' +
        '<a href="mailto:?subject=' + emailSubject + "&body=" + emailBody + '" style="flex:1;min-width:100px;text-align:center;padding:9px 12px;background:#1B2A4A;color:#fff;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;">Email</a>' +
      "</div>" +
      '<p style="margin:16px 0 0;font-size:11px;color:#999;text-align:center;">' +
        '<a href="https://solvinghealth.com/referrals" style="color:#0D7377;text-decoration:none;">View leaderboard</a>' +
      "</p>";

    overlay.appendChild(modal);
    document.body.appendChild(btn);
    document.body.appendChild(overlay);

    /* Interactions */
    btn.addEventListener("click", function () {
      overlay.style.display = "flex";
    });

    document.getElementById("sh-invite-close").addEventListener("click", function () {
      overlay.style.display = "none";
    });

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) overlay.style.display = "none";
    });

    document.getElementById("sh-copy-btn").addEventListener("click", function () {
      var copyBtn = document.getElementById("sh-copy-btn");
      navigator.clipboard.writeText(shareUrl).then(function () {
        copyBtn.innerHTML = iconCheck + " Copied";
        setTimeout(function () {
          copyBtn.innerHTML = iconCopy + " Copy";
        }, 2000);
      }).catch(function () {
        // Fallback for older browsers
        var ta = document.createElement("textarea");
        ta.value = shareUrl;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        copyBtn.innerHTML = iconCheck + " Copied";
        setTimeout(function () {
          copyBtn.innerHTML = iconCopy + " Copy";
        }, 2000);
      });
    });
  }

  /* ── Init ─────────────────────────────────────────────────── */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { fetchCode(buildWidget); });
  } else {
    fetchCode(buildWidget);
  }

  /* ── Exit-intent Sage nudge ───────────────────────────────── */
  // Fires once per session when the mouse leaves the top of the viewport.
  // Only if no modal is already open and the user hasn't seen it this session.
  var exitShown = sessionStorage.getItem("sh_exit_nudge");

  if (!exitShown) {
    document.addEventListener("mouseleave", function handler(e) {
      if (e.clientY > 10) return; // Only trigger on top-exit
      document.removeEventListener("mouseleave", handler);
      sessionStorage.setItem("sh_exit_nudge", "1");

      if (document.getElementById("sh-invite-overlay") &&
          document.getElementById("sh-invite-overlay").style.display === "flex") return;

      var nudge = document.createElement("div");
      nudge.style.cssText = [
        "position:fixed",
        "bottom:120px",
        "right:16px",
        "z-index:9997",
        "background:#fff",
        "border:1px solid #e5e7eb",
        "border-radius:10px",
        "padding:14px 16px",
        "max-width:260px",
        "font-family:Inter,system-ui,sans-serif",
        "font-size:13px",
        "color:#1B2A4A",
        "box-shadow:0 4px 16px rgba(0,0,0,0.12)",
        "line-height:1.5",
        "animation:sh-fade-in 0.2s ease",
      ].join(";");

      nudge.innerHTML =
        '<p style="margin:0 0 10px;">Know someone who could use this?</p>' +
        '<button id="sh-nudge-share" style="background:#0D7377;color:#fff;border:none;border-radius:6px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;width:100%;">Share your link</button>' +
        '<button id="sh-nudge-close" style="display:block;width:100%;margin-top:6px;background:none;border:none;font-size:11px;color:#999;cursor:pointer;">No thanks</button>';

      document.body.appendChild(nudge);

      document.getElementById("sh-nudge-share").addEventListener("click", function () {
        nudge.remove();
        var overlay = document.getElementById("sh-invite-overlay");
        if (overlay) overlay.style.display = "flex";
      });

      document.getElementById("sh-nudge-close").addEventListener("click", function () {
        nudge.remove();
      });

      setTimeout(function () {
        if (nudge.parentNode) nudge.remove();
      }, 8000);
    });

    // Inject keyframe animation
    var style = document.createElement("style");
    style.textContent =
      "@keyframes sh-fade-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}";
    document.head.appendChild(style);
  }

})();
