class Suggestion {
  constructor({ inputElement, queryBaseUrl, queryParameter, nbCaractersBeforeTrigger = 3 }) {
    this.inputElement = inputElement;
    this.queryBaseUrl = queryBaseUrl;
    this.queryParameter = queryParameter;
    this.nbCaractersBeforeTrigger = nbCaractersBeforeTrigger;

    this.queryTimeoutDelay = 500;
    this.queryTimeout = false;

    this.suggestionsContainerClassName = 'suggestionsContainer';
    this.selectedSuggestionClassName = 'highlighted';
    this.inputElement.setAttribute('autocomplete', 'off');

    this.build();
    this.keyControls();
  }

  build() {
    this.suggestionsContainer = document.createElement('div');
    this.suggestionsContainer.classList.add(this.suggestionsContainerClassName);

    // Insère le container des suggestions juste après le champ d'input
    this.inputElement.parentNode.insertBefore(this.suggestionsContainer, this.inputElement.nextSibling);

    // Supprime les suggestions au click sur la page
    document.addEventListener('click', () => {
      // this.cleanSuggestionsContainer();
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
    let highlightedSuggestion = this.suggestionsContainer.querySelectorAll('.' + this.selectedSuggestionClassName)[0];
    if (undefined !== highlightedSuggestion) {
      highlightedSuggestion.classList.remove(this.selectedSuggestionClassName);
    }
    switch (direction) {
      case 'prev':
        if (undefined === highlightedSuggestion) {
          highlightedSuggestion = this.suggestionsContainer.querySelectorAll('li:last-child')[0];
        } else if (null === highlightedSuggestion.previousSibling) {
          highlightedSuggestion = this.suggestionsContainer.querySelectorAll('li:last-child')[0];
        } else {
          highlightedSuggestion = highlightedSuggestion.previousSibling;
        }
        break;
      case 'next':
        if (undefined === highlightedSuggestion) {
          highlightedSuggestion = this.suggestionsContainer.querySelectorAll('li:first-child')[0];
        } else if (null === highlightedSuggestion.nextSibling) {
          highlightedSuggestion = this.suggestionsContainer.querySelectorAll('li:first-child')[0];
        } else {
          highlightedSuggestion = highlightedSuggestion.nextSibling;
        }
        break;
    }
    if (undefined !== highlightedSuggestion) {
      highlightedSuggestion.classList.add(this.selectedSuggestionClassName);
      this.selectSuggestion(highlightedSuggestion);
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

    suggestions.forEach(suggestion => {
      const li = document.createElement('li');
      li.innerHTML = suggestion.label;
      li.dataset.value = suggestion.value;

      li.addEventListener('click', event => {
        this.selectSuggestion(event.currentTarget);
        this.cleanSuggestionsContainer();
      });

      ul.appendChild(li);
    });
  }

  selectSuggestion(selectedSuggestion) {
    this.inputElement.value = selectedSuggestion.dataset.value;
  }

  // Vide le container de suggestions
  cleanSuggestionsContainer() {
    this.suggestionsContainer.innerHTML = '';
  }
}

export default Suggestion;
