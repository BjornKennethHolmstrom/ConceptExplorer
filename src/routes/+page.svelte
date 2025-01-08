<script>
  import { messages } from '../lib/stores/messages.js';
  import { currentConceptName } from '../lib/stores/conceptStore.js';
  import ConceptCard from '../lib/components/ConceptCard.svelte';
  import ConceptNavigation from '../lib/components/ConceptNavigation.svelte';
  import ResultsHeader from '../lib/components/ResultsHeader.svelte';
  import SearchBar from '../lib/components/SearchBar.svelte';
  import { ArrowUpDown, ChevronDown, X } from 'lucide-svelte';
  import { onMount } from 'svelte';   // Check localStorage on mount

  let activeFilters = { tags: [], categories: [] };
  let currentSortMethod = 'alphabetical';
  let searchQuery = "";
  let showTip = true;
  
  const sortMethods = [
    { id: 'alphabetical', name: 'Alphabetical (A-Z)' },
    { id: 'chronological', name: 'Chronological' }
  ];

  // Search function
  function searchConcepts(concepts, query) {
    if (!query.trim()) return concepts;
    
    const searchTerms = query.toLowerCase().split(' ').filter(Boolean);
    
    return concepts.filter(concept => {
      const searchableText = [
        concept.name,
        concept.core_description,
        concept.positive_aspect,
        concept.negative_aspect,
        concept.historical_context,
        ...concept.tags,
        concept.primary_category,
        ...concept.secondary_categories,
        ...concept.modern_applications
      ].join(' ').toLowerCase();

      return searchTerms.every(term => searchableText.includes(term));
    });
  }

  // Handle search
  function handleSearch({ detail }) {
    searchQuery = detail.query;
  }

  function normalizeYear(year) {
      if (year === "Ancient") return -Infinity;
      if (year === "Prehistoric") return -Infinity; // Handle other similar cases
      return year || 9999; // Default for undefined years
  }

  function sortConcepts(concepts, sortMethod = currentSortMethod) {
      switch (sortMethod) {
          case 'alphabetical':
              return [...concepts].sort((a, b) => a.name.localeCompare(b.name));
          case 'chronological':
              return [...concepts].sort((a, b) => normalizeYear(a.year_emerged) - normalizeYear(b.year_emerged));
          default:
              return concepts;
      }
  }




  function filterConcepts({ tags, categories }) {
    activeFilters = { tags, categories };
    if ($currentConceptName) {
      currentConceptName.set(null);
    }
  }

  function clearAllFilters() {
    activeFilters = { tags: [], categories: [] };
    searchQuery = "";
    filterConcepts(activeFilters);
  }

  // First, handle filtering
  $: filteredConcepts = $messages.concepts ? 
    $currentConceptName ?
      [$messages.concepts.find(c => c.name === $currentConceptName)].filter(Boolean) :
      $messages.concepts.filter(concept => {
        // Category filter
        if (activeFilters.categories.length > 0) {
          const inPrimaryCategory = activeFilters.categories.includes(concept.primary_category);
          const inSecondaryCategories = concept.secondary_categories.some(cat => 
            activeFilters.categories.includes(cat)
          );
          if (!inPrimaryCategory && !inSecondaryCategories) {
            return false;
          }
        }
        
        // Tag filter
        if (activeFilters.tags.length > 0) {
          return activeFilters.tags.every(tag => concept.tags.includes(tag));
        }
        
        return true;
      })
    : [];

  // Then, apply search and sorting
  $: searchedAndFilteredConcepts = searchConcepts(filteredConcepts, searchQuery);
  $: finalConcepts = sortConcepts(searchedAndFilteredConcepts, currentSortMethod);

  onMount(() => {
    const tipDismissed = localStorage.getItem('tipDismissed');
    if (tipDismissed === 'true') {
      showTip = false;
    }
  });

  function dismissTip() {
    showTip = false;
    localStorage.setItem('tipDismissed', 'true');
  }
</script>

<div class="min-h-screen bg-gray-50 p-4">
  <div class="max-w-[2000px] mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-6">
      <!-- Navigation Sidebar -->
      <aside class="md:col-span-2 lg:col-span-2">
        <div class="sticky top-4 h-[calc(100vh-2rem)] overflow-y-auto">
          <!-- Sort Method Selector -->
          <div class="bg-white rounded-lg shadow-md p-3 mb-4">
            <div class="flex items-center gap-2 mb-3">
              <ArrowUpDown size={18} />
              <h2 class="text-lg font-semibold">Sort By</h2>
            </div>
            <div class="space-y-2">
              {#each sortMethods as method}
                <button
                  class="w-full text-left px-3 py-2 rounded-md transition-colors {
                    currentSortMethod === method.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }"
                  on:click={() => currentSortMethod = method.id}
                >
                  {method.name}
                </button>
              {/each}
            </div>
          </div>

          <!-- Navigation Component -->
          <ConceptNavigation 
            concepts={$messages.concepts ?? []} 
            onFilterChange={filterConcepts}
          />
          
          {#if $currentConceptName}
            <div class="mt-4 mb-4">
              <button
                class="w-full px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                on:click={() => {
                  currentConceptName.set(null);
                }}
              >
                ← Back to all concepts
              </button>
            </div>
          {/if}
        </div>
      </aside>

      <!-- Main Content -->
      <main class="md:col-span-4 lg:col-span-6">
        <div class="mb-4">
          <SearchBar 
            value={searchQuery}
            concepts={$messages.concepts ?? []}
            on:search={handleSearch}
            placeholder="Search concepts by name, description, tags..."
          />
          {#if showTip}
            <div class="mt-2 flex items-center justify-begin gap-2">
              <p class="text-sm text-gray-500 flex items-center gap-1">
                <span>Click</span>
                <ChevronDown size={16} class="text-gray-400" />
                <span>on any concept card to expand it and see more details</span>
              </p>
              <button
                class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                on:click={dismissTip}
                aria-label="Dismiss tip"
              >
                <X size={14} />
              </button>
            </div>
          {/if}
        </div>

        <ResultsHeader 
          resultCount={finalConcepts.length}
          {activeFilters}
          {currentSortMethod}
          onClearFilters={clearAllFilters}
        />

        {#if finalConcepts.length > 0}
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {#each finalConcepts as concept (concept.name)}
              <ConceptCard {concept} />
            {/each}
          </div>
        {:else}
          <div class="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 class="text-xl font-semibold text-gray-700 mb-2">
              No concepts found
            </h2>
            <p class="text-gray-600">
              {searchQuery 
                ? "Try different search terms or "
                : "Try adjusting your filters or "}
              <button
                class="text-blue-600 hover:text-blue-700"
                on:click={clearAllFilters}
              >
                clear all filters
              </button>
            </p>
          </div>
        {/if}
      </main>
    </div>
  </div>
</div>

<style>
  /* Hide scrollbar for Chrome, Safari and Opera */
  .overflow-y-auto::-webkit-scrollbar {
    display: none;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  .overflow-y-auto {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
  }
</style>
