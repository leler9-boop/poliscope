import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <div className="max-w-2xl mx-auto px-5 py-12">

        <div className="mb-8">
          <Link to="/" className="text-sm text-gray-400 hover:text-gray-600">← Accueil</Link>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Conditions Générales d'Utilisation</h1>
        <p className="text-sm text-gray-400 mb-10">Dernière mise à jour : 10 juin 2026</p>

        <div className="space-y-8 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">1. Éditeur</h2>
            <p>Poliscop est édité par <strong>ALERY SASU</strong>, société par actions simplifiée, dont le siège social est situé 6 Rue René Schickelé, 67000 Strasbourg.</p>
            <p className="mt-2">Contact : <a href="mailto:contact@poliscop.org" className="text-blue-600 hover:underline">contact@poliscop.org</a></p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">2. Objet</h2>
            <p>Poliscop est une plateforme en ligne permettant à ses utilisateurs de répondre à des questionnaires politiques afin d'obtenir un profil de positionnement politique indicatif, et de comparer ce profil à des candidats, figures historiques et archétypes politiques.</p>
            <p className="mt-2">L'utilisation de Poliscop est libre, gratuite et ne requiert pas de création de compte. La création d'un compte permet uniquement de sauvegarder et synchroniser votre profil entre appareils.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">3. Acceptation</h2>
            <p>L'accès et l'utilisation de Poliscop impliquent l'acceptation sans réserve des présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser le service.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">4. Nature des résultats</h2>
            <p className="mb-2">Les profils et scores produits par Poliscop sont <strong>indicatifs et non scientifiques</strong>. Ils sont calculés à partir de vos réponses à un questionnaire et ne constituent en aucun cas :</p>
            <ul className="list-disc list-inside space-y-1 mb-2">
              <li>Une affiliation politique officielle</li>
              <li>Un conseil électoral ou politique</li>
              <li>Un résultat certifié ou définitif</li>
            </ul>
            <p>Poliscop n'exprime aucune préférence pour un parti, un candidat ou une idéologie. Les données des candidats et figures politiques sont présentées à titre informatif et documentaire.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">5. Création de compte</h2>
            <p className="mb-2">La création d'un compte est possible via email/mot de passe ou via Google OAuth. Vous vous engagez à :</p>
            <ul className="list-disc list-inside space-y-1 mb-2">
              <li>Fournir une adresse email valide et exacte</li>
              <li>Ne pas créer de compte au nom d'une autre personne</li>
              <li>Maintenir la confidentialité de vos identifiants</li>
              <li>Nous notifier immédiatement en cas d'usage non autorisé de votre compte</li>
            </ul>
            <p>Vous êtes seul responsable de l'activité effectuée depuis votre compte.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">6. Utilisation acceptable</h2>
            <p className="mb-2">Il est interdit d'utiliser Poliscop pour :</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Contourner, perturber ou tenter de compromettre les systèmes techniques</li>
              <li>Extraire automatiquement des données (scraping)</li>
              <li>Créer des comptes de manière automatisée</li>
              <li>Diffuser des contenus illicites, diffamatoires ou trompeurs via les fonctionnalités de partage</li>
              <li>Toute activité contraire aux lois françaises et européennes applicables</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">7. Données personnelles</h2>
            <p>Le traitement de vos données personnelles est régi par notre <Link to="/privacy" className="text-blue-600 hover:underline">Politique de Confidentialité</Link>, disponible à l'adresse <strong>poliscop.org/privacy</strong>. Cette politique fait partie intégrante des présentes CGU.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">8. Propriété intellectuelle</h2>
            <p className="mb-2">L'ensemble des éléments constitutifs de Poliscop — code source, design, textes, questions, algorithmes de scoring — sont la propriété exclusive de <strong>ALERY SASU</strong> et sont protégés par le droit de la propriété intellectuelle.</p>
            <p className="mb-2">Toute reproduction, représentation ou exploitation non autorisée est interdite.</p>
            <p>Les données relatives aux candidats et figures politiques sont issues de sources publiques et présentées à titre informatif dans le cadre du droit à l'information.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">9. Disponibilité du service</h2>
            <p>Poliscop est fourni "en l'état". Nous ne garantissons pas une disponibilité continue et ininterrompue. Des interruptions de service pour maintenance ou en cas de force majeure sont possibles sans préavis.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">10. Limitation de responsabilité</h2>
            <p className="mb-2">Dans les limites autorisées par le droit applicable, <strong>ALERY SASU</strong> ne pourra être tenu responsable de dommages indirects résultant de l'utilisation ou de l'impossibilité d'utiliser le service.</p>
            <p>Poliscop ne peut être tenu responsable des décisions — notamment électorales — prises sur la base des résultats du questionnaire.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">11. Résiliation</h2>
            <p>Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre profil ou en contactant <a href="mailto:contact@poliscop.org" className="text-blue-600 hover:underline">contact@poliscop.org</a>. La suppression entraîne l'effacement de vos données conformément à notre Politique de Confidentialité.</p>
            <p className="mt-2">Nous nous réservons le droit de suspendre ou supprimer un compte en cas de violation manifeste des présentes CGU.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">12. Droit applicable et juridiction</h2>
            <p>Les présentes CGU sont régies par le droit français. En cas de litige, et à défaut de résolution amiable, les tribunaux compétents du ressort de <strong>Strasbourg</strong> seront seuls compétents.</p>
          </section>

          <section>
            <h2 className="text-base font-semibold text-gray-900 mb-2">13. Contact</h2>
            <p>Pour toute question relative aux présentes CGU : <a href="mailto:contact@poliscop.org" className="text-blue-600 hover:underline">contact@poliscop.org</a></p>
          </section>

        </div>

        <div className="mt-12 pt-6 border-t border-gray-200 flex gap-4 text-xs text-gray-400">
          <Link to="/privacy" className="hover:text-gray-600">Politique de Confidentialité</Link>
          <Link to="/" className="hover:text-gray-600">Accueil</Link>
        </div>

      </div>
    </div>
  );
}
