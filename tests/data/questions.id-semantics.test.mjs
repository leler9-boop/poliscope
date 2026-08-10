// POLISCOP — Intégrité SÉMANTIQUE des identifiants de questions (contre-audit P0-1).
//
// CE QUE CES TESTS AURAIENT ATTRAPÉ
// ---------------------------------
// La révision d'août 2026 a réécrit 93 questions en conservant leur identifiant, avec cette
// affirmation dans le rapport : « aucune direction n'a été inversée, aucun identifiant conservé
// n'a changé de sens ». La première moitié était vraie, la seconde était fausse. Huit questions
// au moins avaient changé de population, de bénéficiaire, de seuil ou de dispositif tout en
// gardant leur clé :
//
//   SOC_10  « maladie incurable à un stade avancé » → « malades incurables »   (population élargie)
//   PUB_23  gratuité « pour les étudiants français » → gratuité sans condition (bénéficiaires)
//   PUB_24  « les médecins » → « les jeunes médecins »                          (population réduite)
//   GLO_25  « aide militaire » → « envoyer des armes »                          (périmètre réduit)
//   IMM_8   « droits sociaux » → « aides sociales »                             (nature des droits)
//   SOC_27  obligation de progrès → obligation de résultat                      (critère)
//   DEM_24  inscription dans la Constitution → simple demande par signatures    (institution)
//   SOC_7   « famille traditionnelle hétérosexuelle » → « famille traditionnelle » (définition perdue)
//
// Un identifiant de question est une clé de DONNÉE. Une réponse enregistrée en juillet sous
// SOC_10 signifiait « je suis d'accord pour les malades en phase avancée ». Réutiliser l'ID
// pour une population plus large réinterprète silencieusement cette réponse — le profil
// change sans que personne n'ait rien répondu de nouveau.
//
// Aucune heuristique ne détecte ça : c'est une comparaison de SENS. Le garde-fou est donc un
// registre de classification humaine, figé et vérifié ici.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

import { questions, EDITORIALLY_RETIRED_IDS } from '../../src/data/questions.js';
import rawQuestions from '../../src/data/questions_final.json';

const ROOT = fileURLToPath(new URL('../..', import.meta.url)).replace(/\/$/, '');
const semantics = JSON.parse(readFileSync(`${ROOT}/docs/questions/id-semantics-2026-08.json`, 'utf8'));
const retired = JSON.parse(readFileSync(`${ROOT}/docs/questions/retired-ids.json`, 'utf8'));

/** Commit précédant la révision éditoriale d'août 2026. */
const BASELINE = '74503c0';

const rawById = new Map(rawQuestions.map(q => [q.id, q]));
const activeIds = new Set(questions.map(q => [q.id][0]));
const byId = new Map(semantics.questions.map(e => [e.id, e]));

/** Banque telle qu'elle existait avant la révision. */
function baselineBank() {
  const json = execFileSync('git', ['show', `${BASELINE}:src/data/questions_final.json`], {
    cwd: ROOT, maxBuffer: 64 * 1024 * 1024,
  }).toString();
  return new Map(JSON.parse(json).map(q => [q.id, q.text]));
}

/** Catégories qui autorisent la conservation d'un identifiant. */
const NON_MATERIELLES = new Set(['simplification', 'precision']);

test('toute question réécrite depuis la référence est classée sémantiquement', () => {
  const before = baselineBank();
  const createdIds = new Set(retired.created.map(e => e.id));
  const nonClassees = [];
  for (const q of questions) {
    if (createdIds.has(q.id)) continue;            // question née après la référence
    const avant = before.get(q.id);
    if (avant === undefined) continue;             // identifiant inconnu de la référence
    if (avant === rawById.get(q.id).text) continue; // texte inchangé
    if (!byId.has(q.id)) nonClassees.push(q.id);
  }
  assert.deepEqual(
    nonClassees, [],
    `questions réécrites sans classification sémantique : ${nonClassees.join(', ')}.\n` +
    'Toute réécriture doit être classée dans docs/questions/id-semantics-2026-08.json.',
  );
});

test('un identifiant conservé ne porte qu’un changement non matériel', () => {
  const fautes = [];
  for (const e of semantics.questions) {
    if (e.verdict !== 'conserve') continue;
    if (!NON_MATERIELLES.has(e.categorie)) {
      fautes.push(`${e.id} : conservé alors que le changement est classé « ${e.categorie} »`);
    }
    if (!activeIds.has(e.id)) fautes.push(`${e.id} : classé conservé mais absent de la file active`);
  }
  assert.deepEqual(fautes, [], `\n${fautes.join('\n')}\n`);
});

