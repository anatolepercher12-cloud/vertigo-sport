(function () {
  "use strict";
  var D = window.VS_DATA;
  var ROOT = document.body.getAttribute("data-root") || "";

  /* ---------- Stockage local (démo : remplace le serveur du site) ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem("vs_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem("vs_" + k, JSON.stringify(v)); } catch (e) {} },
    del: function (k) { try { localStorage.removeItem("vs_" + k); } catch (e) {} }
  };

  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function euro(n) { return n.toLocaleString("fr-FR", { style: "currency", currency: "EUR" }); }
  function idx(magId) { for (var i = 0; i < D.magasins.length; i++) if (D.magasins[i].id === magId) return i; return 0; }
  function mag(magId) { return D.magasins[idx(magId)]; }

  var ICONS = {
    heart: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.1 4.3 2.4h2c.7-1.3 2.2-2.4 4.3-2.4 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>',
    Vélo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="5.5" cy="16.5" r="3.5"/><circle cx="18.5" cy="16.5" r="3.5"/><path d="M5.5 16.5 9 9h6l3.5 7.5M9 9 7.5 6H5m7 10.5L15 9m-1-3h2.5"/></svg>',
    Randonnée: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m3 20 6-10 4 6 3-4 5 8z"/><circle cx="16.5" cy="5.5" r="1.8"/></svg>',
    Running: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 17h11.5a5.5 5.5 0 0 0 5.5-5.5V11l-4-1-2-4-3 1 1 3-3 1-2-2-3 2z"/><path d="M3 20h18"/></svg>',
    Glisse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 15c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 19c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2"/><path d="M7 11 17 4"/></svg>',
    Escalade: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 21 9 3h6l5 18z"/><circle cx="10.5" cy="9" r="1"/><circle cx="13.5" cy="13" r="1"/><circle cx="10" cy="17" r="1"/></svg>'
  };

  function stockBadge(q) {
    if (q <= 0) return '<span class="badge ko">Rupture</span>';
    if (q <= 2) return '<span class="badge low">Plus que ' + q + '</span>';
    return '<span class="badge ok">En stock (' + q + ')</span>';
  }

  /* ---------- Menu mobile ---------- */
  var toggle = $(".nav-toggle"), nav = $(".main-nav");
  if (toggle && nav) toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  /* ---------- Compte (démo) ---------- */
  function user() { return store.get("user", null); }
  var accountLink = $(".btn-account");
  if (accountLink && user()) accountLink.textContent = "Mon compte";

  /* ---------- Magasin préféré ---------- */
  function currentMag() { return store.get("magasin", D.magasins[0].id); }
  function fillMagSelect(sel) {
    sel.innerHTML = D.magasins.map(function (m) { return '<option value="' + m.id + '">' + esc(m.ville) + "</option>"; }).join("");
    sel.value = currentMag();
  }

  /* ---------- Horodatage de synchronisation simulé ---------- */
  function syncLabel() {
    var d = new Date(), m = d.getMinutes();
    d.setMinutes(m - (m % 10), 0, 0);
    return "Stock synchronisé avec nos magasins à " + d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) + " · mise à jour toutes les 10 min";
  }
  $$("[data-sync]").forEach(function (el) { el.innerHTML = '<span class="dot" aria-hidden="true"></span>' + esc(syncLabel()); });

  /* ---------- Favoris ---------- */
  function favs() { return store.get("favoris", []); }
  function toggleFav(id) {
    var f = favs(), i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.push(id);
    store.set("favoris", f);
    return i < 0;
  }

  /* ---------- Catalogue ---------- */
  var catalogue = $("#catalogue");
  if (catalogue) {
    var selMag = $("#f-mag"), selCat = $("#f-cat"), q = $("#f-q"), onlyStock = $("#f-stock");
    fillMagSelect(selMag);
    selCat.innerHTML = '<option value="">Toutes</option>' + D.categories.map(function (c) { return "<option>" + esc(c) + "</option>"; }).join("");
    var params = new URLSearchParams(location.search);
    if (params.get("cat")) selCat.value = params.get("cat");
    if (params.get("magasin")) selMag.value = params.get("magasin");

    var render = function () {
      var i = idx(selMag.value), term = q.value.trim().toLowerCase(), f = favs();
      var list = D.articles.filter(function (a) {
        return (!selCat.value || a.cat === selCat.value) &&
               (!term || a.nom.toLowerCase().indexOf(term) >= 0) &&
               (!onlyStock.checked || a.stock[i] > 0);
      });
      $("#count").textContent = list.length + " article" + (list.length > 1 ? "s" : "") + " à " + mag(selMag.value).ville;
      if (!list.length) { catalogue.innerHTML = '<div class="empty card">Aucun article ne correspond à votre recherche.</div>'; return; }
      catalogue.innerHTML = list.map(function (a) {
        var q = a.stock[i], fav = f.indexOf(a.id) >= 0, ailleurs = "";
        if (q <= 0) {
          var dispo = D.magasins.filter(function (m, j) { return a.stock[j] > 0; }).map(function (m) { return m.ville; });
          ailleurs = '<p class="other-stores">' + (dispo.length ? "Disponible à : " + esc(dispo.join(", ")) : "Indisponible dans tous nos magasins") + "</p>";
        }
        return '<article class="card product">' +
          '<div class="thumb">' + (ICONS[a.cat] || "") + "</div>" +
          '<span class="cat">' + esc(a.cat) + "</span>" +
          "<h3>" + esc(a.nom) + "</h3>" +
          stockBadge(q) + ailleurs +
          '<div class="row"><span class="price">' + euro(a.prix) + "</span>" +
          '<button class="fav" type="button" data-fav="' + a.id + '" aria-pressed="' + fav + '" aria-label="' + (fav ? "Retirer des favoris" : "Ajouter aux favoris") + '">' + ICONS.heart + "</button></div>" +
          "</article>";
      }).join("");
    };
    [selMag, selCat, onlyStock].forEach(function (el) { el.addEventListener("change", render); });
    selMag.addEventListener("change", function () { store.set("magasin", selMag.value); });
    q.addEventListener("input", render);
    catalogue.addEventListener("click", function (e) {
      var b = e.target.closest("[data-fav]");
      if (!b) return;
      var on = toggleFav(b.getAttribute("data-fav"));
      b.setAttribute("aria-pressed", on);
      b.setAttribute("aria-label", on ? "Retirer des favoris" : "Ajouter aux favoris");
    });
    render();
  }

  /* ---------- Page magasin : stock local ---------- */
  var storeStock = $("#store-stock");
  if (storeStock) {
    var i = idx(storeStock.getAttribute("data-mag"));
    storeStock.innerHTML = '<table><thead><tr><th>Article</th><th>Prix</th><th>Disponibilité</th></tr></thead><tbody>' +
      D.articles.map(function (a) { return "<tr><td>" + esc(a.nom) + "</td><td>" + euro(a.prix) + "</td><td>" + stockBadge(a.stock[i]) + "</td></tr>"; }).join("") +
      "</tbody></table>";
    var loc = $("#store-location");
    if (loc) loc.innerHTML = '<table><thead><tr><th>Matériel</th><th>Tarif / jour</th><th>Disponibles</th></tr></thead><tbody>' +
      D.location.map(function (l) { return "<tr><td>" + esc(l.nom) + "</td><td>" + euro(l.prixJour) + "</td><td>" + stockBadge(l.stock[i]) + "</td></tr>"; }).join("") +
      "</tbody></table>";
  }

  /* ---------- Réservation location ---------- */
  var resa = $("#resa-form");
  if (resa) {
    var rMag = $("#r-mag"), rMat = $("#r-mat"), rDeb = $("#r-debut"), rFin = $("#r-fin"), rQte = $("#r-qte");
    fillMagSelect(rMag);
    var p = new URLSearchParams(location.search);
    if (p.get("magasin")) rMag.value = p.get("magasin");
    var today = new Date().toISOString().slice(0, 10);
    rDeb.min = rFin.min = today;

    var u = user();
    if (u) { $("#r-nom").value = u.nom; $("#r-email").value = u.email; }

    var refresh = function () {
      var i = idx(rMag.value), cur = rMat.value;
      rMat.innerHTML = D.location.map(function (l) {
        var q = l.stock[i];
        return '<option value="' + l.id + '"' + (q <= 0 ? " disabled" : "") + ">" + esc(l.nom) + " — " + euro(l.prixJour) + "/jour" + (q <= 0 ? " (indisponible)" : " (" + q + " dispo.)") + "</option>";
      }).join("");
      if (cur && !$('option[value="' + cur + '"]', rMat).disabled) rMat.value = cur;
      else { var first = $("option:not([disabled])", rMat); if (first) rMat.value = first.value; }
      var item = D.location.filter(function (l) { return l.id === rMat.value; })[0];
      rQte.max = item ? item.stock[i] : 1;
      if (+rQte.value > +rQte.max) rQte.value = rQte.max;
      if (rFin.value && rDeb.value && rFin.value < rDeb.value) rFin.value = rDeb.value;
      rFin.min = rDeb.value || today;
      var jours = 0;
      if (rDeb.value && rFin.value) jours = Math.round((new Date(rFin.value) - new Date(rDeb.value)) / 864e5) + 1;
      var s = $("#r-summary");
      if (item && jours > 0) {
        s.innerHTML = "<div><span>" + esc(item.nom) + " × " + rQte.value + "</span><span>" + euro(item.prixJour) + " / jour</span></div>" +
          "<div><span>Durée</span><span>" + jours + " jour" + (jours > 1 ? "s" : "") + "</span></div>" +
          "<div><span>Caution (empreinte en magasin)</span><span>" + euro(item.caution * rQte.value) + "</span></div>" +
          '<div class="total"><span>À régler au retrait</span><span>' + euro(item.prixJour * jours * rQte.value) + "</span></div>";
      } else s.innerHTML = '<p class="muted small" style="margin:0">Choisissez vos dates pour voir le montant.</p>';
    };
    [rMag, rMat, rDeb, rFin, rQte].forEach(function (el) { el.addEventListener("change", refresh); });
    refresh();

    resa.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = $("#resa-msg");
      if (!resa.checkValidity()) { resa.reportValidity(); return; }
      var item = D.location.filter(function (l) { return l.id === rMat.value; })[0];
      var r = { id: "R" + Date.now().toString(36).toUpperCase(), mat: item.nom, mag: mag(rMag.value).ville, debut: rDeb.value, fin: rFin.value, qte: +rQte.value };
      var list = store.get("reservations", []); list.push(r); store.set("reservations", list);
      msg.className = "alert success";
      msg.innerHTML = "Réservation <strong>" + r.id + "</strong> enregistrée : " + esc(r.mat) + " à retirer au magasin de " + esc(r.mag) + " le " + new Date(r.debut).toLocaleDateString("fr-FR") + ". Le paiement se fait en magasin.";
      msg.hidden = false;
      msg.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  /* ---------- Espace client ---------- */
  var account = $("#account");
  if (account) {
    var renderAccount = function () {
      var u = user();
      $("#auth").hidden = !!u;
      $("#dashboard").hidden = !u;
      if (!u) return;
      $("#hello").textContent = "Bonjour " + u.nom;
      $("#acc-email").textContent = u.email;
      $("#acc-mag").textContent = mag(currentMag()).ville;
      var f = favs(), i = idx(currentMag());
      $("#acc-favs").innerHTML = f.length ? f.map(function (id) {
        var a = D.articles.filter(function (x) { return x.id === id; })[0];
        return a ? "<li><span>" + esc(a.nom) + " · " + euro(a.prix) + "</span>" + stockBadge(a.stock[i]) + "</li>" : "";
      }).join("") : '<li class="muted">Aucun favori. Ajoutez-en depuis le <a href="catalogue.html">catalogue</a>.</li>';
      var r = store.get("reservations", []);
      $("#acc-resa").innerHTML = r.length ? r.map(function (x) {
        return "<li><span><strong>" + x.id + "</strong> · " + esc(x.mat) + " × " + x.qte + " — " + esc(x.mag) + ", du " + new Date(x.debut).toLocaleDateString("fr-FR") + " au " + new Date(x.fin).toLocaleDateString("fr-FR") + "</span>" +
          '<button class="btn btn-ghost btn-sm" data-cancel="' + x.id + '">Annuler</button></li>';
      }).join("") : '<li class="muted">Aucune réservation. <a href="reservation.html">Réserver du matériel</a>.</li>';
    };

    $$(".tabs button", account).forEach(function (b) {
      b.addEventListener("click", function () {
        $$(".tabs button", account).forEach(function (x) { x.setAttribute("aria-selected", x === b); });
        $("#login-form").hidden = b.getAttribute("data-tab") !== "login";
        $("#signup-form").hidden = b.getAttribute("data-tab") !== "signup";
      });
    });

    $("#signup-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target;
      if (!f.checkValidity()) { f.reportValidity(); return; }
      store.set("user", { nom: f.nom.value.trim(), email: f.email.value.trim(), marketing: f.marketing.checked, creeLe: new Date().toISOString() });
      store.set("magasin", f.magasin.value);
      renderAccount();
    });
    fillMagSelect($("#su-mag"));

    $("#login-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var f = e.target, msg = $("#login-msg"), saved = store.get("user", null) || store.get("user_logout", null);
      if (saved && saved.email.toLowerCase() === f.email.value.trim().toLowerCase()) {
        store.set("user", saved); store.del("user_logout"); renderAccount();
      } else { msg.hidden = false; msg.className = "alert error"; msg.textContent = "Identifiants inconnus sur cet appareil. Créez un compte."; }
    });

    account.addEventListener("click", function (e) {
      var c = e.target.closest("[data-cancel]");
      if (c) {
        store.set("reservations", store.get("reservations", []).filter(function (x) { return x.id !== c.getAttribute("data-cancel"); }));
        renderAccount();
      }
    });
    $("#logout").addEventListener("click", function () { store.set("user_logout", user()); store.del("user"); renderAccount(); });

    var delBtn = $("#delete"), confirmBox = $("#delete-confirm");
    delBtn.addEventListener("click", function () { confirmBox.hidden = false; delBtn.hidden = true; });
    $("#delete-no").addEventListener("click", function () { confirmBox.hidden = true; delBtn.hidden = false; });
    $("#delete-yes").addEventListener("click", function () {
      ["user", "user_logout", "favoris", "reservations", "magasin"].forEach(store.del);
      confirmBox.hidden = true; delBtn.hidden = false;
      renderAccount();
      var m = $("#login-msg"); m.hidden = false; m.className = "alert success"; m.textContent = "Votre compte et toutes vos données ont été supprimés.";
    });
    renderAccount();
  }

  /* ---------- Contact ---------- */
  var contact = $("#contact-form");
  if (contact) {
    fillMagSelect($("#c-mag"));
    contact.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!contact.checkValidity()) { contact.reportValidity(); return; }
      var m = $("#contact-msg");
      m.hidden = false; m.className = "alert success";
      m.textContent = "Merci, votre message a bien été transmis au magasin de " + mag(contact.magasin.value).ville + ". Réponse sous 48 h ouvrées.";
      contact.reset(); fillMagSelect($("#c-mag"));
    });
  }

  /* ---------- Blog ---------- */
  var blog = $("#blog-list");
  if (blog) {
    var limit = +(blog.getAttribute("data-limit") || 99);
    blog.innerHTML = D.articlesBlog.slice(0, limit).map(function (p) {
      return '<article class="card post"><div class="cover" aria-hidden="true"></div>' +
        '<div class="meta"><span class="tag">' + esc(p.cat) + "</span><time datetime=\"" + p.date + '">' + new Date(p.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) + "</time></div>" +
        "<h3>" + esc(p.titre) + "</h3><p class=\"muted\">" + esc(p.resume) + "</p></article>";
    }).join("");
  }

  /* ---------- Liste des magasins ---------- */
  var storeList = $("#store-list");
  if (storeList) {
    storeList.innerHTML = D.magasins.map(function (m) {
      return '<article class="card store"><h3>' + esc(m.ville) + "</h3>" +
        "<dl><dt>Adresse</dt><dd>" + esc(m.adresse) + "</dd><dt>Tél.</dt><dd>" + esc(m.tel) + "</dd><dt>Horaires</dt><dd>" + esc(m.horaires) + "</dd></dl>" +
        '<a class="btn btn-primary btn-sm" href="' + ROOT + "magasins/" + m.id + '.html">Voir le magasin et son stock</a></article>';
    }).join("");
  }

  /* ---------- Bandeau cookies (« Tout refuser » aussi simple que « Tout accepter ») ---------- */
  var banner = $("#cookie-banner");
  function setConsent(c) { store.set("consent", { mesure: !!c.mesure, date: new Date().toISOString() }); banner.hidden = true; }
  if (banner) {
    if (!store.get("consent", null)) banner.hidden = false;
    $("#ck-refuse").addEventListener("click", function () { setConsent({ mesure: false }); });
    $("#ck-accept").addEventListener("click", function () { setConsent({ mesure: true }); });
    $("#ck-custom").addEventListener("click", function () { $("#ck-prefs").hidden = false; $("#ck-custom").hidden = true; $("#ck-save").hidden = false; });
    $("#ck-save").addEventListener("click", function () { setConsent({ mesure: $("#ck-mesure").checked }); });
    $$("[data-cookies]").forEach(function (b) { b.addEventListener("click", function () {
      var c = store.get("consent", null); $("#ck-mesure").checked = !!(c && c.mesure); banner.hidden = false;
    }); });
  }

  var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
})();
