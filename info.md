# Gereo : fiche de projet, plateforme de gestion d'argent, de projets et de groupes
 
---
 
## Fiche d'identité
 
Plateforme mobile et web de gestion de l'argent, des projets et de la vie, pour des utilisateurs individuels et des groupes à Madagascar, avec l'ambition de faire évoluer la plateforme vers d'autres marchés pour Particuliers qui gèrent leur budget, et groupes qui cotisent ensemble, le groupe test est le groupe actuel qui existe déjà, avec Vanilla Pay : la réglementation est déjà réglée, toutes les plateformes de mobile money sont couvertes, plafond de 100.000.000 Ar, aucune vérification d'identité fournie, pour la gestion des accès, OpenFGA, sans aucun rôle, uniquement des permissions

---
 
## Contexte et problème
 
Dans le groupe du porteur du projet, tout le monde cotise chaque mois pour financer des projets. Le fonctionnement actuel repose sur des outils séparés, des réunions, des appels et des calculs à la main. Résultat : un manque de transparence et de confiance.
 
| # | Problème vécu | Conséquence | Réponse du produit |
| --- | --- | --- | --- |
| 1 | Pas de vraie visibilité sur le solde réel après les cotisations | Doute et méfiance entre membres | Wallet de groupe avec solde réel en temps réel, visible par tous |
| 2 | Décisions de réunion presque toujours oubliées ou imprécises | Projets qui n'avancent pas, désaccords | Journal de décisions rattaché au projet |
| 3 | Votes à organiser à la main et à faire coïncider avec l'emploi du temps de tous | Le groupe est freiné énormément | Votes asynchrones avec échéance |
| 4 | Pas d'outil pour boosts et posts sur les réseaux sociaux, ni d'analyse de qui voit les produits | Marketing à l'aveugle | Module marketing avec analyse d'audience |
| 5 | Un outil séparé pour chaque besoin | Dispersion, perte de temps | Une plateforme unique à modules activables |
| 6 | Rappels d'événements manuels : quelqu'un doit appeler tout le monde | Oublis | Rappels automatiques à tous les membres |
| 7 | Calcul manuel des cotisations et de la répartition des revenus | Erreurs, problèmes de confiance | Règles de cotisation et de répartition automatiques |
| 8 | Flux d'argent (% vers où, quand, combien il reste) non transparents ni en temps réel | Aucune vue d'ensemble | Registre comptable en temps réel, visible par tous |
 
---

Le but c'est d'aider les gens à bien utiliser et gérer leur argent, leur vie et leurs projets, avec un maximum de flexibilité, et leur donner la facilité de visualiser, gérer et surtout analyser leur budget, leurs projets, leurs investissements, leur épargne et leur business.
 
 
## Utilisateurs et parcours
 
##  Profils
 
| Profil | Besoin principal | Modules les plus utilisés |
| --- | --- | --- |
| Particulier | Gérer son budget, son épargne, ses investissements et ses projets | Wallets, projets, événements, analyse |
| Membre d'un groupe | Cotiser, voir où va l'argent, voter, suivre les projets | Wallet de groupe, votes, projets, événements |
| Membre détenant les permissions financières (par exemple un trésorier) | Configurer les cotisations et les répartitions, approuver des dépenses | Wallet de groupe, règles de répartition |
| Vendeur (utilisateur ou groupe) | Vendre un produit ou un service et en suivre les ventes | Marketplace, marketing, analyse |
 
Il n'existe pas de rôle dans le système : trésorier n'est qu'un **modèle de permissions** prérempli que l'on peut modifier.
 
##  Parcours clés
 
