// tests/ak-harness.mjs
//
// Prueft die Fachlogik des Prototyps gegen die Akzeptanzkriterien der
// User Stories US-001 bis US-010 aus htw-agentic-engineering/seminar-enrollment.
//
// Kein Framework, keine Abhaengigkeiten. Das Markup wird mit einem minimalen
// DOM-Stub geladen, damit die Skriptbloecke aus den HTML-Dateien ohne Browser
// ausgefuehrt werden koennen.
//
// Start:  node tests/ak-harness.mjs
// Exit 0 = alle Pruefungen gruen.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Relativ zum Skript aufloesen, damit der Lauf unabhaengig vom
// Arbeitsverzeichnis und von der Maschine funktioniert.
const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'prototyp') + path.sep;
const mem={};
globalThis.localStorage={getItem:k=>(k in mem?mem[k]:null),setItem:(k,v)=>{mem[k]=String(v);},removeItem:k=>{delete mem[k];}};
const mk=()=>({innerHTML:'',textContent:'',className:'',style:{},value:'',disabled:false,
  classList:{_s:new Set(),add(...c){c.forEach(x=>this._s.add(x));},remove(...c){c.forEach(x=>this._s.delete(x));},
  toggle(c,f){f?this._s.add(c):this._s.delete(c);},contains(c){return this._s.has(c);}},
  appendChild(){}, });
const nodes={}; const el=id=>document.getElementById(id);
globalThis.document={getElementById:id=>(nodes[id]??=mk()),createElement:()=>mk()};
globalThis.location={search:''};
let logs=[];
globalThis.alert=m=>{logs.push('ALERT: '+String(m).split('\n')[0]);};
globalThis.confirm=()=>true;
globalThis.setTimeout=()=>0; globalThis.clearTimeout=()=>{};
globalThis.window={innerWidth:1400,addEventListener(){}};
globalThis.URLSearchParams=URLSearchParams;

