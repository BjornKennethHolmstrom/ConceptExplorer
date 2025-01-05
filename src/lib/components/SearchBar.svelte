<script>
  import { Search, X } from 'lucide-svelte';
  import { createEventDispatcher } from 'svelte';
  
  const dispatch = createEventDispatcher();
  
  export let placeholder = "Search concepts...";
  export let value = "";
  export let concepts = [];
  
  let showSuggestions = false;
  let selectedIndex = -1;
  let inputElement;

  $: suggestions = getSuggestions(value);

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
    ].slice(0, 6); // Limit to 6 suggestions
  }

  function handleInput(event) {
    value = event.target.value;
    selectedIndex = -1;
    showSuggestions = true;
    dispatch('search', { query: value });
  }

  function clearSearch() {
    value = "";
    showSuggestions = false;
    dispatch('search', { query: "" });
  }

  function selectSuggestion(suggestion) {
    if (suggestion.type === 'concept') {
      value = suggestion.text;
      dispatch('search', { query: suggestion.text });
    } else {
      value = suggestion.text;
      dispatch('search', { query: suggestion.text });
    }
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

  function handleBlur(event) {
    // Small delay to allow click events on suggestions
    setTimeout(() => {
      showSuggestions = false;
    }, 200);
  }
</script>

<div class="relative w-full">
  <div class="relative">
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
  </div>

  {#if showSuggestions && suggestions.length > 0}
    <div class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border">
      {#each suggestions as suggestion, i}
        <button
          class="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 {
            i === selectedIndex ? 'bg-blue-50' : ''
          } {i === 0 ? 'rounded-t-lg' : ''} {
            i === suggestions.length - 1 ? 'rounded-b-lg' : ''
          }"
          on:click={() => selectSuggestion(suggestion)}
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
