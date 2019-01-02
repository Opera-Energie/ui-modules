# Suggestion

## Description

Ce composant permet d'ajouter une liste de suggestions à un champ de recherche.

Le serveur doit pouvoir traiter la requête en fonction du nombre de caractères fournis et renvoyer une liste d'objets encodés en json.

La liste s'affichera sous le champ de recherche et pourra être parcourue à l'aide des flèches du clavier.

## Fonctionnement

Pour initialiser le composant `Suggestion`, il faut lui fournir trois arguments obligatoires :

`Suggestion.init({inputElement, queryBaseUrl, queryParameter});` :

- `inputElement` : un sélecteur css correspondant au champ de recherche (par exemple `#villes` ou `.region`).
- `queryBaseUrl` : l'url du serveur qui doit retourner le résultat de la recherche
- `queryParameter` : le paramètre de recherche (qui sera ajouté à l'url)

Le composant `Suggestion` va créer une balise `<div class=".suggestionsContainer">` contenant la liste (`<ul>`) des éléments retournés par le serveur.

_A noter :_
_le composant `Suggestion` injecte également la propriété `autocomplete="off"` à la balise `input` afin d'éviter des conflits éventuels._

Afin de pouvoir récupérer les données des suggestions pour soumettre le formulaire final, le serveur doit ajouter des propriétés à l'objet json retourné. Par défaut ces propriétés sont `value` et `label` mais ces valeurs peuvent être modifiées via des options.

Exemple après exécution d'une recherche :

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

### Les options

#### responsePropertyToGetLabelFrom

Il s'agit du nom de la propriété renvoyée par le serveur qui doit contenir le texte à afficher comme suggestion.

La valeur par défaut est `label`.

#### responsePropertyToGetValueFrom

Il s'agit du nom de la propriété renvoyée par le serveur qui correspond à la valeur de la suggestion.

La valeur par défaut est `value`.

#### nbCaractersBeforeTrigger

Pour limiter le nombre de requêtes au serveur, on peut déterminer le nombre de caractères à partir duquel la recherche est effectivement envoyée.

La valeur par défaut est `3`.

#### suggestionsContainerClassName

Il s'agit du nom de la classe de l'élément contenant les suggestions. Il est notamment utile pour le style des différents éléments.

La valeur par défaut est `suggestionsContainer`.

#### selectedSuggestionClassName

Il s'agit du nom de la classe de la suggestion sélectionnée.

La valeur par défaut est `selected`.