test('un identifiant restauré est actif, motivé, et son texte n’est plus celui qui déviait', () => {
  const fautes = [];
  for (const e of semantics.questions) {
    if (e.verdict !== 'restaure') continue;
    if (!activeIds.has(e.id)) { fautes.push(`${e.id} : restauré mais inactif`); continue; }
    if (!e.motif || e.motif.length < 40) fautes.push(`${e.id} : motif de restauration absent ou trop court`);
    // Une restauration doit avoir changé quelque chose : si le texte est resté celui de la
    // révision fautive, la correction n'a pas été appliquée.
    if (rawById.get(e.id).text === e.textApresRevisionFautive) {
      fautes.push(`${e.id} : le texte dévié n'a pas été corrigé`);
    }
  }
  assert.deepEqual(fautes, [], `\n${fautes.join('\n')}\n`);
});

test('un changement matériel irréductible retire l’ancien identifiant', () => {
  const fautes = [];
  for (const e of semantics.questions) {
    if (e.verdict !== 'nouvel-id') continue;
    if (NON_MATERIELLES.has(e.categorie)) {
      fautes.push(`${e.id} : nouvel identifiant pour un changement non matériel — incohérent`);
    }
    if (activeIds.has(e.id)) fautes.push(`${e.id} : doit être retiré, il est encore servi`);
    if (!EDITORIALLY_RETIRED_IDS.has(e.id)) fautes.push(`${e.id} : absent de EDITORIALLY_RETIRED_IDS`);
    if (!retired.retired.some(r => r.id === e.id)) fautes.push(`${e.id} : absent du registre des retraits`);
    if (!e.remplacePar) { fautes.push(`${e.id} : aucun identifiant de remplacement déclaré`); continue; }
    if (!activeIds.has(e.remplacePar)) fautes.push(`${e.id} : remplacement ${e.remplacePar} inactif`);
    if (!retired.created.some(c => c.id === e.remplacePar)) {
      fautes.push(`${e.remplacePar} : absent du registre des créations`);
    }
  }
  assert.deepEqual(fautes, [], `\n${fautes.join('\n')}\n`);
});

test('le texte des questions restaurées rétablit l’élément sémantique perdu', () => {
  // Vérification ciblée sur les huit cas nommés par le contre-audit, plus les restaurations
  // dont l'élément perdu est un mot précis. On ne teste pas « le sens est équivalent » — c'est
  // un jugement humain — mais la présence du marqueur dont la disparition avait changé le sens.
  const MARQUEURS = {
    SOC_10: /stade avancé/i,
    PUB_23: /étudiants français/i,
    PUB_24: /\bmédecins\b/i,
    GLO_25: /aide militaire/i,
    IMM_8:  /droits sociaux/i,
    SOC_27: /ne réduisent pas/i,
    SOC_7:  /hétérosexuelle/i,
    SOC_16: /établissements scolaires/i,
    DEM_8:  /importants|gros/i,
    PUB_3:  /essentiels/i,
    ENV_25: /européennes/i,
    IMM_16: /Parlement/i,
    SEC_12: /services secrets/i,
    GLO_12: /anciens pays colonisateurs/i,
    GLO_15: /génocide/i,
    SEC_25: /soupçonn/i,
  };
  const fautes = [];
  for (const [id, re] of Object.entries(MARQUEURS)) {
    const texte = rawById.get(id)?.text ?? '';
    if (!re.test(texte)) fautes.push(`${id} : « ${re.source} » absent de « ${texte} »`);
  }
  assert.deepEqual(fautes, [], `\n${fautes.join('\n')}\n`);
});

test('la version du questionnaire distingue la révision corrigée', () => {
  // Les textes servis ne sont plus ceux publiés sous 2026.08-128q : la version doit bouger,
  // sinon deux banques différentes circulent sous la même étiquette.
  const { QUESTIONNAIRE_VERSION } = JSON.parse(JSON.stringify({
    QUESTIONNAIRE_VERSION: readFileSync(`${ROOT}/src/engine/versions.js`, 'utf8')
      .match(/QUESTIONNAIRE_VERSION = '([^']+)'/)[1],
  }));
  assert.notEqual(QUESTIONNAIRE_VERSION, '2026.08-128q', 'version non incrémentée après correction P0-1');
  assert.match(QUESTIONNAIRE_VERSION, /^2026\.08-128q-r2$/);
});
