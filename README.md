# Nom du Projet

Ce projet est un template de démarrage pour des applications web utilisant React, TypeScript, Vite.js, Tailwind CSS, ESLint, et Prettier. Il est conçu pour accélérer le développement de sites vitrines ou d'applications web en fournissant une base configurée et prête à l'emploi.

## Fonctionnalités

- **React** : Une bibliothèque JavaScript pour construire des interfaces utilisateur.
- **TypeScript** : Un langage de programmation typé basé sur JavaScript.
- **Vite.js** : Un outil de construction rapide pour les projets web modernes.
- **Tailwind CSS** : Un framework CSS utility-first pour un design rapide et réactif.
- **ESLint** : Un outil d'analyse de code pour identifier les problèmes de pattern dans le code JavaScript/TypeScript.
- **Prettier** : Un formatteur de code pour maintenir un style de code cohérent.

## Comment utiliser ce template

1. Clonez ce repository pour démarrer votre nouveau projet.
2. Installez les dépendances en exécutant `npm install`.
3. Personnalisez le `tailwind.config.js` et le `.prettierrc` selon vos préférences de style.
4. Démarrez le serveur de développement en exécutant `npm run dev`.

## Éléments à Supprimer ou à Personnaliser

- **Pages et Composants de Démonstration** : Supprimez ou remplacez les fichiers dans `src/pages` qui servent d'exemples.
- **Configuration Tailwind** : Modifiez `tailwind.config.js` pour personnaliser le thème selon les besoins de votre projet.
- **Fichiers de Configuration ESLint et Prettier** : Ajustez `.eslintrc.json` et `.prettierrc` selon les règles de style de votre équipe.

## Automatisation de la Suppression

Pour automatiser la suppression des fichiers spécifiques au template et préparer le projet pour un nouveau répo git, vous pouvez créer un script `setup.sh` :

```bash
#!/bin/bash

# Suppression des fichiers/dossiers d'exemple
rm -rf src/pages/ExamplePage.tsx src/components/ExampleComponent.tsx

# Initialisation d'un nouveau dépôt Git
rm -rf .git
git init
git add .
git commit -m "Initial commit"

# Instructions supplémentaires
echo "Template prêt. N'oubliez pas de personnaliser votre README.md et les autres fichiers de configuration selon les besoins de votre projet."
```

N'oubliez pas de donner les droits d'exécution à votre script : `chmod +x setup.sh`

## Contribution

- Si vous souhaitez contribuer à l'amélioration de ce template, vos Pull Requests sont les bienvenues. Pour des modifications majeures, veuillez ouvrir une issue d'abord pour discuter de ce que vous aimeriez changer.