1. **Démarrer** : créer un compte, vérifier son identité, créer un premier wallet et définir ses règles.
2. **Créer un groupe** : créer le groupe, inviter les membres, définir le plan de cotisation, ouvrir le wallet du groupe, définir les règles de répartition.
3. **Cotiser** : rappel automatique, paiement du membre, confirmation, mise à jour du solde, notification à tous.
4. **Décider** : une proposition est publiée dans le projet, le vote s'ouvre avec une échéance, le résultat est enregistré automatiquement dans le journal de décisions.
5. **Organiser** : création d'un événement, rappels automatiques envoyés à tous les membres, confirmation de présence.
6. **Répartir un revenu** : un revenu entre dans le wallet du groupe, la règle de répartition s'applique, chaque destination reçoit sa part, tout est visible immédiatement.
---
 
## Modèle conceptuel
 
Une **entité** est soit un utilisateur, soit un groupe. Elle possède des ressources (wallets, projets, événements, documents) et peut activer des modules. Le groupe a toutes les capacités d'un utilisateur, mais contient plusieurs utilisateurs.
 
| Objet | Description | Appartient à | Attributs clés |
| --- | --- | --- | --- |
| Utilisateur | Personne ayant un compte | Plateforme | Identité vérifiée, téléphone, langue, devise préférée |
| Groupe | Ensemble d'utilisateurs avec les mêmes capacités qu'un utilisateur | Plateforme | Nom, description, modules activés |
| Adhésion | Lien entre un utilisateur et un groupe, porteur de permissions (pas de rôle) | Groupe | Date d'entrée, permissions accordées |
| Wallet | Compte d'argent avec ses propres règles | Utilisateur ou groupe | Type (budget, épargne, investissement, business), devise, solde |
| Règle de wallet | Règle automatique propre à un wallet | Wallet | Déclencheur, condition, action, pourcentage ou montant |
| Écriture comptable | Ligne immuable du registre, toujours équilibrée | Wallet | Montant, sens, référence, horodatage, auteur |
| Transaction | Mouvement d'argent visible par l'utilisateur | Wallet | Type, statut, partenaire de paiement, référence |
| Plan de cotisation | Montant, fréquence et échéance des cotisations d'un groupe | Groupe | Montant, fréquence, date limite, pénalité éventuelle |
| Projet | Dossier de pilotage d'une initiative (ERP) | Utilisateur ou groupe | Objectif, budget, échéance, wallet lié, avancement |
| Décision | Décision enregistrée, avec son contexte | Projet ou groupe | Intitulé, date, résultat du vote, responsable |
| Événement, note, date à retenir | Élément de gestion du temps | Utilisateur, groupe ou projet | Date, récurrence, participants, rappels |
| Document | Fichier ou texte conservé | Utilisateur, groupe ou projet | Titre, version, auteur |
| Vote | Scrutin ouvert à des membres | Groupe ou projet | Question, options, échéance, quorum, règle de majorité |
| Offre | Produit ou service à vendre | Utilisateur ou groupe | Titre, prix, stock, statut |
| Commande | Achat d'une offre | Plateforme | Acheteur, vendeur, montant, statut |
| Publication | Message du réseau social ou annonce de groupe | Utilisateur, groupe | Texte, média, audience |
| Campagne marketing | Boost, post promotionnel ou campagne | Utilisateur, groupe ou projet | Canal, budget, durée, résultats |
| Prêt | Demande et suivi d'un prêt | Utilisateur ou groupe | Montant, durée, échéancier, statut |
| Collecte de dons | Appel à dons sur la plateforme | Utilisateur, groupe ou plateforme | Objectif, montant collecté, échéance |
| Activation de module | Module activé pour une entité | Entité | Module, date, paramètres |
| Notification | Message envoyé à un utilisateur | Utilisateur | Canal, contenu, statut d'envoi |
 
---
 
## Spécification fonctionnelle par module
 
##  Compte et identité
 
**Objectif** : permettre à chacun de créer un compte, d'être identifié de façon fiable et de posséder des wallets, groupes et projets.
 
