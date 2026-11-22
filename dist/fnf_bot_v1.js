(function () {
"use strict";
if (W_topCheck()) {
    var frames = [].slice.call(document.querySelectorAll("iframe"));
    var cands = [];
    for (var fi = 0; fi < frames.length; fi++) {
        var fr = frames[fi];
        var fsrc = fr.getAttribute("src") || fr.src || "";
        var rect = fr.getBoundingClientRect();
        if (fsrc && /^https?:\/\//i.test(fsrc) && rect.width > 120 && rect.height > 80) {
            cands.push({ src: fsrc });
        }
    }
    if (cands.length) {
        window.__fnfIframePromptShown = true;
        var chosen = cands[0], host = "";
        try { host = new URL(chosen.src, location.href).hostname; } catch (e1) {}
        var shade = document.createElement("div");
        shade.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(4,8,18,.84);display:grid;place-items:center;padding:18px;font:14px system-ui,sans-serif;color:#f5f7ff";
        var card = document.createElement("div");
        card.style.cssText = "max-width:440px;width:100%;box-sizing:border-box;background:#151d31;border:1px solid #5874a8;border-radius:16px;padding:20px;box-shadow:0 18px 60px #0009";
        var ttl = document.createElement("div");
        ttl.textContent = "FNF_BOT_V1 · IFRAME ACCESS";
        ttl.style.cssText = "font-weight:800;font-size:18px;margin-bottom:10px";
        var msg = document.createElement("p");
        msg.textContent = "E stato rilevato un iframe. Vuoi aprire la pagina del gioco direttamente in questa scheda? Il bot non entra automaticamente nell'iframe.";
        msg.style.cssText = "line-height:1.5;color:#d7e1f7";
        var dm = document.createElement("p");
        dm.textContent = "Dominio rilevato: " + (host || "non identificato");
        dm.style.cssText = "overflow-wrap:anywhere;color:#9fe8ca;font-weight:700";
        var note = document.createElement("p");
        note.textContent = "Per sicurezza il consenso non aggira le protezioni tra domini: se la pagina diretta non e' accessibile, l'iframe potrebbe non essere supportato.";
        note.style.cssText = "font-size:12px;color:#aebbd2;line-height:1.45";
        var row = document.createElement("div");
        row.style.cssText = "display:flex;gap:10px;margin-top:16px";
        function mkBtn(label, bg, fn) {
            var b = document.createElement("button");
            b.type = "button"; b.textContent = label;
            b.style.cssText = "flex:1;padding:11px;border:0;border-radius:10px;background:" + bg + ";color:#08111e;font-weight:800;cursor:pointer";
            b.addEventListener("click", fn);
            return b;
        }
        var yesB = mkBtn("SI · APRI PAGINA", "#69efb7", function () {
            try {
                var u = new URL(chosen.src, location.href);
                if (u.protocol !== "http:" && u.protocol !== "https:") throw 0;
                location.href = u.href;
            } catch (e2) {
                msg.textContent = "Impossibile aprire questo indirizzo. Apri manualmente il gioco in una scheda separata.";
            }
        });
        var noB = mkBtn("NO · ANNULLA", "#aab6ca", function () {
            shade.remove();
            window.__fnfIframePromptShown = false;
        });
        row.appendChild(yesB); row.appendChild(noB);
        card.appendChild(ttl); card.appendChild(msg); card.appendChild(dm); card.appendChild(note); card.appendChild(row);
        shade.appendChild(card);
        (document.body || document.documentElement).appendChild(shade);
        return;
    }
}
function W_topCheck() {
    try { return window.top === window.self && !window.__fnfIframePromptShown; }
    catch (e0) { return false; }
}
if (window.__fnfBotV1) { window.__fnfBotV1.toggle(); return; }
var W = window, D = document;
var VER = "V1";
var CREDIT = "@VexCore-i6p";
var CREDIT_URL = "https://www.youtube.com/@VexCore-i6p";
var cfg = {
    on: true,
    mode: "AUTO",
    missChance: 0,
    advanceMs: 70,
    hitWindowMs: 45,
    keyHoldMs: 45,
    holdReleaseExtraMs: 160,
    gapMs: 12,
    calibMs: -10,
    autoSync: true,
    learnFromDeath: true,
    hpWatch: true,
    uiHidden: false
};
var stats = { hits: 0, misses: 0, dodged: 0, played: 0 };
var KEYCODES = [37, 40, 38, 39];
var KEYNAMES = {
    37: ["ArrowLeft", "ArrowLeft"],
    40: ["ArrowDown", "ArrowDown"],
    38: ["ArrowUp", "ArrowUp"],
    39: ["ArrowRight", "ArrowRight"],
    32: ["Space", " "]
};
var keyActive = [], keyToken = [];
var pendingPresses = [];
function ringReset() { keyActive = []; keyToken = []; }
function fireKey(dir, down) {
    var code = KEYCODES[dir];
    if (code == null) return;
    var kn = KEYNAMES[code] || ["Key" + code, String.fromCharCode(code)];
    var ev = new KeyboardEvent(down ? "keydown" : "keyup", {
        keyCode: code, which: code, code: kn[0], key: kn[1],
        bubbles: true, cancelable: true, view: W
    });
    try { Object.defineProperty(ev, "keyCode", { get: function () { return code; } }); } catch (e1) {}
    try { Object.defineProperty(ev, "which", { get: function () { return code; } }); } catch (e2) {}
    var target = null;
    try {
        var canvases = D.querySelectorAll("canvas"), best = null, area = 0;
        for (var i = 0; i < canvases.length; i++) {
            var a = (canvases[i].width || 0) * (canvases[i].height || 0);
            if (a > area) { area = a; best = canvases[i]; }
        }
        var act = D.activeElement;
        if (act && act !== D.body && act !== D.documentElement && act.dispatchEvent) target = act;
        else if (best) {
            if (!best.hasAttribute("tabindex")) best.setAttribute("tabindex", "0");
            if (D.activeElement !== best && best.focus) try { best.focus({ preventScroll: true }); } catch (e3) {}
            target = best;
        }
    } catch (e4) {}
    if (!target) target = D;
    try { target.dispatchEvent(ev); } catch (e5) {
        try { D.dispatchEvent(ev); } catch (e6) {}
        try { W.dispatchEvent(ev); } catch (e7) {}
    }
}
function releaseAllKeys() {
    for (var i = 0; i < KEYCODES.length; i++) {
        if (keyActive[i]) { keyActive[i] = 0; fireKey(i, false); }
    }
    pendingPresses = [];
}
var audioEl = null;
var waState = { ctx: null, startAt: 0, offset: 0, dur: 0, src: null, wall: 0 };
function isSongSrc(u) {
    if (!u) return false;
    if (Array.isArray(u)) { for (var i = 0; i < u.length; i++) if (isSongSrc(u[i])) return true; return false; }
    var s = String(u);
    return /\/songs\//i.test(s) || /(^|\/)(inst|voices)\.(ogg|mp3|wav|m4a)/i.test(s);
}
function getSongHowl() {
    try {
        if (W.__fnfSongHowl) {
            var c = W.__fnfSongHowl;
            if (c.playing && c.playing() && isSongSrc(c._src)) return c;
            W.__fnfSongHowl = null;
        }
        if (!W.Howler || !Howler._howls) return null;
        var list = Howler._howls, best = null, bs = 0;
        for (var i = 0; i < list.length; i++) {
            var h = list[i];
            try {
                if (!h.playing || !h.playing() || !isSongSrc(h._src)) continue;
                var d = h.duration();
                if (!d || d < 5) continue;
                var sc = /\/inst\./i.test(String(h._src)) ? 2 : 1;
                if (sc > bs) { bs = sc; best = h; }
            } catch (e1) {}
        }
        if (best) { W.__fnfSongHowl = best; return best; }
    } catch (e2) {}
    return null;
}
function howlerSeekMs(h) {
    try {
        var snds = h._sounds || [];
        for (var i = 0; i < snds.length; i++) {
            var s = snds[i];
            if (s && s._playing && s._id != null) {
                var v = h.seek(s._id);
                if (typeof v === "number" && isFinite(v)) return v * 1000;
            }
        }
        var v2 = h.seek();
        return (typeof v2 === "number" && isFinite(v2)) ? v2 * 1000 : null;
    } catch (e) { return null; }
}
function waMs() {
    try {
        if (!waState.ctx || !waState.dur) return null;
        var el = (waState.ctx.currentTime - waState.startAt + waState.offset) * 1000;
        if (el < -300) return null;
        if (el > (waState.dur + 12) * 1000) return null;
        return el;
    } catch (e) { return null; }
}
function engineMs() {
    var e = window.__fnfEngine;
    if (e && e.cls && typeof e.cls.songPosition === "number") return e.cls.songPosition;
    if (e && e.cond && typeof e.cond.songPosition === "number") return e.cond.songPosition;
    return null;
}
function nowMs() {
    var et = engineMs();
    if (et != null && et >= 0) return et;
    var w = waMs();
    if (w != null && w >= 0) return w;
    try {
        var h = getSongHowl();
        if (h) { var hm = howlerSeekMs(h); if (hm != null && hm >= 0) return hm; }
    } catch (e1) {}
    if (audioEl && typeof audioEl.currentTime === "number" && isFinite(audioEl.currentTime) && audioEl.currentTime > 0) {
        return audioEl.currentTime * 1000;
    }
    return null;
}
function installAudioHooks() {
    if (W.__fnfV1AudioHooked) return;
    W.__fnfV1AudioHooked = true;
    try {
        if (W.Howl && W.Howl.prototype) {
            var op = W.Howl.prototype.play;
            W.Howl.prototype.play = function () {
                try {
                    var ss = this._sounds || [];
                    for (var i = 0; i < ss.length; i++) {
                        var n = ss[i]._node;
                        if (!n) continue;
                        var d = 0; try { d = n.duration || 0; } catch (e1) {}
                        if (d > 25 || !isFinite(d)) { if (!audioEl) audioEl = n; }
                    }
                } catch (e2) {}
                return op.apply(this, arguments);
            };
        }
    } catch (e3) {}
    try {
        var oa = HTMLAudioElement.prototype.play;
        HTMLAudioElement.prototype.play = function () {
            try {
                if (!audioEl && this && (this.duration > 25 || !this.duration)) audioEl = this;
            } catch (e1) {}
            var r = oa.call(this);
            if (r && typeof r["catch"] === "function") { try { r["catch"](function () {}); } catch (e2) {} }
            return r;
        };
    } catch (e3) {}
    try {
        var os = AudioBufferSourceNode.prototype.start;
        AudioBufferSourceNode.prototype.start = function (when, offset) {
            try {
                var d = this.buffer ? this.buffer.duration : 0;
                if (d && d > 20 && this.context) {
                    var wall = performance.now();
                    var dup = waState.src && (wall - waState.wall) < 800 && Math.abs(waState.dur - d) < 4;
                    if (!dup) {
                        waState.ctx = this.context;
                        waState.startAt = (typeof when === "number" && when > 0) ? when : this.context.currentTime;
                        waState.offset = (typeof offset === "number" && isFinite(offset)) ? offset : 0;
                        waState.dur = d;
                        waState.src = this;
                        waState.wall = wall;
                    }
                }
            } catch (e1) {}
            return os.apply(this, arguments);
        };
        var ostop = AudioBufferSourceNode.prototype.stop;
        AudioBufferSourceNode.prototype.stop = function () {
            try { if (waState.src === this) { waState.dur = 0; waState.src = null; } } catch (e1) {}
            return ostop.apply(this, arguments);
        };
    } catch (e2) {}
    try {
        var tags = D.querySelectorAll("audio,video");
        for (var t = 0; t < tags.length; t++) {
            var el = tags[t];
            if (!el.paused && !el.ended && (el.duration > 25 || !isFinite(el.duration))) { audioEl = el; break; }
        }
    } catch (e3) {}
}
var chart = { done: false, notes: [], level: "", types: {}, ring: false, bpm: 0, speed: 1, secStarts: [] };
var seenUrls = [];
var chartCache = W.__fnfV1ChartCache = W.__fnfV1ChartCache || {};
var gen = 0;
function normName(s) { return String(s || "").toLowerCase().replace(/\s+/g, "-"); }
function levelNameOf(u) {
    var s = String(u || "").split("?")[0];
    var seg = s.split("/").pop();
    return seg.replace(/\.[^.]*$/, "");
}
function chartSongOf(u) {
    var seg = String(u || "").split("?")[0].split("#")[0].split("/").pop().replace(/\.json$/i, "").toLowerCase();
    var suf = ["-hard-originalbnotes", "-originalbnotes", "-bnotes", "-hardl", "-erect", "-normal", "-hard", "-easy", "-har", "-pico"];
    for (var i = 0; i < suf.length; i++) {
        if (seg.length > suf[i].length && seg.slice(-suf[i].length) === suf[i]) { seg = seg.slice(0, -suf[i].length); break; }
    }
    return seg;
}
function setLevel(l) {
    if (chart.level === l) return;
    chart = { done: false, notes: [], level: l || "", types: {}, ring: false, bpm: 0, speed: 1, secStarts: [] };
    stats.hits = stats.misses = stats.dodged = stats.played = 0;
    releaseAllKeys(); ringReset(); gen++; pendingPresses = [];
}
function isFlatArr(a) {
    if (!a || !a.length) return false;
    var n = a[0];
    if (!n) return false;
    return Array.isArray(n) || typeof n.t === "number" || typeof n.time === "number";
}
function shouldParse(v) {
    if (!v) return false;
    var o = v.song && typeof v.song === "object" ? v.song : v;
    if (o.notes) {
        if (Array.isArray(o.notes) && o.notes.length) return true;
        if (typeof o.notes === "object") {
            var k = Object.keys(o.notes);
            for (var i = 0; i < k.length; i++) {
                var a = o.notes[k[i]];
                if (Array.isArray(a) && a.length) return true;
            }
        }
    }
    if (o.sections && o.sections.length) return true;
    if (v.songs) return true;
    return false;
}
function addNote(time, data, length, type, player) {
    if (typeof time !== "number" || !isFinite(time) || typeof data !== "number" || time < 0) return false;
    var lim = chart.ring ? 14 : 7;
    if (data < 0 || data > lim) return false;
    if (typeof length !== "number" || length < 0) length = 0;
    if (type) chart.types[type] = (chart.types[type] || 0) + 1;
    chart.notes.push({
        time: time, data: data % (chart.ring ? 5 : 4), length: length,
        type: type || "", player: !!player,
        danger: isDangerType(type) || (chart.numTy === 1 && type === "3"),
        done: false
    });
    return true;
}
function parseChart(obj, lvl) {
    if (!obj) return 0;
    if (lvl && lvl !== chart.level) setLevel(lvl);
    if (chart.done && chart.notes.length) { chart.notes = []; chart.done = false; gen++; releaseAllKeys(); }
    var sg0 = obj.song && typeof obj.song === "object" ? obj.song : obj;
    chart.bpm = (typeof sg0.bpm === "number") ? sg0.bpm : 0;
    chart.speed = (typeof sg0.speed === "number" && sg0.speed > 0) ? sg0.speed : 1;
    chart.ring = false; chart.numTy = 0;
    var scanR = function (arr) {
        if (!arr || !arr.length) return;
        for (var i = 0; i < arr.length; i++) {
            var it = arr[i];
            if (!it) continue;
            if (Array.isArray(it)) {
                if (typeof it[1] === "number" && it[1] > 7) chart.ring = true;
                if (typeof it[3] === "number") chart.numTy = 1;
            } else if (it.sectionNotes) scanR(it.sectionNotes);
        }
    };
    if (Array.isArray(sg0.notes)) scanR(sg0.notes);
    var playerLim = chart.ring ? 5 : 4;
    function scanNotes(arr, playerF) {
        var got = 0;
        if (!arr || !arr.length) return 0;
        for (var i = 0; i < arr.length; i++) {
            var n = arr[i];
            if (!n) continue;
            if (Array.isArray(n)) {
                if (typeof n[0] !== "number" || typeof n[1] !== "number") continue;
                if (addNote(n[0], n[1], (typeof n[2] === "number" && n[2] > 0) ? n[2] : 0,
                    (typeof n[3] === "string" ? n[3] : (typeof n[3] === "number" ? String(n[3]) : "")), playerF(n[1]))) got++;
            } else if (typeof n.t === "number" && typeof n.d === "number") {
                if (addNote(n.t, n.d, (typeof n.l === "number" ? n.l : 0),
                    (typeof n.k === "string" ? n.k : (typeof n.type === "string" ? n.type : (typeof n.type === "number" ? String(n.type) : ""))),
                    playerF(n.d))) got++;
            } else if (typeof n.time === "number" && typeof n.data === "number") {
                if (addNote(n.time, n.data, (typeof n.length === "number" ? n.length : 0),
                    (typeof n.type === "string" ? n.type : (typeof n.type === "number" ? String(n.type) : "")),
                    playerF(n.data))) got++;
            }
        }
        return got;
    }
    function scanSections(arr) {
        var got = 0;
        if (!arr || !arr.length) return 0;
        var starts = [], cur = 0, bpm = chart.bpm || 0;
        for (var si = 0; si < arr.length; si++) {
            var s0 = arr[si];
            if (s0 && s0.changeBPM && typeof s0.bpm === "number" && s0.bpm > 0) bpm = s0.bpm;
            if (!(bpm > 0)) bpm = 100;
            starts.push(cur);
            cur += 240000 / bpm;
        }
        chart.secStarts = starts;
        for (var i = 0; i < arr.length; i++) {
            var sec = arr[i];
            if (!sec || !sec.sectionNotes || !sec.sectionNotes.length) continue;
            var mh = !!sec.mustHitSection;
            got += scanNotes(sec.sectionNotes, function (data) { return mh ? data < playerLim : data >= playerLim; });
        }
        return got;
    }
    var count = 0;
    var songObj = obj.song && typeof obj.song === "object" ? obj.song : obj;
    if (songObj.notes && typeof songObj.notes === "object") {
        if (Array.isArray(songObj.notes)) {
            count += isFlatArr(songObj.notes)
                ? scanNotes(songObj.notes, function (d) { return d < playerLim; })
                : scanSections(songObj.notes);
        } else {
            var keys = Object.keys(songObj.notes);
            for (var k = 0; k < keys.length; k++) {
                var v = songObj.notes[keys[k]];
                if (Array.isArray(v)) {
                    var g1 = isFlatArr(v) ? scanNotes(v, function (d) { return d < playerLim; }) : scanSections(v);
                    count += g1;
                    if (g1 > 0) break;
                } else if (v && Array.isArray(v.notes)) {
                    var g2 = scanNotes(v.notes, function (d) { return d < playerLim; });
                    count += g2;
                    if (g2 > 0) break;
                }
            }
        }
    }
    if (songObj.sections) count += scanSections(songObj.sections);
    if (Array.isArray(obj)) {
        count += isFlatArr(obj) ? scanNotes(obj, function (d) { return d < playerLim; }) : scanSections(obj);
    }
    if (count > 0) {
        chart.done = true;
        chart.notes.sort(function (a, b) { return a.time - b.time; });
        console.log("[FNF_Bot_V1] chart " + (chart.level || lvl || "?") + ": " + count + " note, " + chart.bpm + " bpm" + (chart.ring ? " [RING]" : ""));
    }
    return count;
}
function offerChart(j, name) {
    if (!j || !shouldParse(j)) return 0;
    var key = name || "";
    try {
        var sg = j.song && typeof j.song === "object" ? j.song : j;
        if (typeof sg.song === "string" && sg.song) key = normName(sg.song);
    } catch (e1) {}
    if (!key) key = "chart-" + Object.keys(chartCache).length;
    chartCache[key] = j;
    var folder = currentSongFolder();
    if (folder && chartSongOf(key) === normName(folder)) return activateChart(key);
    return 0;
}
function activateChart(name) {
    var j = chartCache[name];
    if (!j) return 0;
    if (chart.done && chart.notes.length && chart.level === name) return chart.notes.length;
    var n = parseChart(j, name);
    if (n > 0) banner("Chart " + name + ": " + n + " note", 2500);
    return n;
}
function currentSongFolder() {
    try {
        var h = getSongHowl();
        if (h) {
            var m = String(Array.isArray(h._src) ? h._src[0] : h._src).match(/\/songs\/([^\/?#]+)\//i);
            if (m) return decodeURIComponent(m[1]);
            var ss = h._sounds || [];
            for (var i = 0; i < ss.length; i++) {
                var m2 = String(ss[i] && ss[i]._src || "").match(/\/songs\/([^\/?#]+)\//i);
                if (m2) return decodeURIComponent(m2[1]);
            }
        }
    } catch (e1) {}
    var res = W.__fnfV1ResSeen || [];
    var best = "", bt = -1;
    for (var k = 0; k < res.length; k++) {
        var m3 = String(res[k]).match(/assets\/songs\/([^\/?#]+)\//i);
        if (!m3) continue;
        var tt = 0;
        try { var ent = performance.getEntriesByName(res[k]); if (ent && ent.length) tt = ent[ent.length - 1].startTime; } catch (e2) {}
        if (tt >= bt) { bt = tt; best = decodeURIComponent(m3[1]); }
    }
    if (best) return best;
    try {
        if (audioEl) {
            var m4 = String(audioEl.currentSrc || audioEl.src || "").match(/\/songs\/([^\/?#]+)\//i);
            if (m4) return decodeURIComponent(m4[1]);
        }
    } catch (e3) {}
    return null;
}
function noteUrlSeen(u) {
    if (!u) return;
    u = String(u);
    if (seenUrls.indexOf(u) < 0) seenUrls.push(u);
    W.__fnfV1ResSeen = seenUrls;
}
function installChartHooks() {
    if (W.__fnfV1ChartHooked) return;
    W.__fnfV1ChartHooked = true;
    try { performance.setResourceTimingBufferSize(5000); } catch (e0) {}
    try {
        var of = W.fetch;
        if (typeof of === "function") {
            W.fetch = function (u) {
                try { noteUrlSeen(typeof u === "string" ? u : (u && u.url)); } catch (e1) {}
                return of.apply(this, arguments);
            };
        }
    } catch (e2) {}
    try {
        var oopen = XMLHttpRequest.prototype.open, osend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function (mth, u) { try { this.__fnfV1U = u; } catch (e1) {} return oopen.apply(this, arguments); };
        XMLHttpRequest.prototype.send = function () { try { noteUrlSeen(this.__fnfV1U); } catch (e1) {} return osend.apply(this, arguments); };
    } catch (e2) {}
    try {
        var oj = JSON.parse;
        JSON.parse = function (txt) {
            var r = oj.apply(this, arguments);
            try {
                if (!W.__fnfV1JsonLock) {
                    W.__fnfV1JsonLock = 1;
                    try {
                        if (r && typeof r === "object" && shouldParse(r)) {
                            var sg = r.song && typeof r.song === "object" ? r.song : r;
                            if (typeof sg.song === "string" && sg.song) {
                                W.__fnfV1EngChart = { name: normName(sg.song), obj: r, t: performance.now() };
                            }
                        }
                    } finally { W.__fnfV1JsonLock = 0; }
                }
            } catch (e1) {}
            return r;
        };
    } catch (e2) {}
}
function resourceUrls() {
    var out = [];
    try {
        var e = performance.getEntriesByType("resource");
        for (var i = 0; i < e.length; i++) if (e[i] && e[i].name && out.indexOf(e[i].name) < 0) out.push(e[i].name);
    } catch (ex) {}
    for (var j = 0; j < seenUrls.length; j++) if (seenUrls[j] && out.indexOf(seenUrls[j]) < 0) out.push(seenUrls[j]);
    return out;
}
function chartRank(u, folder) {
    var base = String(u || "").split("?")[0].split("/").pop().replace(/\.json$/i, "").toLowerCase();
    if (base === folder) return 0;
    if (base === folder + "-normal") return 1;
    if (base === folder + "-hard") return 2;
    if (base === folder + "-easy") return 3;
    if (base.indexOf(folder + "-") === 0) return 4;
    return 9;
}
function findChartUrls(folder) {
    var f = normName(folder), out = [], res = resourceUrls(), prefix = "";
    for (var i = 0; i < res.length; i++) {
        var u = res[i];
        if (!/\.json($|\?)/i.test(u) || !/\/assets\/data\//i.test(u)) continue;
        var m = String(u).match(/^(.*\/assets\/data\/)/i);
        if (m && !prefix) prefix = m[1];
        if (chartSongOf(u) === f && out.indexOf(u) < 0) out.push(u);
    }
    if (!prefix) prefix = "./assets/data/";
    var extra = [prefix + f + "/" + f + ".json", prefix + f + "/" + f + "-hard.json", prefix + f + "/" + f + "-easy.json"];
    for (var k = 0; k < extra.length; k++) if (out.indexOf(extra[k]) < 0) out.push(extra[k]);
    out.sort(function (a, b) { return chartRank(a, f) - chartRank(b, f); });
    return out;
}
var v1ChartTries = {}, v1LastTry = 0;
function fetchChartDirect(url, cb) {
    if (!url) { if (cb) cb(false); return; }
    if (W.__fnfV1Req && W.__fnfV1Req[url]) return;
    W.__fnfV1Req = W.__fnfV1Req || {};
    W.__fnfV1Req[url] = true;
    function finish(ok) { delete W.__fnfV1Req[url]; if (cb) cb(!!ok); }
    function parseText(txt, status) {
        try {
            txt = String(txt || "").replace(/^\uFEFF/, "").trim();
            if ((status === 200 || status === 0) && txt.charAt(0) === "{") {
                var j = JSON.parse(txt);
                var n = offerChart(j, levelNameOf(url));
                if (n > 0) { finish(true); return; }
            }
        } catch (e1) {}
        finish(false);
    }
    try {
        if (typeof W.fetch === "function") {
            W.fetch(url, { cache: "no-store" }).then(function (res) {
                return res.text().then(function (txt) { parseText(txt, res.status); });
            }, function () { finish(false); });
            return;
        }
    } catch (e1) {}
    try {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "text";
        xhr.onload = function () { parseText(xhr.responseText, xhr.status); };
        xhr.onerror = function () { finish(false); };
        xhr.send();
    } catch (e2) { finish(false); }
}
function fetchChartForCurrentSong() {
    var folder = currentSongFolder();
    if (!folder) return;
    var f = normName(folder);
    if (chart.done && chart.notes.length && chartSongOf(chart.level) === f) return;
    for (var k in chartCache) if (chartSongOf(k) === f && activateChart(k) > 0) return;
    var urls = findChartUrls(folder);
    var i = 0;
    (function tryNext() {
        if (i >= urls.length) return;
        fetchChartDirect(urls[i++], function (ok) { if (!ok) tryNext(); });
    })();
}
function maybeActivateChart() {
    try {
        var ec = W.__fnfV1EngChart;
        if (ec && ec.obj && performance.now() - ec.t < 600000) {
            var folder = currentSongFolder();
            if (folder && (ec.name === normName(folder) || chartSongOf(ec.name) === normName(folder))) {
                if (!(chart.done && chart.level === ec.name)) activateChart(ec.name);
            }
        }
    } catch (e1) {}
    var now = performance.now();
    if (now - v1LastTry < 400) return;
    v1LastTry = now;
    var folder2 = currentSongFolder();
    if (!folder2) return;
    var f2 = normName(folder2);
    if (chart.done && chart.notes.length && chartSongOf(chart.level) === f2) return;
    for (var k in chartCache) if (chartSongOf(k) === f2 && activateChart(k) > 0) return;
    if (now - (v1ChartTries[folder2] || 0) < 3000) return;
    v1ChartTries[folder2] = now;
    fetchChartForCurrentSong();
}
var ALLOW_TYPES = { "": 1, "alt": 1, "a": 1, "normal": 1, "beat": 1, "accent": 1, "spawn": 1, "musthit": 1 };
var DANGER_KW = ["hurt", "kill", "death", "danger", "damage", "spike", "curse", "toxic", "void", "letter", "doom", "dead", "corrupt", "shadow", "warn", "your turn", "glitch", "poison", "veneno", "bomb", "bullet", "mina", "mine", "fire", "burn", "hazard"];
var poison = {}, suspect = [], deadlyTypes = {}, pressOk = {};
var poisonKey = "fnfBotV1Poison_" + location.hostname;
function savePoison() {
    try {
        localStorage.setItem(poisonKey, JSON.stringify({
            p: Object.keys(poison), s: suspect, lt: deadlyTypes, o: Object.keys(pressOk)
        }));
    } catch (e1) {}
}
function loadPoison() {
    try {
        var s = localStorage.getItem(poisonKey);
        if (!s) return;
        var o = JSON.parse(s);
        (o.p || []).forEach(function (k) { poison[k] = true; });
        suspect = (o.s || []).filter(function (x) { return x && typeof x.t === "number"; });
        (o.lt || []).forEach(function (k) { deadlyTypes[k] = true; });
        (o.o || []).forEach(function (k) { pressOk[k] = true; });
    } catch (e1) {}
}
loadPoison();
function pk(ty, di) { return (ty || "") + "#" + di; }
function isDangerType(t) {
    if (!t) return false;
    if (ALLOW_TYPES[String(t).toLowerCase()]) return false;
    var tl = String(t).toLowerCase();
    if (deadlyTypes[tl]) return true;
    for (var i = 0; i < DANGER_KW.length; i++) if (tl.indexOf(DANGER_KW[i]) >= 0) return true;
    return false;
}
function isPoison(t, di) { return !!(t && poison[pk(t, di)]); }
function isSuspect(tm, la) {
    for (var i = 0; i < suspect.length; i++) if (Math.abs(tm - suspect[i].t) < 300 && suspect[i].la === la) return true;
    return false;
}
function flagPoison(k, why) {
    if (poison[k]) return;
    poison[k] = true; savePoison();
    console.log("[FNF_Bot_V1] POISON " + k + " (" + why + ")");
    banner("EVITA: " + k + " (" + why + ")", 3000);
}
function commitSuspect(s) {
    if (!s || !s.t) return;
    if (s.ty) {
        var stl = String(s.ty).toLowerCase();
        if (stl && !ALLOW_TYPES[stl] && !deadlyTypes[stl]) { deadlyTypes[stl] = true; savePoison(); }
    }
    for (var i = 0; i < suspect.length; i++) {
        if (Math.abs(suspect[i].t - s.t) < 160 && suspect[i].la === s.la) return;
    }
    suspect.push({ t: Math.round(s.t), la: s.la });
    if (suspect.length > 6) suspect.shift();
    savePoison();
    console.log("[FNF_Bot_V1] LETALE L" + s.la + " @" + Math.round(s.t) + "ms");
    banner("LETALE L" + s.la + " @" + Math.round(s.t / 1000) + "s", 3000);
}
function learnFromDeath(winMs) {
    try {
        var evs = W.__fnfV1Ev || [], now = performance.now(), win = winMs || 1500;
        var lp = null, ld = null;
        for (var i = 0; i < evs.length; i++) {
            var e = evs[i];
            if (now - e.w > win) continue;
            if (e.act === "p") { if (!lp || e.w > lp.w) lp = e; }
            else if (e.act === "d" || ((e.act === "m" || e.act === "o") && e.pl === 1 && e.ty)) { if (!ld || e.w > ld.w) ld = e; }
        }
        function spec(ev) { if (!ev || !ev.ty) return false; return !ALLOW_TYPES[String(ev.ty).toLowerCase()]; }
        if (lp && spec(lp) && (!ld || lp.w >= ld.w)) {
            var kp = pk(String(lp.ty), lp.la);
            delete pressOk[kp];
            flagPoison(kp, "morte-premuta");
            return "press->dodge " + kp;
        }
        if (ld && spec(ld)) {
            var kd = pk(String(ld.ty), ld.la);
            pressOk[kd] = true;
            if (poison[kd]) delete poison[kd];
            suspect = suspect.filter(function (x) { return !(x.la === ld.la && Math.abs(x.t - ld.ms) < 400); });
            savePoison();
            console.log("[FNF_Bot_V1] MORTE dopo SCHIVATA " + kd + " -> da ora PREMO");
            return "dodge->press " + kd;
        }
    } catch (e1) {}
    return null;
}
function evPush(act, la, ty, ms, pl) {
    try {
        if (!W.__fnfV1Ev) W.__fnfV1Ev = [];
        W.__fnfV1Ev.push({ ms: ms, act: act, la: la, ty: ty || "", pl: pl ? 1 : 0, w: performance.now() });
        if (W.__fnfV1Ev.length > 40) W.__fnfV1Ev.shift();
    } catch (e1) {}
}
function dangerCheck(ty, data, timeMs) {
    if (isPoison(ty, data)) return true;
    if (isSuspect(timeMs, data)) return true;
    if (deadlyTypes[String(ty || "").toLowerCase()]) return true;
    if (isDangerType(ty)) return true;
    if (pressOk[pk(ty, data)]) return false;
    return false;
}
var hp = { val: -1, found: false, _ts: -5000, prev: NaN, dead: false };
var hpSamp = { cv: null, cx: null };
function hpSample() {
    try {
        var gc = null, cs = D.querySelectorAll("canvas");
        for (var i = 0; i < cs.length; i++) if (cs[i].width > 100 && cs[i].height > 100) { gc = cs[i]; break; }
        if (!gc) return;
        if (!hpSamp.cv) { hpSamp.cv = document.createElement("canvas"); hpSamp.cv.width = 360; hpSamp.cv.height = 10; hpSamp.cx = hpSamp.cv.getContext("2d", { willReadFrequently: true }); }
        var oct = hpSamp.cx, sW = 360, sH = 10;
        oct.drawImage(gc, 0, Math.max(0, Math.floor(gc.height * 0.86)), gc.width, Math.max(1, Math.floor(gc.height * 0.10)), 0, 0, sW, sH);
        var img = oct.getImageData(0, 0, sW, sH).data;
        var best = null;
        for (var y = 1; y < sH - 1; y++) {
            var row = y * sW * 4, minX = -1, maxX = -1, bright = 0;
            for (var x = 0; x < sW; x++) {
                var i4 = row + x * 4, r = img[i4], g = img[i4 + 1], b = img[i4 + 2], a = img[i4 + 3];
                var lum = r * 0.299 + g * 0.587 + b * 0.114;
                if (a > 40 && lum > 35) { if (minX < 0) minX = x; maxX = x; bright++; }
            }
            var barW = minX >= 0 ? maxX - minX + 1 : 0;
            if (barW < 60 || barW < sW * 0.18) continue;
            var fill = bright / barW;
            if (fill < 0.55) continue;
            var bestDiff = 0, bestX = -1;
            for (var x2 = minX + 4; x2 <= maxX - 4; x2++) {
                var lR = 0, lG = 0, lB = 0, rR = 0, rG = 0, rB = 0, ln = 0, rn = 0;
                for (var xx = Math.max(minX, x2 - 10); xx < x2; xx++) { var j = row + xx * 4; lR += img[j]; lG += img[j + 1]; lB += img[j + 2]; ln++; }
                for (var xx2 = x2; xx2 <= Math.min(maxX, x2 + 10); xx2++) { var j2 = row + xx2 * 4; rR += img[j2]; rG += img[j2 + 1]; rB += img[j2 + 2]; rn++; }
                if (!ln || !rn) continue;
                lR /= ln; lG /= ln; lB /= ln; rR /= rn; rG /= rn; rB /= rn;
                var diff = Math.abs(lR - rR) + Math.abs(lG - rG) + Math.abs(lB - rB);
                if (diff > bestDiff) { bestDiff = diff; bestX = x2; }
            }
            if (bestX < 0) continue;
            var ratio = (bestX - minX) / barW;
            var conf = Math.min(1, (bestDiff / 120) * fill);
            if (!best || conf > best.conf) best = { val: Math.max(0, Math.min(1, ratio)), conf: conf };
        }
        if (best && best.conf >= 0.18) { hp.val = best.val; hp.found = true; }
        else hp.found = false;
    } catch (e1) { hp.found = false; }
}
var hpLastSamp = 0;
function hpWatchTick() {
    if (!cfg.hpWatch) return;
    var now = performance.now();
    if (now - hpLastSamp >= 420) { hpLastSamp = now; hpSample(); }
    var h = hp.val;
    if (h < 0 || !hp.found) return;
    var prev = hp.prev;
    hp.prev = h;
    if (h <= 0.003 && !hp.dead) {
        if (!(prev === prev && !((prev - h >= 0.3) || prev <= 0.05))) { hp.dead = true; return; }
        hp.dead = true;
        if (cfg.learnFromDeath) {
            try { learnFromDeath(1600); } catch (e1) {}
        }
        setTimeout(function () { hp.dead = false; }, 1200);
    }
    if (h > 0.05) hp.dead = false;
}
var engine = { inst: null, cls: null, cond: null, errs: 0, tries: 0, lastScan: 0 };
W.__fnfEngine = engine;
function looksLikeInstance(o) {
    try { return !!o && typeof o === "object" && typeof o.goodNoteHit === "function" && !!o.notes; }
    catch (e1) { return false; }
}
function adoptEngine(o, path) {
    if (!looksLikeInstance(o)) return false;
    engine.inst = o;
    try { engine.cls = (o.constructor && typeof o.constructor === "object") ? o.constructor : null; } catch (e1) { engine.cls = null; }
    try { if (o.conductor && typeof o.conductor === "object") engine.cond = o.conductor; } catch (e2) {}
    try {
        var cnames = ["Conductor", "funkin_Conductor"];
        for (var i = 0; i < cnames.length; i++) {
            var cv = W[cnames[i]];
            if (cv && typeof cv === "object" && typeof cv.songPosition === "number") { engine.cond = cv; break; }
            if (cv && typeof cv === "function" && typeof cv.songPosition === "number") { engine.cond = cv; break; }
        }
    } catch (e3) {}
    console.log("[FNF_Bot_V1] ENGINE DIRECT agganciato via " + path + " (Conductor: " + (engine.cond ? "si" : "no") + ")");
    banner("Modalita': DIRECT (engine)", 3000);
    return true;
}
function engineScan() {
    if (engine.inst) return true;
    var now = performance.now();
    if (now - engine.lastScan < 2000) return false;
    engine.lastScan = now;
    engine.tries++;
    var names = ["PlayState", "funkin_PlayState", "playState", "__playState", "game", "__game", "state", "__state", "FlxG"];
    try {
        for (var i = 0; i < names.length; i++) {
            var v = W[names[i]];
            if (!v) continue;
            if (looksLikeInstance(v)) { if (adoptEngine(v, "window." + names[i])) return true; }
            var cand = ["instance", "state", "__state", "_state"];
            for (var c = 0; c < cand.length; c++) {
                try { if (looksLikeInstance(v[cand[c]])) { if (adoptEngine(v[cand[c]], "window." + names[i] + "." + cand[c])) return true; } } catch (e1) {}
            }
        }
    } catch (e2) {}
    try {
        var seen = new Set();
        var gnames = Object.getOwnPropertyNames(W);
        for (var g = 0; g < gnames.length && gnames.length < 3000; g++) {
            var val;
            try { val = W[gnames[g]]; } catch (e3) { continue; }
            if (!val || (typeof val !== "object" && typeof val !== "function")) continue;
            if (seen.has(val)) continue;
            seen.add(val);
            if (looksLikeInstance(val)) { if (adoptEngine(val, "window." + gnames[g])) return true; }
            var sub;
            try { sub = Object.getOwnPropertyNames(val).slice(0, 60); } catch (e4) { continue; }
            for (var s = 0; s < sub.length; s++) {
                var sv;
                try { sv = val[sub[s]]; } catch (e5) { continue; }
                if (!sv || (typeof sv !== "object" && typeof sv !== "function")) continue;
                if (seen.has(sv)) continue;
                seen.add(sv);
                if (looksLikeInstance(sv)) { if (adoptEngine(sv, "window." + gnames[g] + "." + sub[s])) return true; }
            }
        }
    } catch (e6) {}
    if (engine.tries % 15 === 0) console.log("[FNF_Bot_V1] engine direct non esposto (build minificata) -> synth");
    return false;
}
function laneOf(n) {
    try { return Math.abs(n.noteData | 0) % (chart.ring ? 5 : 4); } catch (e1) { return 0; }
}
function directDanger(n) {
    try {
        if (n.hitCausesMiss || n.ignoreNote) return true;
        return dangerCheck(n.noteType || "", laneOf(n), typeof n.strumTime === "number" ? n.strumTime : 0);
    } catch (e1) { return false; }
}
function hitDirect(n, t) {
    var st = engine.inst;
    try {
        st.goodNoteHit(n);
        stats.hits++; stats.played++;
        evPush("p", laneOf(n), n.noteType || "", typeof n.strumTime === "number" ? n.strumTime : t, 1);
        return true;
    } catch (e1) {
        engine.errs++;
        console.warn("[FNF_Bot_V1] goodNoteHit errore (" + engine.errs + "): " + e1.message);
        if (engine.errs >= 6) {
            engine.inst = null;
            console.warn("[FNF_Bot_V1] direct disattivato -> fallback synth");
            banner("Direct non disponibile -> synth", 3000);
        }
        return false;
    }
}
function directStep(t) {
    var st = engine.inst;
    if (!st) return false;
    var notes = st.notes;
    if (!notes) return false;
    function proc(n) {
        if (!n || n.mustPress === false) return;
        if (!n.mustPress || n.wasGoodHit) return;
        if (n.isSustainNote) {
            if (n.canBeHit && !n.tooLate && !directDanger(n)) hitDirect(n, t);
            return;
        }
        if (n.tooLate) return;
        if (directDanger(n)) {
            if (!n.__fnfDodged) {
                n.__fnfDodged = true;
                stats.dodged++;
                evPush("d", laneOf(n), n.noteType || "", typeof n.strumTime === "number" ? n.strumTime : t, 1);
            }
            return;
        }
        if (typeof n.strumTime === "number" && n.canBeHit && n.strumTime <= t + cfg.calibMs) hitDirect(n, t);
    }
    try {
        if (typeof notes.forEachAlive === "function") { notes.forEachAlive(proc); return true; }
        var members = notes.members || [];
        for (var i = 0; i < members.length; i++) proc(members[i]);
        return true;
    } catch (e1) { engine.errs++; return false; }
}
function holdExtraMs() {
    if (chart.bpm > 0) {
        var step = 60000 / (chart.bpm * 4);
        return Math.round(step / (chart.speed || 1) + 60);
    }
    return cfg.holdReleaseExtraMs;
}
function pressNote(dir, atMs, len, tNext, g) {
    if (!cfg.on || g !== gen) return;
    if (keyActive.length <= dir) ringReset();
    var keep;
    if (len > 0) {
        var base = len + holdExtraMs();
        var minKeep = len + Math.max(12, holdExtraMs() - 52);
        var capKeep = (tNext != null) ? Math.max(0, tNext - atMs - cfg.gapMs) : base;
        if (capKeep < len) keep = len;
        else keep = (capKeep < minKeep) ? Math.min(base, minKeep) : Math.min(base, capKeep);
    } else {
        var capK = (tNext != null) ? Math.max(0, tNext - atMs - cfg.gapMs) : cfg.keyHoldMs;
        keep = (capK < 8) ? Math.max(0, capK) : Math.min(cfg.keyHoldMs, capK);
    }
    var pressed = false, token = 0, keepUntil = atMs + keep;
    if (tNext != null) {
        var capRel = tNext - 34;
        if (capRel < atMs + 6) capRel = atMs + 6;
        if (capRel < keepUntil) keepUntil = capRel;
    }
    function schedule(delay) {
        if (cfg.autoSync) setTimeout(tick, Math.max(0, delay));
        else requestAnimationFrame(tick);
    }
    function tick() {
        if (!cfg.on || g !== gen) return;
        if (pressed && token !== keyToken[dir]) return;
        var t = nowMs();
        if (t == null) { schedule(8); return; }
        if (!pressed) {
            var th = atMs + cfg.calibMs;
            if (t >= th) {
                pressed = true;
                if (keyActive[dir] > 0) fireKey(dir, false);
                token = ++keyToken[dir];
                fireKey(dir, true);
                keyActive[dir] = 1;
                schedule(1);
                return;
            }
            var wait = th - t;
            schedule(wait > 4 ? Math.max(1, Math.floor(wait - 2)) : 1);
            return;
        }
        if (t >= keepUntil) {
            if (token === keyToken[dir]) {
                keyActive[dir] = 0;
                fireKey(dir, false);
                keyToken[dir]++;
            }
            return;
        }
        var rem = keepUntil - t;
        schedule(rem > 4 ? Math.max(1, Math.floor(rem - 2)) : 1);
    }
    schedule(1);
}
function synthStep() {
    if (!chart.done || !chart.notes.length) return;
    var t = nowMs();
    if (t == null) { if (lastT != null && lastT >= 0) t = lastT; else return; }
    if (t == null) return;
    for (var i = 0; i < chart.notes.length; i++) {
        var n = chart.notes[i];
        if (n.done) continue;
        var remaining = n.time - t;
        if (remaining < -cfg.hitWindowMs) {
            n.done = true;
            stats.played++;
            if (n.player && !n.danger) { stats.misses++; evPush("m", n.data, n.type, t, 1); }
            else { stats.dodged++; evPush("o", n.data, n.type, t, n.player ? 1 : 0); }
            continue;
        }
        if (remaining <= cfg.advanceMs + 40) {
            n.done = true;
            stats.played++;
            if (!n.player) { stats.dodged++; evPush("o", n.data, n.type, t, 0); continue; }
            if (n.danger || dangerCheck(n.type, n.data, n.time)) {
                stats.dodged++;
                evPush("d", n.data, n.type, t, 1);
                console.log("[FNF_Bot_V1] EVITO L" + n.data + " @" + Math.round(n.time) + "ms" + (n.type ? " tipo=" + n.type : ""));
                continue;
            }
            if (Math.random() < cfg.missChance) { stats.misses++; evPush("m", n.data, n.type, t, 1); continue; }
            stats.hits++;
            evPush("p", n.data, n.type, t, 1);
            var tNext = null;
            for (var jj = i + 1; jj < chart.notes.length; jj++) {
                var nn = chart.notes[jj];
                if (!nn.done && nn.data === n.data && nn.player === n.player && nn.time > n.time) { tNext = nn.time; break; }
            }
            pressNote(n.data, n.time, n.length, tNext, gen);
        }
    }
}
var lastT = -1, lastLoopWall = 0, frameMs = 16.7;
function resync(t) {
    gen++;
    releaseAllKeys();
    ringReset();
    pendingPresses = [];
    if (chart.notes.length) {
        for (var i = 0; i < chart.notes.length; i++) {
            chart.notes[i].done = (chart.notes[i].time < t - (cfg.hitWindowMs + 80));
        }
    }
}
function loop() {
    var wall = performance.now();
    if (lastLoopWall) {
        var d = wall - lastLoopWall;
        if (d >= 5 && d <= 60) frameMs = frameMs * 0.85 + d * 0.15;
    }
    lastLoopWall = wall;
    if (cfg.on) {
        try {
            installAudioHooks();
            var t = nowMs();
            if (t != null) {
                if (lastT > 1500 && t < lastT - 5000) {
                    if (t < 3000) {
                        gen++;
                        if (chart.notes.length) for (var i = 0; i < chart.notes.length; i++) chart.notes[i].done = false;
                        releaseAllKeys(); ringReset(); pendingPresses = [];
                        console.log("[FNF_Bot_V1] restart rilevato");
                        if (cfg.learnFromDeath && wall > 4000) { try { learnFromDeath(4000); } catch (e1) {} }
                    } else {
                        resync(t);
                        console.log("[FNF_Bot_V1] seek-back resync @" + Math.round(t));
                    }
                } else if (lastT > 0 && t - lastT > 5000) {
                    resync(t);
                    console.log("[FNF_Bot_V1] seek-fwd resync @" + Math.round(t));
                }
                lastT = t;
            }
            try { maybeActivateChart(); } catch (e2) {}
            if (cfg.mode !== "SYNTH") engineScan();
            var directOk = false;
            if (engine.inst && cfg.mode !== "SYNTH" && engine.errs < 6) {
                directOk = directStep(t != null ? t : lastT);
            }
            if (!directOk) synthStep();
            hpWatchTick();
            uiTick();
        } catch (e9) {
            console.warn("[FNF_Bot_V1] loop: " + e9.message);
        }
    }
    requestAnimationFrame(loop);
}
var css = "" +
"#fnfbotv1-badge{position:fixed;top:12px;right:14px;z-index:2147483646;padding:8px 13px;border-radius:999px;background:rgba(12,16,28,.86);border:1px solid rgba(105,239,183,.55);color:#eafcf6;font:600 12px/1.2 system-ui,Segoe UI,sans-serif;letter-spacing:.2px;box-shadow:0 8px 30px rgba(0,0,0,.25);backdrop-filter:blur(12px);pointer-events:none;white-space:nowrap;transition:border-color .3s}" +
"#fnfbotv1-badge.off{border-color:rgba(224,85,85,.6)}" +
"#fnfbotv1-badge.wait{border-color:rgba(230,194,41,.6)}" +
"#fnfbotv1-credit{position:fixed;left:8px;bottom:6px;z-index:2147483645;color:rgba(234,252,246,.45);font:600 10px/1.2 system-ui,Segoe UI,sans-serif;letter-spacing:.3px;text-shadow:0 1px 3px rgba(0,0,0,.6);pointer-events:auto;cursor:pointer;user-select:none}" +
"#fnfbotv1-toast{position:fixed;top:52px;right:14px;z-index:2147483647;max-width:340px;padding:9px 14px;border-radius:10px;background:rgba(8,12,22,.94);border:1px solid rgba(105,239,183,.45);color:#c9ffe8;font:700 12px/1.35 ui-monospace,Consolas,monospace;pointer-events:none;text-align:right}";
function uiInit() {
    try {
        var st = document.createElement("style");
        st.textContent = css;
        (document.head || document.documentElement).appendChild(st);
        var badge = document.createElement("div");
        badge.id = "fnfbotv1-badge";
        badge.textContent = "FNF_Bot_V1 · ATTIVO";
        var credit = document.createElement("div");
        credit.id = "fnfbotv1-credit";
        credit.textContent = "FNF_Bot_V1 · " + CREDIT;
        credit.title = "Canale YouTube di " + CREDIT;
        credit.addEventListener("click", function () {
            try { window.open(CREDIT_URL, "_blank", "noopener"); } catch (e1) {}
        });
        (document.body || document.documentElement).appendChild(badge);
        (document.body || document.documentElement).appendChild(credit);
        W.__fnfV1Els = { badge: badge, credit: credit, toast: null };
    } catch (e1) {}
}
function banner(txt, ms) {
    try {
        if (cfg.uiHidden) return;
        var els = W.__fnfV1Els;
        if (!els) return;
        if (!els.toast) {
            var t = document.createElement("div");
            t.id = "fnfbotv1-toast";
            (document.body || document.documentElement).appendChild(t);
            els.toast = t;
        }
        els.toast.textContent = txt;
        els.toast.style.display = "block";
        if (els.toast._timer) clearTimeout(els.toast._timer);
        els.toast._timer = setTimeout(function () {
            try { if (els.toast) els.toast.style.display = "none"; } catch (e1) {}
        }, ms || 4000);
    } catch (e1) {}
}
var lastUiTick = 0;
function uiTick() {
    var now = performance.now();
    if (now - lastUiTick < 400) return;
    lastUiTick = now;
    try {
        var els = W.__fnfV1Els;
        if (!els || !els.badge) return;
        if (cfg.uiHidden) { els.badge.style.display = "none"; els.credit.style.display = "none"; if (els.toast) els.toast.style.display = "none"; return; }
        els.badge.style.display = "";
        els.credit.style.display = "";
        var t = nowMs();
        var mode = engine.inst && engine.errs < 6 ? "DIRECT" : "SYNTH";
        var txt = "FNF_Bot_V1 · " + (cfg.on ? "ATTIVO" : "PAUSA") + " · " + mode;
        if (t != null && t >= 0) txt += " · " + Math.round(t / 1000) + "s";
        if (chart.done) txt += " · " + chart.notes.length + " note";
        txt += " · A:" + stats.hits + " X:" + stats.misses;
        els.badge.textContent = txt;
        els.badge.className = cfg.on ? (chart.done ? "" : "wait") : "off";
    } catch (e1) {}
}
function setUIHidden(h) {
    cfg.uiHidden = !!h;
    if (!cfg.uiHidden) banner("UI visibile · F1 per nascondere", 2500);
}
function toggle() {
    cfg.on = !cfg.on;
    if (!cfg.on) { releaseAllKeys(); }
    banner(cfg.on ? "FNF_Bot_V1 · ATTIVO" : "FNF_Bot_V1 · IN PAUSA", 2000);
    uiTick();
}
W.addEventListener("keydown", function (e) {
    try {
        if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && (e.key === "p" || e.key === "P")) {
            e.preventDefault();
            e.stopImmediatePropagation();
            toggle();
            return;
        }
        if (e.key === "F1" || e.keyCode === 112) {
            e.preventDefault();
            e.stopImmediatePropagation();
            setUIHidden(!cfg.uiHidden);
            return;
        }
    } catch (e1) {}
}, true);
D.addEventListener("visibilitychange", function () { if (D.hidden) releaseAllKeys(); });
W.addEventListener("blur", function () { releaseAllKeys(); });
W.__fnfBotV1 = {
    version: VER,
    credit: CREDIT,
    cfg: cfg,
    stats: stats,
    chart: chart,
    engine: engine,
    toggle: toggle,
    hideUI: function () { setUIHidden(true); },
    showUI: function () { setUIHidden(false); },
    st: function () {
        return {
            on: cfg.on,
            mode: engine.inst && engine.errs < 6 ? "DIRECT" : "SYNTH",
            time: nowMs(),
            chartNotes: chart.done ? chart.notes.length : 0,
            chartLevel: chart.level,
            song: currentSongFolder(),
            hits: stats.hits, misses: stats.misses, dodged: stats.dodged,
            engine: !!engine.inst,
            hp: hp.val
        };
    },
    reloadChart: function () { fetchChartForCurrentSong(); },
    diagnose: function () {
        var info = JSON.stringify(W.__fnfBotV1.st());
        console.log("[FNF_Bot_V1] " + info);
        banner(info, 6000);
        return info;
    }
};
installChartHooks();
installAudioHooks();
uiInit();
banner("FNF_Bot_V1 installato · CTRL+P attiva/disattiva · F1 nascondi UI", 5000);
console.log("[FNF_Bot_V1] avviato (" + CREDIT + "). CTRL+P = on/off, F1 = UI, window.__fnfBotV1.st() = stato.");
requestAnimationFrame(loop);
setTimeout(function () { fetchChartForCurrentSong(); }, 800);
engineScan();
})();