const js=f=>[...fs.readFileSync(ROOT+f,'utf8').matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');

const stud=new Function(js('index.html')+`
  return { store, saveStore, statusOf, handleSubmit, renderStatus, editBewerbung, assign,
           byRank, state, MODULE, buildList, openPdf,
           setUser:u=>{currentUser=u;}, getUser:()=>currentUser };`)();

let pass=0,fail=0;
const ok=(c,m)=>{c?(pass++,console.log('  OK   '+m)):(fail++,console.log('  FAIL '+m));};

const studSrc = js('index.html');
const admSrc  = js('admin.html');



console.log('\n── Student: Statuslogik (US-007) ──');
ok(stud.statusOf({bewerbung:null,zuordnungen:{},veroeffentlicht:false})===null,'ohne Bewerbung kein Status');
ok(stud.statusOf({bewerbung:{sNr:'S1'},zuordnungen:{},veroeffentlicht:false})==='eingereicht','frisch -> eingereicht');
ok(stud.statusOf({bewerbung:{sNr:'S1'},zuordnungen:{S1:'web'},veroeffentlicht:false})==='bearbeitung','Zuordnung ohne Veroeffentlichung -> in Bearbeitung');
ok(stud.statusOf({bewerbung:{sNr:'S1'},zuordnungen:{S1:'web'},veroeffentlicht:true})==='zugeteilt','veroeffentlicht -> zugeteilt');
ok(stud.statusOf({bewerbung:{sNr:'S1'},zuordnungen:{},veroeffentlicht:true})==='eingereicht','veroeffentlicht ohne Zuordnung bleibt eingereicht');

console.log('\n── Student: Einreichen (US-006 AK7/AK8) ──');
stud.buildList();
stud.setUser('S88618');
stud.assign('web',1); stud.assign('ml-ki',2); stud.assign('entre',3);
el('motivText').value='Ich habe bereits ein Projekt auf AWS realisiert.';
ok(stud.byRank(1)==='web' && stud.byRank(2)==='ml-ki' && stud.byRank(3)==='entre','drei Wuensche gesetzt');
stud.handleSubmit();
let b=stud.store().bewerbung;
ok(!!b,'Bewerbung wurde gespeichert');
ok(b.sNr==='S88618','der s-Nummer zugeordnet (AK8)');
ok(b.wuensche[1]==='web'&&b.wuensche[2]==='ml-ki'&&b.wuensche[3]==='entre','alle drei Wuensche gespeichert (AK1)');
ok(b.motivation.startsWith('Ich habe bereits'),'Motivationsschreiben zugeordnet (AK2)');
ok(!!Date.parse(b.eingereichtAm),'Einreichzeitpunkt gesetzt');

console.log('\n── Doppelauswahl-Schutz (US-004 AK4) ──');
stud.assign('db',1);
ok(stud.byRank(1)==='db','Platz 1 wechselt auf db');
ok(stud.state['web']===null,'vorheriger Platz-1-Halter wird freigeraeumt');
ok(new Set([1,2,3].map(stud.byRank).filter(Boolean)).size===3,'kein Seminar auf zwei Plaetzen');

console.log('\n── Umsortieren (US-004 AK3, gestern behobener Defekt) ──');
stud.assign('ml-ki',1);
ok(stud.byRank(1)==='ml-ki','Platz 1 direkt verschiebbar ohne vorheriges Abwaehlen');
ok(stud.byRank(2)===null,'alter Platz 2 des Seminars ist frei');

console.log('\n── Uebergabe Student -> Verwaltung ──');
// Bewerbung aus dem ersten Submit wiederherstellen
stud.setUser('S88618');
stud.assign('web',1);stud.assign('ml-ki',2);stud.assign('entre',3);
el('motivText').value='Ich habe bereits ein Projekt auf AWS realisiert.';
stud.handleSubmit();
const admin=new Function(js('admin.html')+`
  return { roster, store, changeZuordnung, handleVeroeffentlichen, belegung };`)();
let r=admin.roster();
const eigene=r.find(x=>x.sNr==='S88618');
ok(!!eigene,'eingereichte Bewerbung erscheint in der Verwaltung');
ok(eigene.quelle==='neu','wird als neu eingegangen markiert');
ok(eigene.w[0]==='web','Erstwunsch korrekt uebernommen');
ok(eigene.motiv.startsWith('Ich habe bereits'),'Motivationsschreiben einsehbar (US-009 AK3)');
ok(r.length===22,'ersetzt den gleichnamigen Demo-Datensatz statt zu duplizieren');

console.log('\n── Verwaltung ordnet zu -> Student sieht nichts (US-010 AK7) ──');
admin.changeZuordnung('S88618','ml-ki',null);
ok(stud.statusOf(stud.store())==='bearbeitung','Status wechselt auf in Bearbeitung');
ok(stud.store().veroeffentlicht===false,'Ergebnis noch nicht veroeffentlicht');

console.log('\n── Verwaltung veroeffentlicht -> Student sieht Zuteilung ──');
admin.handleVeroeffentlichen();
ok(stud.statusOf(stud.store())==='zugeteilt','Status wechselt auf zugeteilt');
stud.renderStatus();
ok(el('statusResult').className==='result-box','Ergebniskasten wird eingeblendet');
ok(el('statusResult').innerHTML.includes('Machine Learning'),'zugeteiltes Seminar wird genannt');
ok(el('statusResult').innerHTML.includes('Zweitwunsch'),'erfuellter Rang wird benannt');
ok(el('statusBadgeText').textContent==='Zugeteilt','Status-Badge korrekt');
ok(el('statusList').innerHTML.includes('Cloud-native'),'alle drei Wuensche werden angezeigt (AK3)');
ok(el('statusMotivText').textContent.startsWith('Ich habe bereits'),'Motivationsschreiben einsehbar (AK4)');
ok(el('statusEditBtn').classList.contains('hide'),'nach Veroeffentlichung keine Bearbeitung mehr');

console.log('\n── Ergebnis bleibt vor Veroeffentlichung verborgen ──');
const s2=stud.store(); s2.veroeffentlicht=false; stud.saveStore(s2);
stud.renderStatus();
ok(el('statusResult').className==='hide','Ergebniskasten ausgeblendet');
ok(el('statusResult').innerHTML==='','kein Ergebnis im DOM');
ok(!el('statusEditBtn').classList.contains('hide'),'Bearbeiten wieder moeglich');

console.log('\n── Leerzustand (US-002 AK6) ──');
globalThis.location={search:'?leer=1'};
const leer=new Function(js('index.html')+`return { buildList };`)();
leer.buildList();
ok(el('moduleList').innerHTML.includes('keine Projektseminare angeboten'),'Leerzustand wird gerendert');
ok(el('submitBtn').disabled===true,'Einreichen ist gesperrt');

console.log('\n── PDF (US-003) ──');
globalThis.location={search:''};
const pdf=new Function(js('index.html')+`return { openPdf };`)();
pdf.openPdf('ml-ki');
ok(el('pdfBody').innerHTML.includes('Voraussetzungen'),'Beschreibung wird angezeigt (AK3)');
ok(el('pdfTitle').textContent==='Machine Learning in der Praxis','richtige Zuordnung Datei zu Seminar (AK2)');
pdf.openPdf('pm');
ok(el('pdfBody').innerHTML.includes('keine Beschreibung hinterlegt'),'fehlende Beschreibung wird gemeldet (AK5)');
ok(el('pdfDownloadBtn').classList.contains('hide'),'kein Download-Button ohne Datei');



// ───────────────────────── Verwaltungsansicht ─────────────────────────
const adm = new Function(admSrc + `
  return { roster, belegung, store, saveStore, changeZuordnung, handleVeroeffentlichen,
           handleReset, renderAll, STUDENTS, MODULE_SHORT, KAPAZITAET };`)();
adm.handleReset();

console.log('\n── Admin: Ausgangszustand ──');
let ar = adm.roster();
ok(ar.length===22, `22 Bewerbungen geladen (${ar.length})`);
ok(ar.every(x=>x.vorschlag), 'jede Bewerbung hat einen KI-Vorschlag');
ok(ar.every(x=>x.zugewiesen===x.vorschlag), 'ohne Override = Vorschlag');
const bel0 = adm.belegung(ar);
ok(Object.values(bel0).reduce((a,b)=>a+b,0)===22, 'Belegung summiert auf 22');
ok(Object.values(bel0).every(v=>v<=adm.KAPAZITAET), `keine Überbelegung im Startzustand (max ${Math.max(...Object.values(bel0))}/${adm.KAPAZITAET})`);

console.log('\n── Admin: Rang-Berechnung ──');
const s77 = ar.find(x=>x.sNr==='S77212');
ok(s77.rang===1, 'S77212 (ml-ki = Erstwunsch) -> Rang 1');
const s79 = ar.find(x=>x.sNr==='S79033');
ok(s79.rang===2, 'S79033 (web = Zweitwunsch) -> Rang 2');

console.log('\n── Admin: manuelle Zuordnung ──');
adm.changeZuordnung('S77212','entre',null);
ar = adm.roster();
ok(ar.find(x=>x.sNr==='S77212').zugewiesen==='entre', 'Override wird gespeichert');
ok(ar.find(x=>x.sNr==='S77212').rang===null, 'Zuordnung ausserhalb der Wuensche -> Rang null');
ok(adm.belegung(ar)['ml-ki']===bel0['ml-ki']-1, 'alte Belegung sinkt');
ok(adm.belegung(ar)['entre']===bel0['entre']+1, 'neue Belegung steigt');

console.log('\n── Admin: Kapazitaetsgrenze (US-009 AK7) ──');
// entre kuenstlich bis Kapazitaet fuellen
const frei = adm.KAPAZITAET - adm.belegung(adm.roster())['entre'];
const kandidaten = adm.roster().filter(x=>x.zugewiesen!=='entre').slice(0,frei);
kandidaten.forEach(k=>adm.changeZuordnung(k.sNr,'entre',null));
ok(adm.belegung(adm.roster())['entre']===adm.KAPAZITAET, `entre ist voll (${adm.KAPAZITAET})`);
logs=[];
const opfer = adm.roster().find(x=>x.zugewiesen!=='entre');
adm.changeZuordnung(opfer.sNr,'entre',null);
ok(adm.roster().find(x=>x.sNr===opfer.sNr).zugewiesen!=='entre', 'Zuordnung ueber Kapazitaet wird abgelehnt');
ok(logs.some(l=>l.startsWith('ALERT')), 'Ablehnung wird dem Nutzer gemeldet');
ok(adm.belegung(adm.roster())['entre']===adm.KAPAZITAET, 'Kapazitaet bleibt eingehalten');

console.log('\n── Admin: "nicht zugeteilt" ──');
adm.changeZuordnung('S83441','',null);
ok(adm.roster().find(x=>x.sNr==='S83441').zugewiesen===null, 'leere Auswahl -> nicht zugeteilt');
ok(adm.roster().find(x=>x.sNr==='S83441').rang===null, 'kein Rang ohne Zuordnung');

console.log('\n── Veroeffentlichung ──');
ok(adm.store().veroeffentlicht===false, 'startet unveroeffentlicht');
adm.handleVeroeffentlichen();
ok(adm.store().veroeffentlicht===true, 'Veroeffentlichen setzt das Flag');
adm.handleVeroeffentlichen();
ok(adm.store().veroeffentlicht===false, 'Zuruecknehmen funktioniert');

console.log('\n── Reset ──');
adm.handleReset();
ok(Object.keys(adm.store().zuordnungen).length===0, 'Reset loescht Overrides');
ok(adm.roster().every(x=>x.zugewiesen===x.vorschlag), 'nach Reset wieder Ausgangszustand');


console.log(`\n──────── ${pass} OK, ${fail} FAIL ────────`);
process.exit(fail?1:0);