**Fonctionnalités**
- Inscription et connexion sécurisées
- Vérification d'identité réalisée par Gereo, car Vanilla Pay n'en fournit pas
- Profil, langue, devise préférée, preferences
- Création de plusieurs wallets, de groupes et de projets
**Règles de gestion**
- Un utilisateur peut créer plusieurs wallets, plusieurs groupes et plusieurs projets.
- Les opérations d'argent exigent une identité vérifiée, avec des plafonds selon le niveau de vérification.
##  Wallets
 
**Objectif** : gérer l'argent le plus efficacement possible, avec ses propres règles pour chaque wallet.
 
**Fonctionnalités**
- Création de plusieurs wallets
- Règles propres à chaque wallet : allocation automatique d'un pourcentage de chaque revenu vers un autre wallet, plafond de dépense, objectif d'épargne, alertes de seuil
- Historique complet et filtrable des mouvements
- Dépôt et retrait via les opérateurs de mobile money (Vanilla Pay)
**Règles de gestion**
- Un wallet appartient à une seule entité mais permettre de faire du transfert.
- Chaque règle indique son déclencheur, sa condition et son action, et son exécution est visible dans l'historique.
**Permissions** : voir le solde, voir l'historique, déposer, initier une dépense, approuver une dépense, modifier les règles, fermer le wallet.
 
##  Groupes
 
**Objectif** : permettre à plusieurs utilisateurs d'agir ensemble avec les mêmes capacités qu'un utilisateur.
 
**Fonctionnalités**
- Création, invitation et adhésion
- Wallet(s) de groupe
- Activation en interne de tout ce que la plateforme possède : marketplace, réseau social, lending, etc.
- Annonces internes via le réseau social du groupe
**Règles de gestion**
- Un membre n'a que les permissions explicitement accordées.
- Chaque changement de permission est enregistré dans le journal d'audit.
- Les modules activés en interne sont isolés : leurs données ne sont visibles que des membres du groupe.
##  Cotisations et répartition (cœur du produit)
 
**Objectif** : supprimer les calculs manuels et rendre chaque flux visible et vérifiable par tous.
 
**Fonctionnalités**
- **Plan de cotisation** : montant, fréquence, échéance, éventuelle pénalité de retard
- **Suivi par membre** : payé, en attente, en retard, avec rappels automatiques
- **Règles de répartition des revenus** : pourcentage vers chaque destination (eg: projet, réserve, membres), moment de la répartition
- **Exécution automatique** de la répartition à l'arrivée d'un revenu
- **Vue transparente** : solde, entrées, sorties, pourcentage vers où, combien il reste, en temps réel, pour tous les membres autorisés
- **Export** de l'historique pour les réunions et la comptabilité
**Règles de gestion**
- La somme des pourcentages d'une règle de répartition peut ne pas être de 100 %.
- Une règle modifiée ne s'applique qu'aux futurs revenus ; l'historique n'est jamais réécrit.
- Une modification de règle importante peut exiger un vote selon les permissions du groupe.
##  Projets (ERP)
 
**Objectif** : permettre de faire avancer, suivre et décider, avec un vrai ERP et non un simple gestionnaire de tâches.
 
**Périmètre ERP proposé**
 
| Fonction ERP | Contenu |
| --- | --- |
| Fiche projet | Objectif, responsable, échéance, statut |
| Budget et dépenses | Budget prévu, wallet lié, dépenses réelles, écart |
| Planification | Jalons, tâches, dépendances, avancement |
| Décisions | Journal de décisions avec contexte et vote associé |
| Ressources | Équipe affectée, charge, compétences |
| Achats et fournisseurs | Demandes d'achat, bons de commande, fournisseurs |
| Documents | Documents du projet, versions |
| Calendrier | Événements et échéances du projet |
| Reporting | Tableau de bord d'avancement, budget consommé, risques |
 
**Règles de gestion**
- Une dépense de projet débite le wallet lié et nécessite la permission approuver une dépense.
- Chaque décision importante est liée à un vote ou à une personne identifiée.
##  Événements, notes et dates à retenir
 
**Objectif** : gérer le temps pour tous, utilisateurs, groupes et projets.
 
