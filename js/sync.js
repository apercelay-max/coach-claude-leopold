/* =========================================================================
   Claude — synchronisation multi-appareils
   -------------------------------------------------------------------------
   Même principe que les autres apps de Léopold (cap-sur-la-5e, bia-2027) :
   un code à 6 caractères + le projet Supabase partagé. Pas de vrai compte —
   le code est le seul lien entre le téléphone et l'ordinateur.

   Ce qui est synchronisé : les stats de révision + les réglages + l'email
   du résumé. Fusion : l'historique des séances est mis en commun (union),
   le reste prend la version la plus récente (updated_at).

   Config dans index.html : window.COACH_SUPABASE = { url, key }.
   Tant que `key` est vide, la synchro s'affiche comme « pas encore
   disponible » et ne fait rien (le reste de l'appli marche normalement).
   ========================================================================= */

(function () {
  "use strict";

  const CFG = window.COACH_SUPABASE || {};
  const TABLE = "coach_claude_leopold_state";
  const CLE_CODE = "coach-claude-leopold:sync-code";
  const CLE_MODIF = "coach-claude-leopold:sync-updated";
  const CLES_SYNC = [
    "coach-claude-leopold:stats-v1",
    "coach-claude-leopold:reglages-v1",
    "coach-claude-leopold:email-parent",
  ];

  const dispo = () => !!(CFG.url && CFG.key);

  let code = null;
  try { code = localStorage.getItem(CLE_CODE) || null; } catch (e) {}

  let statut = "idle"; // idle | sync | ok | err
  let dernier = 0;
  let timer = null;
  const abonnes = [];
  const notifier = () => abonnes.forEach((f) => { try { f(statut, dernier); } catch (e) {} });

  /* --------------------------- localStorage helpers --------------------------- */

  function lire(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }
  function ecrire(k, v) {
    try { if (v === null || v === undefined) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {}
  }
  function marquerModifLocale() {
    ecrire(CLE_MODIF, String(Date.now()));
  }

  function paquetLocal() {
    const d = {};
    CLES_SYNC.forEach((k) => { const v = lire(k); if (v !== null) d[k] = v; });
    return { donnees: d, updated: Number(lire(CLE_MODIF) || 0) };
  }

  /* ------------------------------- Fusion ------------------------------- */

  function fusionnerStats(localStr, distStr) {
    let a, b;
    try { a = JSON.parse(localStr || "null"); } catch (e) { a = null; }
    try { b = JSON.parse(distStr || "null"); } catch (e) { b = null; }
    if (!a) return distStr || null;
    if (!b) return localStr || null;

    // sessions : union dédupliquée (clé = JSON de la session)
    const vues = new Set();
    const sessions = [];
    (a.sessions || []).concat(b.sessions || []).forEach((s) => {
      const cle = JSON.stringify(s);
      if (!vues.has(cle)) { vues.add(cle); sessions.push(s); }
    });
    sessions.sort((x, y) => String(x.date).localeCompare(String(y.date)));

    // parExercice : par id, on garde le plus « avancé » (plus de tentatives)
    const parExercice = {};
    [a.parExercice || {}, b.parExercice || {}].forEach((src) => {
      Object.keys(src).forEach((id) => {
        const cur = parExercice[id];
        const cand = src[id];
        if (!cur || (cand.vus || 0) > (cur.vus || 0) || ((cand.vus || 0) === (cur.vus || 0) && (cand.dernier || 0) > (cur.dernier || 0))) {
          parExercice[id] = cand;
        }
      });
    });

    return JSON.stringify({ version: 1, sessions: sessions, parExercice: parExercice });
  }

  function fusionner(local, distant) {
    // distant = { data: {clé: valeurString}, updated_at: nombre }
    const dLocal = local.donnees;
    const dDist = (distant && distant.data) || {};
    const updLocal = local.updated || 0;
    const updDist = Number(distant && distant.updated_at) || 0;
    const distPlusRecent = updDist > updLocal;

    const res = {};
    const cles = new Set(CLES_SYNC);
    cles.forEach((k) => {
      const vL = dLocal[k];
      const vD = dDist[k];
      if (k === "coach-claude-leopold:stats-v1") {
        const m = fusionnerStats(vL, vD);
        if (m !== null) res[k] = m;
      } else if (distPlusRecent && vD !== undefined) {
        res[k] = vD;
      } else if (vL !== undefined) {
        res[k] = vL;
      } else if (vD !== undefined) {
        res[k] = vD;
      }
    });
    return { donnees: res, updated: Math.max(updLocal, updDist, Date.now() - 1) };
  }

  /* ------------------------------- Réseau ------------------------------- */

  function entetes() {
    return {
      apikey: CFG.key,
      Authorization: "Bearer " + CFG.key,
      "Content-Type": "application/json",
    };
  }

  async function tirerDistant() {
    const url = `${CFG.url}/rest/v1/${TABLE}?code=eq.${encodeURIComponent(code)}&select=data,updated_at`;
    const r = await fetch(url, { headers: entetes() });
    if (!r.ok) throw new Error("GET " + r.status);
    const rows = await r.json();
    if (!rows || !rows.length) return null;
    const row = rows[0];
    return { data: row.data || {}, updated_at: row.updated_at ? Date.parse(row.updated_at) : 0 };
  }

  async function pousserDistant(paquet) {
    const body = JSON.stringify({
      code: code,
      data: paquet.donnees,
      updated_at: new Date().toISOString(),
    });
    const r = await fetch(`${CFG.url}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: Object.assign(entetes(), { Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: body,
    });
    if (!r.ok) throw new Error("POST " + r.status);
  }

  /* ---------------------------- Orchestration ---------------------------- */

  let enCours = false;

  async function synchroniser() {
    if (!dispo() || !code || enCours) return;
    enCours = true;
    statut = "sync";
    notifier();
    try {
      const local = paquetLocal();
      const distant = await tirerDistant();
      const fusion = fusionner(local, distant);

      // Écrit la fusion en local (sans redéclencher un push en boucle)
      appliquerSansEcho = true;
      Object.keys(fusion.donnees).forEach((k) => {
        if (fusion.donnees[k] !== lire(k)) ecrire(k, fusion.donnees[k]);
      });
      ecrire(CLE_MODIF, String(fusion.updated));
      appliquerSansEcho = false;

      await pousserDistant(fusion);

      statut = "ok";
      dernier = Date.now();
      notifier();

      // Rafraîchit l'écran de réglages si ouvert (les réglages ont pu changer)
      if (window.CoachReglages && window.CoachReglages.appliquer) window.CoachReglages.appliquer();
      const rc = document.getElementById("reglages-contenu");
      if (rc && rc.offsetParent !== null && window.CoachReglages && window.CoachReglages.rendreEcran) {
        window.CoachReglages.rendreEcran(rc);
      }
    } catch (e) {
      statut = "err";
      notifier();
    } finally {
      enCours = false;
    }
  }

  function pousseDebounce() {
    if (!dispo() || !code) return;
    clearTimeout(timer);
    timer = setTimeout(synchroniser, 1000);
  }

  /* ---- Patch localStorage : toute modif de nos clés = modif locale + push ---- */

  let appliquerSansEcho = false;
  const _setItem = localStorage.setItem.bind(localStorage);
  try {
    localStorage.setItem = function (k, v) {
      _setItem(k, v);
      if (!appliquerSansEcho && dispo() && code && typeof k === "string" && CLES_SYNC.indexOf(k) !== -1) {
        marquerModifLocale();
        pousseDebounce();
      }
    };
  } catch (e) {
    /* certains navigateurs refusent de patcher : la synchro se fera au chargement uniquement */
  }

  /* ------------------------------- Code ------------------------------- */

  function genererCode() {
    const alpha = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // sans I, L, O, 0, 1
    let c = "";
    for (let i = 0; i < 6; i++) c += alpha[Math.floor(Math.random() * alpha.length)];
    return c;
  }

  function activer(codeChoisi) {
    code = (codeChoisi || genererCode()).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
    ecrire(CLE_CODE, code);
    marquerModifLocale();
    synchroniser();
    notifier();
  }

  function desactiver() {
    code = null;
    ecrire(CLE_CODE, null);
    statut = "idle";
    notifier();
  }

  /* --------------------------- UI (Réglages) --------------------------- */

  function el(tag, cls, texte) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (texte != null) n.textContent = texte;
    return n;
  }

  function rendreReglages(conteneur) {
    conteneur.innerHTML = "";
    const wrap = el("div", "reglage-ligne-col");
    wrap.appendChild(el("div", "reglage-titre", "Synchroniser mes appareils"));

    if (!dispo()) {
      // Synchro pas encore configurée (clé Supabase absente) : on n'affiche rien.
      return;
    }

    if (!code) {
      wrap.appendChild(el("div", "reglage-desc", "Crée un code, puis entre-le sur ton autre appareil : ta progression sera la même partout."));
      const btns = el("div", "reglage-boutons");
      const bNew = el("button", "btn btn-principal", "Créer un code");
      bNew.addEventListener("click", () => { activer(); rendreReglages(conteneur); });
      const bJoin = el("button", "btn btn-fantome", "J'ai déjà un code");
      bJoin.addEventListener("click", () => {
        const c = window.prompt("Entre le code affiché sur ton autre appareil (6 caractères) :");
        if (c && c.trim()) { activer(c.trim()); rendreReglages(conteneur); }
      });
      btns.append(bNew, bJoin);
      wrap.appendChild(btns);
      conteneur.appendChild(wrap);
      return;
    }

    wrap.appendChild(el("div", "reglage-desc", "Entre ce code sur ton autre appareil (Réglages → Mémoire → « J'ai déjà un code »)."));
    const codeBox = el("div", "sync-code");
    codeBox.textContent = code;
    wrap.appendChild(codeBox);

    const statutTxt = el("div", "sync-statut");
    const majStatut = (s, d) => {
      statutTxt.textContent =
        s === "sync" ? "Synchro en cours…" :
        s === "ok" ? "Synchronisé ✓" :
        s === "err" ? "Erreur de synchro — réessai au prochain changement" :
        "";
      statutTxt.dataset.etat = s;
    };
    majStatut(statut, dernier);
    abonnes.push(majStatut);
    wrap.appendChild(statutTxt);

    const btns = el("div", "reglage-boutons");
    const bSync = el("button", "btn btn-fantome", "Synchroniser maintenant");
    bSync.addEventListener("click", synchroniser);
    const bCopy = el("button", "btn btn-fantome", "Copier le code");
    bCopy.addEventListener("click", () => {
      try { navigator.clipboard.writeText(code); bCopy.textContent = "Copié ✓"; setTimeout(() => (bCopy.textContent = "Copier le code"), 1500); } catch (e) {}
    });
    const bStop = el("button", "btn btn-fantome", "Arrêter");
    bStop.addEventListener("click", () => {
      if (window.confirm("Arrêter la synchro sur cet appareil ? (ta progression locale reste)")) { desactiver(); rendreReglages(conteneur); }
    });
    btns.append(bSync, bCopy, bStop);
    wrap.appendChild(btns);
    conteneur.appendChild(wrap);
  }

  /* ------------------------------- Init ------------------------------- */

  window.CoachSync = {
    rendreReglages: rendreReglages,
    synchroniser: synchroniser,
    actif: () => !!code && dispo(),
    onStatut: (f) => abonnes.push(f),
  };

  // Synchro au chargement (si code + config)
  if (dispo() && code) {
    document.addEventListener("DOMContentLoaded", () => setTimeout(synchroniser, 400));
  }
})();
