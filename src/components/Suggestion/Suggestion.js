class Suggestion {
  constructor({
    inputElement,
    queryBaseUrl,
    queryParameter,
    responsePropertyToDisplay = 'label',
    nbCaractersBeforeTrigger = 3,
    suggestionsContainerClassName = 'suggestionsContainer',
    selectedSuggestionClassName = 'selected'
  }) {
    this.inputElement = inputElement;
    this.queryBaseUrl = queryBaseUrl;
    this.queryParameter = queryParameter;
    this.responsePropertyToDisplay = responsePropertyToDisplay;
    this.nbCaractersBeforeTrigger = nbCaractersBeforeTrigger;
    this.suggestionsContainerClassName = suggestionsContainerClassName;
    this.selectedSuggestionClassName = selectedSuggestionClassName;

    this.queryTimeoutDelay = 500;
    this.queryTimeout = false;

    this.inputElement.setAttribute('autocomplete', 'off');

    this.build();
    this.keyControls();

    // stocke les données récupérées
    this.store = [];
  }

  build() {
    this.suggestionsContainer = document.createElement('div');
    this.suggestionsContainer.classList.add(this.suggestionsContainerClassName);

    // Insère le container des suggestions juste après le champ d'input
    this.inputElement.parentNode.insertBefore(this.suggestionsContainer, this.inputElement.nextSibling);

    // Supprime les suggestions au click sur la page
    document.addEventListener('click', () => {
      this.cleanSuggestionsContainer();
    });
  }

  keyControls() {
    // détecte la frappe sur l'élément input
    this.inputElement.addEventListener('keyup', event => {
      switch (event.which) {
        // arrow
        case 38: // up
          this.navigation('prev');
          return false;
        case 40: // down
          this.navigation('next');
          return false;
        case 27: // escape
          this.cleanSuggestionsContainer();
          return false;

        // text
        default:
          if (this.inputElement.value.length >= this.nbCaractersBeforeTrigger) {
            this.query(this.inputElement.value);
          } else {
            this.cleanSuggestionsContainer();
          }
          break;
      }
    });

    // détecte la frappe sur le document entier
    document.addEventListener('keyup', event => {
      switch (event.which) {
        case 9: // tab
          this.cleanSuggestionsContainer();
          break;

        default:
          break;
      }
    });
  }

  navigation(direction) {
    let highlightedSuggestionItem = this.suggestionsContainer.querySelectorAll('.' + this.selectedSuggestionClassName)[0];
    
    if (undefined !== highlightedSuggestionItem) {
      highlightedSuggestionItem.classList.remove(this.selectedSuggestionClassName);
    }

    switch (direction) {
      case 'prev':
        if (undefined === highlightedSuggestionItem) {
          highlightedSuggestionItem = this.suggestionsContainer.querySelectorAll('li:last-child')[0];
        } else if (null === highlightedSuggestionItem.previousSibling) {
          highlightedSuggestionItem = this.suggestionsContainer.querySelectorAll('li:last-child')[0];
        } else {
          highlightedSuggestionItem = highlightedSuggestionItem.previousSibling;
        }
        break;
      case 'next':
        if (undefined === highlightedSuggestionItem) {
          highlightedSuggestionItem = this.suggestionsContainer.querySelectorAll('li:first-child')[0];
        } else if (null === highlightedSuggestionItem.nextSibling) {
          highlightedSuggestionItem = this.suggestionsContainer.querySelectorAll('li:first-child')[0];
        } else {
          highlightedSuggestionItem = highlightedSuggestionItem.nextSibling;
        }
        break;
    }

    if (undefined !== highlightedSuggestionItem) {
      highlightedSuggestionItem.classList.add(this.selectedSuggestionClassName);

      // récupère les données dans le store
      const suggestionData = this.store[highlightedSuggestionItem.dataset.suggestionId];
      this.highlightSuggestion(suggestionData);
    }
  }

  query(searchTerm) {
    clearTimeout(this.queryTimeout);

    this.queryTimeout = setTimeout(() => {
      this.httpRequest = new XMLHttpRequest();

      this.httpRequest.onreadystatechange = event => {
        const current = event.currentTarget;

        if (current.readyState == 4 && current.status == 200) {
          const suggestions = JSON.parse(current.response);
          this.setSuggestions(suggestions);
        }
      };

      const queryUrl = `${this.queryBaseUrl}?${this.queryParameter}=${searchTerm}`;

      this.httpRequest.open('GET', queryUrl, true);
      this.httpRequest.send(false);
    }, this.queryTimeoutDelay);
  }

  setSuggestions(suggestions) {
    this.cleanSuggestionsContainer();

    if (!suggestions) {
      return;
    }

    const ul = document.createElement('ul');
    this.suggestionsContainer.appendChild(ul);

    this.store = suggestions.map((suggestion, index) => {
        // créé l'élément html à afficher
        const li = document.createElement('li');
        li.innerHTML = suggestion[this.responsePropertyToDisplay];
        li.dataset.suggestionId = index;

        li.addEventListener('click', () => {
          this.selectSuggestion(suggestion);
          this.cleanSuggestionsContainer();
        });

        ul.appendChild(li);

        // stocke les suggestions dans store
        suggestion.suggestionId = index;
        return suggestion;
      });
  }

  highlightSuggestion(suggestionData) {
    // émet un évènement avec les données de la suggestion sélectionnée
    let event = document.createEvent('Event');
    event.initEvent('suggestionHighlighted');
    event.suggestion = suggestionData;

    this.inputElement.dispatchEvent(event);
  }

  selectSuggestion(suggestionData) {
    // émet un évènement avec les données de la suggestion sélectionnée
    let event = document.createEvent('Event');
    event.initEvent('suggestionSelected');
    event.suggestion = suggestionData;

    this.inputElement.dispatchEvent(event);
  }

  // Vide le container de suggestions
  cleanSuggestionsContainer() {
    this.suggestionsContainer.innerHTML = '';
  }

  // créé les éléments nécessaires au fonctionnement du script
  static init(config) {
    return new Suggestion(config);
  }
}

export default Suggestion;