**Fonctionnalités**
- Calendrier, événements récurrents, notes, dates à retenir
- **Rappels automatiques** à tous les participants, par notification, et par SMS lorsque la personne n'a pas ouvert l'application
- Confirmation de présence
##  Documents
 
**Objectif** : conserver les documents de l'utilisateur, du groupe ou du projet.
 
**Fonctionnalités** : dépôt, dossiers, versions, partage selon les permissions, liens avec une décision, un projet ou un événement.
 
##  Votes
 
**Objectif** : décider collectivement sans dépendre de l'emploi du temps de tous.
 
**Fonctionnalités**
- Vote **asynchrone** avec échéance, ouvert à des membres choisis
- Types : oui/non, choix multiple, classement
- Règle de majorité et quorum paramétrables
- Résultat enregistré automatiquement dans le journal de décisions
- Possibilité de lier un vote à une action (approuver une dépense, modifier une règle de répartition)
**Disponibilité** : groupes et projets.
 
##  Marketplace
 
**Objectif** : permettre à un utilisateur ou un groupe de vendre un produit ou un service sur la plateforme.
 
**Fonctionnalités** : fiches d'offres, commandes, paiement via wallet, avis, suivi des ventes, commission de la plateforme.
 
**Règles de gestion** : la marketplace est une fonction de la plateforme ; un groupe peut aussi l'activer en interne via des plugins.
 
## Réseau social et communautés
 
**Objectif** : créer des communautés dans la plateforme, sur le modèle de Binance Square.
 
**Fonctionnalités** : fil de publications, communautés, abonnements, réactions, modération.
 
**Dans un groupe** : sert aux annonces.
 
## Marketing
 
**Objectif** : offrir des posts promotionnels, des boosts sur les réseaux sociaux et des campagnes marketing aux utilisateurs, groupes et projets.
 
**Fonctionnalités**
- Création et programmation de posts promotionnels, boosts et campagnes
- **Analyse d'audience : portée, personnes touchées, engagement**
- Petites fonctionnalités additionnelles, comme sur https://pr.social, pouvant aussi générer des revenus pour d'autres
## Lending
 
**Objectif** : permettre à un utilisateur ou à un groupe de demander un prêt à la plateforme, et au sein d'un groupe d'avoir le même mécanisme de façon isolée.
 
**Fonctionnalités** : demande, évaluation, décaissement, échéancier, remboursements, relances automatiques.
 
**Règles de gestion** : décision de crédit encadrée par des critères objectifs ; un prêt interne à un groupe utilise uniquement les fonds du groupe.
 
## Collectes de dons
 
**Objectif** : permettre des collectes de dons sur toute la plateforme, pas seulement dans un groupe.
 
**Fonctionnalités** : création d'une collecte (objectif, échéance, description), suivi du montant collecté, remerciements, reçus, rapport d'utilisation des fonds.
 
## Permissions (OpenFGA, sans aucun rôle)
 
**Principe** : la plateforme n'a jamais de rôle. Tout accès repose sur des permissions, accordées individuellement et qui peuvent descendre d'un objet parent à ses objets enfants (groupe vers projet vers document).
 
**Relations structurelles** : une relation décrit un lien (appartient à, est membre de), jamais un pouvoir. Les pouvoirs viennent uniquement des permissions.
 
##  Permissions par type d'objet
 
| Objet | Permissions |
| --- | --- |
| Groupe | Voir le groupe, inviter un membre, retirer un membre, voir permissions, accorder une permission, retirer une permission, activer un module, modifier le groupe, supprimer le groupe |
| Wallet | Voir le solde, voir l'historique, déposer, initier une dépense, approuver une dépense, modifier les règles, exporter l'historique, fermer |
| Plan de cotisation | Voir, modifier, exempter un membre, relancer, supprimer |
| Projet | Voir, modifier, gérer le budget, gérer les tâches, approuver un achat, gérer l'équipe, clôturer |
| Vote | Voir, voter, créer, clôturer, modifier |
| Événement | Voir, créer, modifier, inviter |
| Document | Voir, ajouter, modifier, supprimer, partager |
| Marketplace | Publier une offre, modifier une offre, gérer les commandes, voir les ventes |
| Marketing | Créer une campagne, dépenser un budget marketing, voir les résultats |
| Prêt | Demander, approuver, rembourser, voir |
| Publication | Publier, annoncer au groupe, modérer |
 
