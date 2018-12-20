# Scripts Opéra Énergie

Ce projet contient une collection d'outils d'aide à la création d'interface.

## Installation

Installer le package à l'aide de NPM ou de Yarn :

- Avec NPM :

```javascript
npm install opera-scripts
```

- Avec Yarn
```javascript
yarn add opera-scripts
```

## Utilisation

Les composants de ce projet sont indépendants les uns des autres et peuvent donc être utilisés séparément.

Dans le code, importer le composant à utiliser :

```javascript
import { Suggestion } from 'opera-scripts';
```

Certains composants peuvent recevoir des options qui servent d'argument lors de l'instanciation :

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

### Suggestion

#### Description

Ce composant permet d'ajouter une liste de suggestions à un champ de recherche.

Le serveur responsable du traitement de la requête doit être en mesure de réaliser la recherche à partir du nombre de caractères du terme de recherche et renvoyer une liste d'objets encodés en json.

La liste s'affiche ensuite sous le champ de recherche.

Elle peut être parcourue à l'aide des flèches du clavier.

L'utilisateur peut faire son choix parmi les suggestions, soit au clic souris, soit en appuyant sur la touche 'esc' ou 'tab'.

#### Fonctionnement

Le premier argument à passer au composant lors de son initialisation est un élément html correspondant au champ de recherche et ciblé par un sélecteur CSS (par exemple `#villes` ou `.region`).

La liste des suggestions retournée par le serveur sera convertie en simples balises `<li>`, elles-même inclues dans une balise `<ul>`.

Pour permettre d'appliquer facilement du style, la balise `<ul>` est insérée dans une balise `<div>` qui possède une classe CSS passée dans les options. Si le nom de classe n'est pas précisé, `.suggestionsContainer` sera utilisé.

Le script injecte également la propriété `autocomplete="off"` à la balise `input` afin d'éviter des conflits éventuels.

Afin de pouvoir récupérer les données des suggestions pour soumettre le formulaire final, le serveur doit ajouter des propriétés à l'objet json retourné. Par défaut ces propriétés sont `value` et `label` mais ces valeurs peuvent être modifiées via les options.

Une fois que le serveur aura répondu à la requête de recherche, le DOM sera modifié :

```html
<input type="text" id="comments" autocomplete="off">
<div class="suggestionsContainer">
    <ul>
        <li data-value="1">id labore ex et quam laborum</li>
        <li data-value="2">quo vero reiciendis velit similique earum</li>
        <li data-value="3">odio adipisci rerum aut animi</li>
        <li data-value="4">alias odio sit</li>
        <li data-value="5">vero eaque aliquid doloribus et culpa</li>
    </ul>
</div>
```
