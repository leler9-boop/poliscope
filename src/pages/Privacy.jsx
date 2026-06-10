import React from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <div className="max-w-2xl mx-auto px-5 py-12">

        <div className="mb-8">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">← Accueil</Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Politique de Confidentialité</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : 10 juin 2026</p>

        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">1. Qui sommes-nous</h2>
            <p>Poliscope est une plateforme de positionnement politique en ligne, accessible à l'adresse <strong>poliscop.org</strong>.</p>
            <p className="mt-2">Responsable du traitement :<br />
              <strong>ALERY SASU</strong><br />
              6 Rue René Schickelé, 67000 Strasbourg<br />
              Contact : <a href="mailto:contact@poliscop.org" className="text-blue-600 hover:underline">contact@poliscop.org</a>
            </p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">2. Données collectées</h2>
            <p className="mb-3"><strong>Données de compte (si vous créez un compte)</strong></p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>Adresse email</li>
              <li>Identifiant Google (si connexion via Google)</li>
              <li>Date de création du compte</li>
            </ul>
            <p className="mb-3"><strong>Données de quiz</strong></p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>Vos réponses aux questions politiques</li>
              <li>Votre profil politique calculé (scores thématiques)</li>
              <li>Nombre de questions répondues</li>
            </ul>
            <p className="mb-3"><strong>Données démographiques (facultatives)</strong></p>
            <ul className="list-disc list-inside space-y-1 mb-3">
              <li>Tranche d'âge</li>
              <li>Niveau d'études</li>
              <li>Code postal (agrégé, non utilisé à des fins d'identification individuelle)</li>
            </ul>
            <p className="mb-3"><strong>Données techniques</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Adresse IP (logs serveur, durée de conservation : 30 jours)</li>
              <li>Type de navigateur et système d'exploitation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">3. Finalités du traitement</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-800">Finalité</th>
                    <th className="text-left py-2 font-semibold text-gray-800">Base légale</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="py-2 pr-4">Fonctionnement du compte et authentification</td><td className="py-2">Exécution du contrat (art. 6.1.b RGPD)</td></tr>
                  <tr><td className="py-2 pr-4">Sauvegarde et synchronisation de votre profil</td><td className="py-2">Exécution du contrat</td></tr>
                  <tr><td className="py-2 pr-4">Amélioration du service (données agrégées, anonymisées)</td><td className="py-2">Intérêt légitime (art. 6.1.f RGPD)</td></tr>
                  <tr><td className="py-2 pr-4">Respect des obligations légales</td><td className="py-2">Obligation légale (art. 6.1.c RGPD)</td></tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3">Nous ne traitons pas vos données à des fins de publicité ciblée. Nous ne vendons pas vos données.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">4. Partage des données</h2>
            <p className="mb-2">Vos données ne sont pas vendues ni louées à des tiers.</p>
            <p className="mb-2">Nous faisons appel aux sous-traitants suivants, avec lesquels nous avons signé des accords de traitement conformes au RGPD :</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Supabase Inc.</strong> (authentification et stockage des données) — hébergement en Union européenne</li>
              <li><strong>Vercel Inc.</strong> (hébergement de l'application) — données de navigation uniquement</li>
            </ul>
            <p className="mt-2">Aucun transfert de données hors UE n'est effectué sans garanties appropriées (clauses contractuelles types).</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">5. Durée de conservation</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 pr-4 font-semibold text-gray-800">Données</th>
                    <th className="text-left py-2 font-semibold text-gray-800">Durée</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr><td className="py-2 pr-4">Données de compte actif</td><td className="py-2">Jusqu'à suppression du compte</td></tr>
                  <tr><td className="py-2 pr-4">Données de quiz</td><td className="py-2">Jusqu'à suppression du compte</td></tr>
                  <tr><td className="py-2 pr-4">Logs techniques</td><td className="py-2">30 jours</td></tr>
                  <tr><td className="py-2 pr-4">Données après clôture du compte</td><td className="py-2">Suppression dans les 30 jours suivant la demande</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">6. Vos droits (RGPD)</h2>
            <p className="mb-2">Conformément au Règlement (UE) 2016/679, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong>Droit d'accès</strong> — obtenir une copie de vos données</li>
              <li><strong>Droit de rectification</strong> — corriger des données inexactes</li>
              <li><strong>Droit à l'effacement</strong> — demander la suppression de votre compte et de vos données</li>
              <li><strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré</li>
              <li><strong>Droit d'opposition</strong> — vous opposer à certains traitements fondés sur l'intérêt légitime</li>
              <li><strong>Droit à la limitation</strong> — restreindre temporairement le traitement</li>
            </ul>
            <p className="mt-3">Pour exercer ces droits : <a href="mailto:contact@poliscop.org" className="text-blue-600 hover:underline">contact@poliscop.org</a></p>
            <p className="mt-2">Vous pouvez également déposer une réclamation auprès de la <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">www.cnil.fr</a></p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">7. Sécurité</h2>
            <p>Les données sont chiffrées en transit (HTTPS/TLS) et au repos. L'accès aux bases de données est restreint et contrôlé par des règles de sécurité au niveau des lignes (Row Level Security via Supabase). Les mots de passe ne sont jamais stockés en clair.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">8. Cookies</h2>
            <p className="mb-2">Poliscope n'utilise pas de cookies publicitaires ou de tracking tiers. Nous utilisons uniquement :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Un cookie de session d'authentification (strictement nécessaire)</li>
              <li>Le stockage local du navigateur (localStorage) pour sauvegarder votre progression sans compte</li>
            </ul>
            <p className="mt-2">Aucun bandeau de consentement aux cookies tiers n'est requis.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">9. Mineurs</h2>
            <p>Poliscope n'est pas destiné aux personnes de moins de 16 ans. Nous ne collectons pas sciemment de données concernant des mineurs.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">10. Modifications</h2>
            <p>En cas de modification substantielle de cette politique, vous en serez informé par email (si vous avez un compte) ou par une notice visible sur le site. La date de mise à jour figure en en-tête.</p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 flex gap-4 text-xs text-gray-400">
          <Link to="/terms" className="hover:text-gray-600">Conditions d'utilisation</Link>
          <Link to="/" className="hover:text-gray-600">Accueil</Link>
        </div>

      </div>
    </div>
  );
}
