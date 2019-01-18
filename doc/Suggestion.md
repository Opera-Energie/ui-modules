# Suggestion

## Description

Ce composant permet d'ajouter une liste de suggestions à un champ de recherche.

Le serveur doit pouvoir traiter la requête en fonction du nombre de caractères fournis et renvoyer une liste d'objets encodés en json.

La liste s'affichera sous le champ de recherche et pourra être parcourue à l'aide des flèches du clavier.

## Fonctionnement

Pour initialiser le composant `Suggestion`, il faut lui fournir trois arguments obligatoires :

`Suggestion.init({ inputElement, queryBaseUrl, queryParameter });` :

- `inputElement` : un sélecteur css correspondant au champ de recherche (par exemple `#villes` ou `.region`).
- `queryBaseUrl` : l'url du serveur qui doit retourner le résultat de la recherche
- `queryParameter` : le paramètre de recherche (qui sera ajouté à l'url)

Le composant `Suggestion` va créer une balise `<div class=".suggestionsContainer">` contenant la liste (`<ul>`) des éléments retournés par le serveur.

_A noter :_
_le composant `Suggestion` injecte également la propriété `autocomplete="off"` à la balise `input` afin d'éviter des conflits éventuels._

Afin que l'utilisateur puisse récupérer les données des suggestions, le serveur doit ajouter une propriété à l'objet json retourné. Par défaut cette propriété est `label` (elle peut être modifiée via l'option `responsePropertyToDisplay`).

Exemple après exécution d'une recherche :

```html
<input type="text" id="comments" autocomplete="off">
<div class="suggestionsContainer">
    <ul>
        <li class="selected" data-suggestion-id="0">id labore ex et quam laborum</li>
        <li data-suggestion-id="2">quo vero reiciendis velit similique earum</li>
        <li data-suggestion-id="3">odio adipisci rerum aut animi</li>
        <li data-suggestion-id="4">alias odio sit</li>
        <li data-suggestion-id="5">vero eaque aliquid doloribus et culpa</li>
    </ul>
</div>
```

### Les options

#### responsePropertyToDisplay

Il s'agit du nom de la propriété de l'objet json renvoyé par le serveur qui doit contenir le texte à afficher comme suggestion.

La valeur par défaut est `label`.

Exemple : 
```json
{
    "0": {
        "label":"Paris",
        "habitants":"2 200 000"
        ...
    },
    "1": {
        "label":"Lyon",
        "habitants":"500 700"
        ...
    },
}
```

#### nbCaractersBeforeTrigger

Pour limiter le nombre de requêtes au serveur, on peut déterminer le nombre de caractères à partir duquel la recherche est effectivement envoyée.

La valeur par défaut est `3`.

#### suggestionsContainerClassName

Il s'agit du nom de la classe de l'élément html contenant les suggestions. Il peut notamment être utilisé pour styler les différents éléments.

La valeur par défaut est `suggestionsContainer`.

#### selectedSuggestionClassName

Il s'agit du nom de la classe de la suggestion sélectionnée.

La valeur par défaut est `selected`.

### Récupérer les données

Le composant `Suggestion` réagit à deux évènements : le surlignement d'un élément dans la liste des suggestions et la sélection d'une suggestion.

Les évènements à écouter sont respectivement `suggestionHighlighted` et `suggestionSelected`.

Les données retournées par le serveur sont disponibles dans la propriété `suggestion` de l'objet `event`.

## Exemple d'utilisation

```javascript
import { Suggestion } from 'ui-modules';

const inputElement = document.querySelector('#comments');

inputElement.addEventListener('suggestionHighlighted', (event) => {
    console.log(event.suggestion);
});

inputElement.addEventListener('suggestionSelected', (event) => {
    console.log(event.suggestion);
});

const config = {
    inputElement,
    queryBaseUrl: 'https://jsonplaceholder.typicode.com/comments',
    queryParameter: 'postId',
    responsePropertyToDisplay: 'name',
    nbCaractersBeforeTrigger: 1
}

Suggestion.init(config);
```