##  Garde-fous
 
- Chaque changement de permission est écrit dans un journal d'audit visible des membres autorisés.
- Les dépenses au-dessus d'un seuil exigent l'approbation de plusieurs personnes ou un vote.
- OpenFGA répond à la question cette personne a-t-elle le droit ?. Les règles métier (seuils, votes obligatoires) restent dans la logique du produit.
- L'authentification (la connexion) est gérée à part.
---
 
## Flux d'argent
 
**Principe** : la plateforme détient réellement les fonds, avec la réglementation traitée via Vanilla Pay.
 
**Principes comptables**
- Tout mouvement est enregistré dans un **registre à double entrée** : chaque opération génère des écritures qui s'équilibrent.
- Les écritures sont **immuables** : une erreur se corrige par une écriture inverse, jamais par une modification.
- Le solde affiché est calculé à partir du registre, ce qui garantit qu'il est réel.
- Les fonds des clients sont séparés des fonds propres de la plateforme.
| Flux | Déclencheur | Écritures principales |
| --- | --- | --- |
| Dépôt | Paiement mobile money d'un utilisateur | Compte externe vers wallet |
| Retrait | Demande de l'utilisateur | Wallet vers compte externe |
| Cotisation | Échéance du plan de cotisation | Wallet du membre vers wallet du groupe |
| Répartition de revenu | Revenu reçu par un utilisateur ou un groupe | Wallet de l'utilisateur ou groupe vers destinations selon les pourcentages |
| Dépense de projet | Approbation d'une dépense | Wallet lié vers bénéficiaire |
| Achat marketplace | Commande | Wallet acheteur vers wallet vendeur, commission vers la plateforme |
| Prêt | Décaissement, remboursement | Selon l'échéancier |
| Don | Don à une collecte | Wallet donateur vers wallet de la collecte |
 
**Statuts d'une transaction** : initiée, en attente, confirmée, échouée, annulée.
 
**Contrôles** : rapprochement quotidien avec Vanilla Pay, plafonds selon le niveau de vérification, détection des anomalies, alertes en cas d'écart.
 
---
 
## Exigences non fonctionnelles
 
| Domaine | Exigence |
| --- | --- |
| Sécurité | Chiffrement des données, double vérification pour les opérations sensibles, journal d'audit complet, séparation des fonds |
| Fiabilité | Aucune perte d'écriture comptable, sauvegardes, reprise après incident |
| Performance | Fonctionnement fluide sur des téléphones d'entrée de gamme et des connexions lentes |
| Usage mobile | Conception mobile d'abord, consultation hors ligne des informations clés |
| Langues | Malgache, français et anglais dès le départ |
| Devises | Ariary au départ, architecture multi-devise pour le reste |
| Notifications | Notifications dans l'application, SMS en secours pour les rappels importants |
| Conformité | Vérification d'identité, conservation des preuves, respect du cadre fixé avec Vanilla Pay |
| Évolutivité | Ajout de modules, d'opérateurs de paiement et de pays sans réécrire le cœur |

---
 
##  Modèle économique : pistes à trancher
 
| Source de revenu | Description
| --- | --- |
| Frais de transaction | Petit pourcentage sur certains mouvements (retraits, paiements)|
| Commission marketplace | Pourcentage sur chaque vente|
| Offres marketing | Posts promotionnels, boosts, campagnes et petites fonctionnalités additionnelles (comme sur https://pr.social)|
| Plugins et modules premium | Activation payante de modules pour les groupes|
| Intérêts sur les prêts | Revenus du lending|
