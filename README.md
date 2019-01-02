# Opéra Énergie - UI Modules

Ce projet contient une collection d'outils d'aide à la création d'interface.

## Installation

Installer le package :

- Avec NPM :

```javascript
npm install ui-modules
```

- Avec Yarn :
```javascript
yarn add ui-modules
```

## Utilisation

Les composants de ce projet sont indépendants les uns des autres et peuvent donc être utilisés séparément.

Dans le code, importer le composant à utiliser :

```javascript
import { Suggestion } from 'ui-modules';
```

Certains composants peuvent recevoir des options qui servent d'argument lors de l'instanciation, par exemple pour le composant Suggestion :

```javascript
const config = {
    inputElement: document.querySelector('#comments'),
    queryBaseUrl: 'https://jsonplaceholder.typicode.com/comments',
    queryParameter: 'postId',
    responsePropertyToGetLabelFrom: 'name',
    responsePropertyToGetValueFrom: 'id',
    nbCaractersBeforeTrigger: 1
}

Suggestion.init(config);
```

## Liste des scripts

[Suggestion](./doc/Suggestion.md)