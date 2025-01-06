<!-- SearchBar.svelte -->
<script>
  import { Search, X, Dices } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();
  
  export let placeholder = "Search concepts...";
  export let value = "";
  export let concepts = [];
  
  let showSuggestions = false;
  let selectedIndex = -1;
  let inputElement;
  let suggestionsDiv;

  $: suggestions = getSuggestions(value);

  function handleRandom() {
    const randomIndex = Math.floor(Math.random() * concepts.length);
    const randomConcept = concepts[randomIndex];
    value = randomConcept.name;
    dispatch('search', { query: value });
  }

  function getSuggestions(query) {
    if (!query.trim()) return [];
    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    
    // Get matching concepts
    const matchingConcepts = concepts.filter(concept => {
      const searchableText = [
        concept.name,
        ...concept.tags,
        concept.primary_category
      ].join(' ').toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });

    // Get matching tags
    const allTags = new Set(concepts.flatMap(c => c.tags));
    const matchingTags = Array.from(allTags).filter(tag =>
      tag.toLowerCase().includes(query.toLowerCase())
    );

    return [
      ...matchingConcepts.map(c => ({
        type: 'concept',
        text: c.name,
        category: c.primary_category
      })),
      ...matchingTags.map(t => ({
        type: 'tag',
        text: t
      }))
    ].slice(0, 6);
  }

  function handleInput(event) {
    value = event.target.value;
    selectedIndex = -1;
    showSuggestions = true;
    dispatch('search', { query: value });
    console.log('Suggestions:', suggestions); // Debug log
  }

  function clearSearch() {
    value = "";
    showSuggestions = false;
    dispatch('search', { query: "" });
  }

  function selectSuggestion(suggestion) {
    if (suggestion.type === 'concept') {
      value = suggestion.text;
    } else {
      value = suggestion.text;
    }
    dispatch('search', { query: value });
    showSuggestions = false;
  }

  function handleKeydown(event) {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex = (selectedIndex + 1) % suggestions.length;
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex = selectedIndex <= 0 ? suggestions.length - 1 : selectedIndex - 1;
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          event.preventDefault();
          selectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        showSuggestions = false;
        break;
    }
  }

  function handleBlur() {
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => {
      showSuggestions = false;
    }, 200);
  }
</script>

<div class="relative w-full flex gap-2">
  <div class="relative flex-grow">
    <input
      bind:this={inputElement}
      type="text"
      {placeholder}
      {value}
      on:input={handleInput}
      on:keydown={handleKeydown}
      on:blur={handleBlur}
      autocomplete="off"
      class="w-full pl-10 pr-10 py-2 bg-white border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-shadow"
    />
    <Search 
      size={18} 
      class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />
    {#if value}
      <button
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        on:click={clearSearch}
      >
        <X size={18} />
      </button>
    {/if}

    {#if showSuggestions && suggestions.length > 0}
      <div 
        bind:this={suggestionsDiv}
        class="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border overflow-hidden suggestions-container"
        style="top: calc(100% + 0.25rem);"
      >
        {#each suggestions as suggestion, i}
          <button
            class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 {
              i === selectedIndex ? 'bg-blue-50' : ''
            } {i === 0 ? 'rounded-t-lg' : ''} {
              i === suggestions.length - 1 ? 'rounded-b-lg' : ''
            }"
            on:mousedown|preventDefault={() => selectSuggestion(suggestion)}
          >
            {#if suggestion.type === 'concept'}
              <span class="flex-grow">{suggestion.text}</span>
              <span class="text-sm text-gray-500">{suggestion.category}</span>
            {:else}
              <span class="px-2 py-0.5 bg-gray-100 rounded-full text-sm">
                {suggestion.text}
              </span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <button
    class="p-2 bg-white border rounded-lg hover:bg-gray-50 text-gray-600 hover:text-blue-600 transition-colors flex items-center justify-center tooltip-container"
    on:click={handleRandom}
  >
    <Dices size={20} />
    <span class="tooltip">Random concept</span>
  </button>
</div>

<style>
  .suggestions-container {
    z-index: 50;  /* Ensure this is high enough */
    position: absolute;
    width: 100%;
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    margin-top: 0.25rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .tooltip-container {
    position: relative;
  }

  .tooltip {
    visibility: hidden;
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    margin-top: 4px;
    z-index: 50;
  }

  .tooltip-container:hover .tooltip {
    visibility: visible;
  }
</style>
