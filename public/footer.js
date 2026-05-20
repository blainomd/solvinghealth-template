/**
 * SolvingHealth Ecosystem Bar v7
 * https://harnesshealth.ai/footer.js
 *
 * THE ONLY BOTTOM BAR. Replaces separate Sage chat + Gemini voice widgets.
 * One bar: [voice] [story + CTA] [Surf ->] [chat] [legal]
 *
 * Usage:
 *   <script src="https://harnesshealth.ai/footer.js"
 *     data-brand="co-op.care" data-theme="light" defer></script>
 *
 * Remove sage-chat.js, gemini-voice.js, chat-widget.js, voice-embed.js
 * from sites that use this. This bar does everything.
 */
(function(){'use strict';

/* ── Condition detection ──────────────────────────────────────── */
function detectCondition(scriptEl){
  var explicit = scriptEl && scriptEl.getAttribute('data-condition');
  if(explicit) return explicit.toLowerCase().trim();
  var host = window.location.hostname.toLowerCase();
  var title = (document.title || '').toLowerCase();
  var src = host + ' ' + title;
  if(/heart|cardiac|afib|cardiovascular/.test(src)) return 'heart';
  if(/fall|balance|trip|stumble/.test(src)) return 'fall';
  if(/memory|dementia|alzheimer|cognitive/.test(src)) return 'memory';
  if(/hip/.test(src)) return 'hip';
  if(/shoulder/.test(src)) return 'shoulder';
  if(/blood\s*pressure|hypertension/.test(src)) return 'blood';
  if(/breath|copd|asthma|lung/.test(src)) return 'breath';
  if(/pregnan|prenatal|maternal/.test(src)) return 'pregnancy';
  if(/arthritis|joint\s*pain|rheumat/.test(src)) return 'arthritis';
  if(/back\s*pain|spine|lumbar/.test(src)) return 'back';
  return 'general';
}

/* ── Condition-specific stories ──────────────────────────────── */
var conditionStories = {
  heart:[
    {msg:'Do you know your resting heart rate? It tells more than you think.',cta:'Ask Sage',href:'#',sage:true},
    {msg:'AFib affects 6 million Americans. Most don\'t know they have it.',cta:'Learn more',href:'#'},
    {msg:'Your cardiologist visit is likely HSA-eligible. So are many devices.',cta:'Check eligibility',href:'https://hsaletter.com'},
    {msg:'One card carries your medications, devices, and emergency contacts.',cta:'Get ComfortCard',href:'https://comfortcard.org'}
  ],
  fall:[
    {msg:'36 million falls per year. 95% of hip fractures start with a fall.',cta:'Talk to Sage',href:'#',sage:true},
    {msg:'Is dad\'s bathroom safe? Free 6-room home safety check.',cta:'Start assessment',href:'https://co-op.care'},
    {msg:'A neighbor-caregiver who knows the house changes everything.',cta:'Learn about co-op.care',href:'https://co-op.care'},
    {msg:'Your fall prevention plan may be HSA-eligible. One letter unlocks it.',cta:'Check eligibility',href:'https://hsaletter.com'}
  ],
  memory:[
    {msg:'Early detection changes everything. Tell Sage what you\'re noticing.',cta:'Talk to Sage',href:'#',sage:true},
    {msg:'Record your family\'s stories while you can. The directive writes itself.',cta:'Start CareGoals',href:'https://caregoals.com'},
    {msg:'A caregiver who stays \u2014 not a stranger every 90 days.',cta:'Learn about co-op.care',href:'https://co-op.care'},
    {msg:'Memory care is likely HSA-eligible. Find out in 5 minutes.',cta:'Check eligibility',href:'https://hsaletter.com'}
  ],
  hip:[
    {msg:'Hip replacement recovery starts before surgery. Is your home ready?',cta:'Talk to Sage',href:'#',sage:true},
    {msg:'Home PT equipment and grab bars are HSA-eligible. Get the letter.',cta:'Check eligibility',href:'https://hsaletter.com'},
    {msg:'Post-op home care from someone who knows your neighborhood.',cta:'Learn about co-op.care',href:'https://co-op.care'},
    {msg:'One card carries your implant details, medications, and allergies.',cta:'Get ComfortCard',href:'https://comfortcard.org'}
  ],
  shoulder:[
    {msg:'Shoulder recovery at home is possible \u2014 with the right support.',cta:'Talk to Sage',href:'#',sage:true},
    {msg:'Home PT and recovery equipment may be HSA-eligible. One letter confirms it.',cta:'Check eligibility',href:'https://hsaletter.com'},
    {msg:'Post-surgery help from a neighbor, not an agency.',cta:'Learn about co-op.care',href:'https://co-op.care'},
    {msg:'Your implant card, medications, and surgeon contacts in one place.',cta:'Get ComfortCard',href:'https://comfortcard.org'}
  ],
  blood:[
    {msg:'High blood pressure has no symptoms until it does. Know your number.',cta:'Talk to Sage',href:'#',sage:true},
    {msg:'Home blood pressure monitors are HSA-eligible. So is the coaching.',cta:'Check eligibility',href:'https://hsaletter.com'},
    {msg:'Medication management is where most hypertension plans fall apart.',cta:'Ask Sage',href:'#',sage:true},
    {msg:'One card. Every provider sees your current medications and readings.',cta:'Get ComfortCard',href:'https://comfortcard.org'}
  ],
  breath:[
    {msg:'COPD affects 16 million Americans. Most are underdiagnosed.',cta:'Talk to Sage',href:'#',sage:true},
    {msg:'Nebulizers, spacers, and air purifiers are HSA-eligible. Get the letter.',cta:'Check eligibility',href:'https://hsaletter.com'},
    {msg:'A home environment check can reveal triggers you\'ve been living with.',cta:'Free assessment',href:'https://co-op.care'},
    {msg:'Your pulmonologist notes, inhalers, and emergency plan \u2014 one card.',cta:'Get ComfortCard',href:'https://comfortcard.org'}
  ],
  pregnancy:[
    {msg:'Prenatal vitamins, doulas, and yoga \u2014 many are HSA-eligible. Really.',cta:'Check eligibility',href:'https://hsaletter.com'},
    {msg:'What question would you ask a doctor right now?',cta:'Ask Sage',href:'#',sage:true},
    {msg:'Your birth plan deserves to travel with you. ComfortCard holds it.',cta:'Get ComfortCard',href:'https://comfortcard.org'},
    {msg:'Postpartum care at home \u2014 from a neighbor who\'s been there.',cta:'Learn about co-op.care',href:'https://co-op.care'}
  ],
  arthritis:[
    {msg:'Joint pain is not inevitable. What are you actually dealing with?',cta:'Talk to Sage',href:'#',sage:true},
    {msg:'Braces, massagers, and home PT equipment are HSA-eligible. Get the letter.',cta:'Check eligibility',href:'https://hsaletter.com'},
    {msg:'A caregiver who helps with the tasks that hurt most, living nearby.',cta:'Learn about co-op.care',href:'https://co-op.care'},
    {msg:'Your medications, supplements, and care preferences \u2014 one card.',cta:'Get ComfortCard',href:'https://comfortcard.org'}
  ],
  back:[
    {msg:'Back pain is the #1 cause of missed work. What\'s actually going on?',cta:'Talk to Sage',href:'#',sage:true},
    {msg:'TENS units, ergonomic equipment, and PT are HSA-eligible. Confirm it.',cta:'Check eligibility',href:'https://hsaletter.com'},
    {msg:'Most back pain resolves with the right home support. Not surgery.',cta:'Ask Sage',href:'#',sage:true},
    {msg:'Your imaging, medications, and PT notes \u2014 one card, any ER.',cta:'Get ComfortCard',href:'https://comfortcard.org'}
  ],
  general:[
    {msg:'What question would you ask a doctor right now?',cta:'Ask Sage',href:'#',sage:true},
    {msg:'Free AI health assessment. Physician-supervised. Always.',cta:'Start assessment',href:'https://co-op.care'},
    {msg:'Is your treatment HSA-eligible? One letter finds out. $199.',cta:'Check eligibility',href:'https://hsaletter.com'},
    {msg:'One card. Every provider knows your story.',cta:'Get ComfortCard',href:'https://comfortcard.org'}
  ]
};

/* ── Brand lead pools ────────────────────────────────────────── */
var leads = {
  'surgeonvalue':[
    {msg:'Medicare just changed. Are your codes current?',cta:'Check now',href:'#wonder-bill'},
    {msg:'One missed TCM code = $230. Wonder Bill catches it.',cta:'Try Wonder Bill',href:'#wonder-bill'},
    {msg:'CJR-X: mandatory bundled payments for 2,500 hospitals. Is your practice ready?',cta:'See what changes',href:'#cjr'},
    {msg:'Your patients\' care continues at home. co-op.care handles the handoff.',cta:'Learn more',href:'https://co-op.care'},
    {msg:'Your browsing builds your billing knowledge.',cta:'Get chanio',href:'https://chanio.com'},
    {msg:'Physician-supervised AI. HIPAA compliant. Your data stays yours.',cta:'Learn how',href:'https://solvinghealth.com/privacy'}
  ],
  'co-op.care':[
    {msg:'What if mom\'s caregiver was a neighbor, not a stranger from an agency?',cta:'Talk to Sage',href:'#',sage:true},
    {msg:'Your care decisions are HSA-eligible. Save $936 a year.',cta:'See how',href:'https://hsaletter.com'},
    {msg:'Record mom\'s stories now. The advance directive writes itself.',cta:'Start CareGoals',href:'https://caregoals.com'},
    {msg:'Is dad\'s home safe? Free 6-room assessment \u2014 no signup required.',cta:'Start free check',href:'https://co-op.care/assess'},
    {msg:'Your browsing builds your care plan.',cta:'Get chanio',href:'https://chanio.com'},
    {msg:'Physician-supervised AI. HIPAA compliant. Your data stays yours.',cta:'Learn how',href:'https://solvinghealth.com/privacy'}
  ],
  'clinicalswipe':[
    {msg:'Radiology reviews pay $200-400 each. How fast can you read?',cta:'See demand',href:'/join.html'},
    {msg:'Your attestation is the safety gate AI needs. Get paid for it.',cta:'Start reviewing',href:'/join.html'},
    {msg:'8 specialties. Set your rate. Review when you want.',cta:'View marketplace',href:'/join.html'},
    {msg:'Your browsing builds your clinical profile.',cta:'Get chanio',href:'https://chanio.com'},
    {msg:'Physician-supervised AI. HIPAA compliant. Your data stays yours.',cta:'Learn how',href:'https://solvinghealth.com/privacy'}
  ],
  'hsaletter':[
    {msg:'Your gym membership could be tax-free. Really.',cta:'Check eligibility',href:'#check'},
    {msg:'Prenatal vitamins, massage, yoga \u2014 all potentially HSA-eligible.',cta:'See what qualifies',href:'#check'},
    {msg:'A Letter of Medical Necessity unlocks hundreds in annual savings.',cta:'Get your letter',href:'#check'},
    {msg:'Home care for a parent is often HSA-eligible. One letter confirms it.',cta:'Check now',href:'#check'},
    {msg:'Your browsing builds your HSA strategy.',cta:'Get chanio',href:'https://chanio.com'},
    {msg:'Physician-supervised AI. HIPAA compliant. Your data stays yours.',cta:'Learn how',href:'https://solvinghealth.com/privacy'}
  ],
  'solvinghealth':[
    {msg:'What if the health system worked for you instead of the other way around?',cta:'Read the thesis',href:'https://solvinghealth.com/about'},
    {msg:'Open FHIR pipes. Proprietary clinical brain. One SDK.',cta:'View SDK',href:'https://solvinghealth.com/sdk'},
    {msg:'co-op.care is the operator proof-point. SolvingHealth is the engine.',cta:'Learn more',href:'https://co-op.care'},
    {msg:'Your browsing builds your health profile.',cta:'Get chanio',href:'https://chanio.com'},
    {msg:'Physician-supervised AI. HIPAA compliant. Your data stays yours.',cta:'Learn how',href:'https://solvinghealth.com/privacy'}
  ],
  'opusocial':[
    {msg:'Stop paying scalpers. Buy from fans going to the same show.',cta:'Find tickets',href:'https://opusocial.com'},
    {msg:'Your Spotify history already knows which shows you\'d love.',cta:'Connect Spotify',href:'https://opusocial.com'},
    {msg:'ReadyPin: tap in, tap out. No app download needed at the door.',cta:'Learn more',href:'https://opusocial.com/readypin'},
    {msg:'Your browsing builds your music identity.',cta:'Get chanio',href:'https://chanio.com'}
  ],
  'sh-room':[
    {msg:'Grow your own lion\'s mane. Whisper-quiet. Two-minute setup.',cta:'Back on Kickstarter',href:'#tiers'},
    {msg:'$79 MSRP. 62% gross margin. 78% recycled materials. Ships Q4.',cta:'See specs',href:'#specs'},
    {msg:'The $62B functional mushroom market starts in your kitchen.',cta:'Back the launch',href:'#tiers'},
    {msg:'Your browsing builds your wellness profile.',cta:'Get chanio',href:'https://chanio.com'}
  ],
  'fillforward':[
    {msg:'$2.50 kombucha from a neighbor\'s garage. No markup. No middleman.',cta:'Join the waitlist',href:'#waitlist'},
    {msg:'Cottage law lets neighbors sell. Fill Forward connects the dots.',cta:'See how it works',href:'#how'},
    {msg:'Worker-owned. Neighbor-sourced. Boulder-first.',cta:'Learn more',href:'#about'},
    {msg:'Your browsing builds your local food network.',cta:'Get chanio',href:'https://chanio.com'}
  ],
  'mapofyou':[
    {msg:'Who are you becoming? The map starts with one answer.',cta:'Start your map',href:'#start'},
    {msg:'Your passions, strengths, and blindspots \u2014 mapped together for the first time.',cta:'Begin',href:'#start'},
    {msg:'Your living archive. Your story, told in your words.',cta:'Start recording',href:'#archive'},
    {msg:'Your browsing builds your identity map.',cta:'Get chanio',href:'https://chanio.com'}
  ],
  'floorpricer':[
    {msg:'What if your stops trailed automatically as the price climbed?',cta:'Paper trade free',href:'#pricing'},
    {msg:'Set a floor. Set a ladder. Walk away.',cta:'See how floors work',href:'#floors'},
    {msg:'Laddered buys on the way down. Trailing stops on the way up.',cta:'View strategies',href:'#strategies'},
    {msg:'Your browsing builds your trading profile.',cta:'Get chanio',href:'https://chanio.com'}
  ]
};

/* ── Universal fallback ──────────────────────────────────────── */
var universal = [
  {msg:'A 50-state licensed physician is ready now.',cta:'Find a doctor',href:'https://altru.care'},
  {msg:'Is your care HSA-eligible? One physician letter. $199.',cta:'Check eligibility',href:'https://hsaletter.com'},
  {msg:'One card. Every provider knows your story.',cta:'Get ComfortCard',href:'https://comfortcard.org'},
  {msg:'Record your family\'s stories. The directive writes itself.',cta:'Start CareGoals',href:'https://caregoals.com'},
  {msg:'Your family deserves a caregiver who stays. $59/mo.',cta:'Learn about co-op.care',href:'https://co-op.care'},
  {msg:'Your browsing builds your health profile.',cta:'Get chanio',href:'https://chanio.com'},
  {msg:'Physician-supervised AI. HIPAA compliant. Your data stays yours.',cta:'Learn how',href:'https://solvinghealth.com/privacy'}
];

/* ── Pool builder ────────────────────────────────────────────── */
function buildPool(brandKey, scriptEl){
  var brandLeads;
  if(brandKey === 'condition-site'){
    var condition = detectCondition(scriptEl);
    brandLeads = conditionStories[condition] || conditionStories['general'];
  } else {
    brandLeads = leads[brandKey] || leads['solvinghealth'];
  }
  var seen = {};
  var merged = [];
  var all = brandLeads.concat(universal);
  for(var i=0;i<all.length;i++){
    var key = all[i].href+'|'+all[i].msg.slice(0,30);
    if(!seen[key]){ seen[key]=true; merged.push(all[i]); }
  }
  return merged;
}

/* ── Themes ──────────────────────────────────────────────────── */
var themes = {
  light: {bg:'#1B2A4A',text:'#E8E4DD',muted:'#8FA3B8',accent:'#0D7377',accentText:'#fff',border:'#2A3B5A',iconBg:'rgba(13,115,119,0.15)',iconColor:'#0D7377'},
  dark:  {bg:'#0A1420',text:'#E8E4DD',muted:'#6B7F94',accent:'#0D7377',accentText:'#fff',border:'#152030',iconBg:'rgba(13,115,119,0.2)',iconColor:'#0D7377'}
};

/* ── SVG Icons ───────────────────────────────────────────────── */
var micSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>';
var chatSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
var sendSVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
var infoSVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

/* ── Init ────────────────────────────────────────────────────── */
function init(){
  var el = document.querySelector('script[src*="footer.js"]');
  if(!el) return;

  var brandKey = el.getAttribute('data-brand') || 'solvinghealth';
  var themeKey = el.getAttribute('data-theme') || 'light';
  var t = themes[themeKey] || themes.light;

  var pool = buildPool(brandKey, el);
  var idx = 0;

  /* ── Render ────────────────────────────────────────────── */
  /* Two actions, side by side. Surf + talk, simultaneously, as you browse. */
  function render(story){
    return [
      '<div class="bar">',
      '  <a href="https://chanio.com/surf" target="_blank" rel="noopener" class="surf-btn" title="Discover something new" aria-label="Surf — discover something new"><span class="surf-text">Surf</span><span class="surf-arrow">\u2192</span></a>',
      '  <div class="inline-chat">',
      '    <button class="icon-btn voice-btn" title="Talk to Sage" aria-label="Talk to Sage by voice">'+micSVG+'</button>',
      '    <input class="inline-input" id="inline-sage-input" type="text" placeholder="Ask Sage anything as you surf..." autocomplete="off" />',
      '    <button class="inline-send" id="inline-sage-send" aria-label="Send">'+sendSVG+'</button>',
      '  </div>',
      '  <button class="legal-toggle" id="legal-toggle" aria-label="About" title="About">'+infoSVG+'</button>',
      '</div>'
    ].join('');
  }

  /* ── CSS ────────────────────────────────────────────────── */
  var css = [
    ':host{display:block;position:fixed;bottom:0;left:0;right:0;z-index:9998;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}',
    '.bar{display:flex;align-items:center;gap:10px;padding:10px 16px;background:'+t.bg+';border-top:1px solid '+t.border+';transition:opacity 0.3s;}',
    '.icon-btn{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:8px;border:none;cursor:pointer;background:transparent;color:'+t.iconColor+';transition:all 0.15s;flex-shrink:0;}',
    '.icon-btn:hover{color:'+t.accent+';}',
    '.surf-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 18px;background:'+t.accent+';color:'+t.accentText+';font-size:13px;font-weight:700;border-radius:100px;text-decoration:none;white-space:nowrap;flex-shrink:0;transition:transform 0.15s,box-shadow 0.15s;line-height:1;box-shadow:0 2px 10px rgba(13,115,119,0.25);}',
    '.surf-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(13,115,119,0.35);}',
    '.surf-text{display:inline;}',
    '.surf-arrow{display:inline-block;transition:transform 0.2s;}',
    '.surf-btn:hover .surf-arrow{transform:translateX(3px);}',
    '.inline-chat{display:flex;align-items:center;flex:1;min-width:0;background:'+t.iconBg+';border:1px solid '+t.border+';border-radius:100px;padding:4px 6px 4px 10px;transition:border-color 0.15s;}',
    '.inline-chat:focus-within{border-color:'+t.accent+';}',
    '.inline-input{flex:1;min-width:0;border:none;background:transparent;color:'+t.text+';font-size:13px;font-family:inherit;outline:none;padding:8px 10px;font-weight:500;}',
    '.inline-input::placeholder{color:'+t.muted+';}',
    '.inline-send{display:flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:100px;border:none;background:'+t.accent+';color:'+t.accentText+';cursor:pointer;flex-shrink:0;transition:opacity 0.15s,transform 0.15s;}',
    '.inline-send:hover{transform:scale(1.05);}',
    '.legal-toggle{display:flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;border:none;background:transparent;color:'+t.muted+';cursor:pointer;flex-shrink:0;transition:color 0.15s;}',
    '.legal-toggle:hover{color:'+t.text+';}',
    '.legal-popover{display:none;position:absolute;bottom:calc(100% + 8px);right:16px;background:'+t.bg+';border:1px solid '+t.border+';border-radius:10px;padding:12px 14px;box-shadow:0 -4px 20px rgba(0,0,0,0.2);font-size:11px;color:'+t.muted+';line-height:1.7;}',
    '.legal-popover.open{display:block;}',
    '.legal-popover a{color:'+t.muted+';text-decoration:none;display:block;padding:2px 0;}',
    '.legal-popover a:hover{color:'+t.accent+';}',
    '.bar-fade{opacity:0;}',
    /* Chat panel */
    '.chat-panel{display:none;position:absolute;bottom:100%;right:16px;width:380px;max-height:500px;background:'+t.bg+';border:1px solid '+t.border+';border-radius:12px 12px 0 0;padding:16px;box-shadow:0 -8px 32px rgba(0,0,0,0.4);flex-direction:column;}',
    '.chat-panel.open{display:flex;}',
    '.chat-header{font-size:14px;font-weight:600;color:'+t.text+';margin-bottom:8px;}',
    '.chat-sub{font-size:10px;font-weight:400;color:'+t.muted+';margin-left:6px;}',
    '.chat-messages{flex:1;overflow-y:auto;max-height:340px;margin-bottom:10px;font-size:13px;line-height:1.5;color:'+t.text+';}',
    '.chat-msg{margin-bottom:10px;padding:8px 10px;border-radius:8px;}',
    '.chat-msg.user{background:rgba(13,115,119,0.15);text-align:right;}',
    '.chat-msg.sage{background:rgba(255,255,255,0.05);}',
    '.chat-msg.sage .typing{color:'+t.muted+';font-style:italic;}',
    '.chat-row{display:flex;gap:6px;}',
    '.chat-input{flex:1;padding:10px 12px;border-radius:8px;border:1px solid '+t.border+';background:rgba(255,255,255,0.05);color:'+t.text+';font-size:13px;outline:none;}',
    '.chat-input:focus{border-color:'+t.accent+';}',
    '.chat-input::placeholder{color:'+t.muted+';}',
    '.chat-send{padding:10px 14px;border:none;border-radius:8px;background:'+t.accent+';color:'+t.accentText+';font-size:12px;font-weight:600;cursor:pointer;}',
    '.chat-send:hover{opacity:0.85;}',
    '.voice-active{background:'+t.accent+' !important;color:'+t.accentText+' !important;animation:pulse 1.5s infinite;}',
    '@keyframes pulse{0%,100%{opacity:1;}50%{opacity:0.5;}}',
    /* Mobile */
    '@media(max-width:640px){',
    '  .bar{padding:8px 10px;gap:6px;}',
    '  .surf-text{display:none;}',
    '  .surf-btn{padding:9px 12px;}',
    '  .inline-input{font-size:14px;padding:8px 8px;}',
    '  .inline-input::placeholder{font-size:13px;}',
    '  .chat-panel{width:calc(100vw - 20px);right:10px;}',
    '  .legal-toggle{width:24px;height:24px;}',
    '}'
  ].join('\n');

  /* ── Mount ─────────────────────────────────────────────── */
  var host = document.createElement('div');
  host.id = 'sh-footer';
  host.setAttribute('role','contentinfo');

  var shadow = host.attachShadow({mode:'open'});
  var styleEl = document.createElement('style');
  styleEl.textContent = css;

  var wrap = document.createElement('div');
  wrap.innerHTML = render(pool[idx]) +
    '<div class="chat-panel" id="sage-panel">' +
    '  <div class="chat-header">Sage \u2014 chanio <span class="chat-sub">Physician-supervised AI</span></div>' +
    '  <div class="chat-messages" id="sage-messages"></div>' +
    '</div>' +
    '<div class="legal-popover" id="legal-popover">' +
    '  <a href="https://solvinghealth.com/privacy">Privacy</a>' +
    '  <a href="https://solvinghealth.com/terms">Terms</a>' +
    '  <a href="https://solvinghealth.com/hipaa">HIPAA</a>' +
    '  <a href="https://solvinghealth.com">About</a>' +
    '  <span style="display:block;padding-top:6px;border-top:1px solid '+t.border+';margin-top:6px;">\u00a9 '+new Date().getFullYear()+' SolvingHealth</span>' +
    '</div>';

  shadow.appendChild(styleEl);
  shadow.appendChild(wrap);
  document.body.appendChild(host);

  document.body.style.paddingBottom = (host.offsetHeight || 48) + 'px';

  /* Story rotation removed — bar is now a single action surface (Surf + Talk) */

  /* ── Sage API ───────────────────────────────────────────── */
  var chatHistory = [];
  var CHANNEL = brandKey === 'condition-site' ? 'health' : brandKey;

  function sendToSage(text, root){
    var msgs = root.querySelector('#sage-messages');
    if(!msgs) return;

    /* Show user message */
    msgs.innerHTML += '<div class="chat-msg user">'+escHtml(text)+'</div>';
    msgs.innerHTML += '<div class="chat-msg sage" id="sage-typing"><span class="typing">Sage is thinking...</span></div>';
    msgs.scrollTop = msgs.scrollHeight;

    chatHistory.push({role:'user', content:text});

    fetch('https://solvinghealth.com/api/chat', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({message:text, channel:CHANNEL, history:chatHistory})
    })
    .then(function(r){ return r.json(); })
    .then(function(data){
      var typing = root.querySelector('#sage-typing');
      if(typing) typing.remove();
      var reply = data.answer || data.reply || data.message || data.response || 'I could not generate a response.';
      chatHistory.push({role:'assistant', content:reply});
      msgs.innerHTML += '<div class="chat-msg sage">'+formatReply(reply)+'</div>';
      msgs.scrollTop = msgs.scrollHeight;
    })
    .catch(function(){
      var typing = root.querySelector('#sage-typing');
      if(typing) typing.remove();
      msgs.innerHTML += '<div class="chat-msg sage">Sorry, I could not connect. Please try again.</div>';
    });
  }

  function escHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function formatReply(s){
    return s.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
  }

  /* ── Voice Recognition ─────────────────────────────────── */
  var recognition = null;
  function startVoice(root){
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SR) return;
    if(recognition){ recognition.stop(); recognition=null; return; }

    recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    var voiceBtn = root.querySelector('.voice-btn');
    if(voiceBtn) voiceBtn.classList.add('voice-active');

    /* Open chat panel */
    var panel = root.querySelector('#sage-panel');
    if(panel) panel.classList.add('open');

    recognition.onresult = function(e){
      var text = e.results[0][0].transcript;
      var input = root.querySelector('#inline-sage-input');
      if(input) input.value = text;
      sendToSage(text, root);
      if(voiceBtn) voiceBtn.classList.remove('voice-active');
      recognition = null;
    };
    recognition.onerror = function(){
      if(voiceBtn) voiceBtn.classList.remove('voice-active');
      recognition = null;
    };
    recognition.onend = function(){
      if(voiceBtn) voiceBtn.classList.remove('voice-active');
      recognition = null;
    };
    recognition.start();
  }

  /* ── Actions ───────────────────────────────────────────── */
  function bindActions(root){
    var panel = root.querySelector('#sage-panel');
    var inlineInput = root.querySelector('#inline-sage-input');
    var inlineSend = root.querySelector('#inline-sage-send');
    var voiceBtn = root.querySelector('.voice-btn');
    var legalToggle = root.querySelector('#legal-toggle');
    var legalPopover = root.querySelector('#legal-popover');

    /* Inline input sends on Enter AND opens panel to show history */
    var handleSend = function(){
      var text = (inlineInput.value || '').trim();
      if(!text) return;
      if(panel) panel.classList.add('open');
      sendToSage(text, root);
      inlineInput.value = '';
      inlineInput.focus();
    };

    if(inlineInput){
      inlineInput.addEventListener('keydown', function(e){
        if(e.key === 'Enter'){ e.preventDefault(); handleSend(); }
      });
      /* Opening panel on focus shows history if any */
      inlineInput.addEventListener('focus', function(){
        var msgs = root.querySelector('#sage-messages');
        if(panel && msgs && msgs.children.length > 0) panel.classList.add('open');
      });
      inlineInput.addEventListener('click', function(e){ e.stopPropagation(); });
    }
    if(inlineSend) inlineSend.addEventListener('click', function(e){ e.stopPropagation(); handleSend(); });

    /* Voice — talk to Sage */
    if(voiceBtn){
      voiceBtn.addEventListener('click', function(e){
        e.stopPropagation();
        if(panel) panel.classList.add('open');
        startVoice(root);
      });
    }

    /* Legal popover toggle */
    if(legalToggle && legalPopover){
      legalToggle.addEventListener('click', function(e){
        e.stopPropagation();
        legalPopover.classList.toggle('open');
      });
    }
  }
  bindActions(shadow);

  /* Close panel/popover on outside click */
  document.addEventListener('click', function(){
    var panel = shadow.querySelector('#sage-panel');
    var pop = shadow.querySelector('#legal-popover');
    if(panel) panel.classList.remove('open');
    if(pop) pop.classList.remove('open');
  });
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
}else{
  init();
}

})();
