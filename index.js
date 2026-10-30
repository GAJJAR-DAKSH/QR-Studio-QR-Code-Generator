const $ = id => document.getElementById(id);
const root = document.documentElement;
const img = $("qrimg"), stage = $("stage"), loader = $("loader"), statusEl = $("status"),
      ph = $("placeholder"), historyList = $("historyList");
const actionBtns = ["dlPng", "dlSvg", "copyImg", "shareBtn"].map($);
const PALETTES = [["#4f46e5", "#ffffff"], ["#111827", "#ffffff"], ["#059669", "#ecfdf5"], ["#e11d48", "#fff1f2"],
                  ["#ea580c", "#fff7ed"], ["#ffffff", "#4f46e5"], ["#f9fafb", "#111827"]];
let mode = "text", token = 0, timer, currentData = "", qrHistory = [];
try { qrHistory = JSON.parse(localStorage.getItem("qrHistory2")) || []; } catch (e) {}

/* Theme */
root.dataset.theme = localStorage.getItem("qrTheme") || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
$("themeBtn").onclick = () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("qrTheme", root.dataset.theme);
};

/* Toast */
let tt;
function toast(m) { const t = $("toast"); t.textContent = m; t.classList.add("show"); clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 2200); }

/* Swatches */
PALETTES.forEach(([fg, bg]) => {
    const s = document.createElement("div");
    s.className = "sw"; s.title = fg + " on " + bg;
    s.style.background = `linear-gradient(135deg, ${fg} 50%, ${bg} 50%)`;
    s.onclick = () => { $("fgColor").value = fg; $("bgColor").value = bg; markSwatch(); schedule(0); };
    $("swatches").appendChild(s);
});
function markSwatch() {
    [...$("swatches").children].forEach((s, i) =>
        s.classList.toggle("on", PALETTES[i][0] === $("fgColor").value && PALETTES[i][1] === $("bgColor").value));
}

/* Build payload for each mode */
const esc = s => s.replace(/([\\;,:"])/g, "\\$1");
function buildData() {
    if (mode === "text") return $("qrText").value.trim();
    if (mode === "wifi") {
        const ssid = $("wSsid").value.trim(); if (!ssid) return "";
        const sec = $("wSec").value;
        return `WIFI:T:${sec};S:${esc(ssid)};${sec === "nopass" ? "" : "P:" + esc($("wPass").value) + ";"};`;
    }
    if (mode === "email") {
        const to = $("eTo").value.trim(); if (!to) return "";
        const q = new URLSearchParams();
        if ($("eSub").value) q.set("subject", $("eSub").value);
        if ($("eBody").value) q.set("body", $("eBody").value);
        const qs = q.toString().replace(/\+/g, "%20");
        return "mailto:" + to + (qs ? "?" + qs : "");
    }
    const n = $("pNum").value.replace(/[^\d+]/g, ""); return n ? "tel:" + n : "";
}
const KIND = { text: "🔗", wifi: "📶", email: "✉️", phone: "📞" };

function qrURL(format = "png", size = $("qrSize").value) {
    return `https://api.qrserver.com/v1/create-qr-code/?format=${format}&size=${size}x${size}&margin=${$("margin").value}` +
           `&ecc=${$("ecc").value}&color=${$("fgColor").value.slice(1)}&bgcolor=${$("bgColor").value.slice(1)}` +
           `&data=${encodeURIComponent(currentData)}`;
}

/* Live render (debounced, race-safe) */
function schedule(delay = 450) { clearTimeout(timer); timer = setTimeout(render, delay); }
function setReady(on) {
    actionBtns.forEach(b => b.disabled = !on);
    stage.classList.toggle("ready", on);
}
function render() {
    markSwatch();
    currentData = buildData();
    $("count").textContent = $("qrText").value.length;
    if (!currentData) {
        img.classList.add("hidden"); ph.classList.remove("hidden"); loader.style.display = "none";
        setReady(false); statusEl.textContent = "Start typing, it updates live"; return;
    }
    const my = ++token;
    loader.style.display = "block"; setReady(false); statusEl.textContent = "Generating…";
    const probe = new Image();
    probe.onload = () => {
        if (my !== token) return;
        img.src = probe.src; img.classList.remove("hidden"); ph.classList.add("hidden");
        loader.style.display = "none"; setReady(true);
        statusEl.textContent = `Ready · ${currentData.length} characters`;
        clearTimeout(saveT); saveT = setTimeout(() => saveHistory(currentData, mode), 1500);
    };
    probe.onerror = () => { if (my !== token) return; loader.style.display = "none"; statusEl.textContent = "⚠️ Couldn't generate. Check your connection or shorten the content."; };
    probe.src = qrURL("png", 300);
}
let saveT;

/* Export */
async function getBlob(format, size) { return (await fetch(qrURL(format, size))).blob(); }
function saveBlob(blob, name) {
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
$("dlPng").onclick = async () => { try { saveBlob(await getBlob("png"), "qr-code.png"); toast("⬇ PNG downloaded"); } catch { window.open(qrURL("png"), "_blank"); } };
$("dlSvg").onclick = async () => { try { saveBlob(await getBlob("svg", 512), "qr-code.svg"); toast("⬇ SVG downloaded"); } catch { window.open(qrURL("svg"), "_blank"); } };
$("copyImg").onclick = async () => {
    try { await navigator.clipboard.write([new ClipboardItem({ "image/png": getBlob("png", 512) })]); toast("📋 Image copied"); }
    catch { try { await navigator.clipboard.writeText(currentData); toast("📋 Copied content (image copy unsupported)"); } catch { toast("⚠️ Copy failed"); } }
};
$("shareBtn").onclick = async () => {
    try {
        const file = new File([await getBlob("png", 512)], "qr-code.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) await navigator.share({ files: [file], title: "QR Code" });
        else if (navigator.share) await navigator.share({ title: "QR Code", text: currentData });
        else { await navigator.clipboard.writeText(qrURL("png")); toast("🔗 Image link copied"); }
    } catch (e) { if (e.name !== "AbortError") toast("⚠️ Share failed"); }
};

/* History */
function saveHistory(data, kind) {
    qrHistory = [{ data, kind }, ...qrHistory.filter(h => h.data !== data)].slice(0, 8);
    localStorage.setItem("qrHistory2", JSON.stringify(qrHistory)); renderHistory();
}
function renderHistory() {
    historyList.innerHTML = "";
    if (!qrHistory.length) { historyList.innerHTML = '<li class="empty">Nothing yet</li>'; return; }
    qrHistory.forEach(h => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="k">${KIND[h.kind] || "🔗"}</span><span class="t"></span>`;
        li.querySelector(".t").textContent = h.data;
        li.onclick = () => { setMode("text"); $("qrText").value = h.data; render(); };
        historyList.appendChild(li);
    });
}
$("clearHistory").onclick = () => { qrHistory = []; localStorage.removeItem("qrHistory2"); renderHistory(); };

/* Tabs */
function setMode(m) {
    mode = m;
    document.querySelectorAll(".tab").forEach(t => t.classList.toggle("active", t.dataset.mode === m));
    document.querySelectorAll(".form").forEach(f => f.classList.toggle("hidden", f.dataset.form !== m));
    render();
}
$("tabs").addEventListener("click", e => { const t = e.target.closest(".tab"); if (t) setMode(t.dataset.mode); });

/* Wire up inputs */
document.querySelectorAll("input, textarea, select").forEach(el => {
    el.addEventListener("input", () => schedule(el.type === "color" || el.type === "range" || el.tagName === "SELECT" ? 150 : 450));
});
$("qrText").addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); render(); } });

renderHistory(); markSwatch();