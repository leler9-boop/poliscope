import React from 'react';
import { L, VISION_STYLE } from './helpers.js';

/** Briques de contenu : paragraphes, glossaire, comparaison, visions, confusion,
 *  + sources granulaires de section. */

export function Paragraphs({ text }) {
  return text.split('\n\n').map((p, i) => (
    <p key={i} className="text-sm text-gray-600 leading-relaxed mb-3 last:mb-0">{p}</p>
  ));
}

/** Ligne de sources granulaires (section, chronologie, tableau…). */
export function SourceLine({ sources, language }) {
  if (!sources?.length) return null;
  return (
    <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
      {language === 'fr' ? 'Source' : 'Source'}{sources.length > 1 ? 's' : ''} :{' '}
      {sources.map((s, i) => (
        <span key={i}>
          {i > 0 && ' · '}
          {s.url
            ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 hover:underline">{s.label}</a>
            : s.label}
        </span>
      ))}
    </p>
  );
}

function BriqueGlossaire({ termes, language }) {
  return (
    <div className="space-y-3">
      {termes.map((t, i) => (
        <div key={i} className="bg-gray-50 rounded-xl px-4 py-3">
          <p className="text-sm font-semibold text-gray-800 mb-1">{L(t.nom, language)}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{L(t.def, language)}</p>
        </div>
      ))}
    </div>
  );
}

function BriqueComparaison({ rows, language }) {
  return (
    <div className="space-y-2">
      {rows.map((r, i) => (
        <div key={i} className="flex gap-3 bg-gray-50 rounded-xl px-4 py-3">
          <div className="shrink-0 w-24">
            <p className="text-sm font-semibold text-gray-800">{L(r.pays, language)}</p>
            <p className="text-xs font-bold text-gray-500 mt-0.5">{r.valeur}</p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{L(r.desc, language)}</p>
        </div>
      ))}
    </div>
  );
}

function BriqueVisions({ visions, language }) {
  return (
    <div className="space-y-3">
      {visions.map((v, i) => {
        const cls = VISION_STYLE[v.couleur] || VISION_STYLE.blue;
        return (
          <div key={i} className={`border rounded-xl px-4 py-3 ${cls}`}>
            <p className="text-xs font-bold uppercase tracking-wide mb-1.5">{L(v.label, language)}</p>
            <p className="text-sm leading-relaxed">{L(v.corps, language)}</p>
          </div>
        );
      })}
    </div>
  );
}

/** Corps d'une section (N2 ou N3) : brique typée ou paragraphes, + sources de section. */
export function SectionBody({ section, language }) {
  let body;
  if (section.brique === 'glossaire' && section.termes) body = <BriqueGlossaire termes={section.termes} language={language} />;
  else if (section.brique === 'comparaison' && section.rows) body = <BriqueComparaison rows={section.rows} language={language} />;
  else if (section.brique === 'visions' && section.visions) body = <BriqueVisions visions={section.visions} language={language} />;
  else if (section.brique === 'confusion') {
    body = (
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-1.5">
          {language === 'fr' ? '⚠️ Attention à la confusion' : '⚠️ Common confusion'}
        </p>
        <Paragraphs text={L(section.corps, language)} />
      </div>
    );
  } else if (section.brique === 'a-retenir') {
    body = (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-wide text-emerald-700 mb-1.5">
          {language === 'fr' ? '✅ À retenir' : '✅ Key takeaway'}
        </p>
        <Paragraphs text={L(section.corps, language)} />
      </div>
    );
  } else {
    body = <Paragraphs text={L(section.corps, language)} />;
  }
  return (
    <>
      {body}
      <SourceLine sources={section.sources} language={language} />
    </>
  );
}
