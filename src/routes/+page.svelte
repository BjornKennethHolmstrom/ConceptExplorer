<script>
  import { messages } from '../lib/stores/messages.js';
  import { currentConceptName } from '../lib/stores/conceptStore.js';
  import ConceptCard from '../lib/components/ConceptCard.svelte';
  import ConceptNavigation from '../lib/components/ConceptNavigation.svelte';

  let activeFilters = { tags: [], category: '' };

  function filterConcepts({ tags, category }) {
    activeFilters = { tags, category };
    if ($currentConceptName) {
      currentConceptName.set(null);
    }
  }

  $: filteredConcepts = $messages.concepts ? 
    $currentConceptName ?
      [$messages.concepts.find(c => c.name === $currentConceptName)].filter(Boolean) :
      $messages.concepts.filter(concept => {
        // Category filter
        if (activeFilters.category && 
            concept.primary_category !== activeFilters.category && 
            !concept.secondary_categories.includes(activeFilters.category)) {
          return false;
        }
        
        // Tag filter
        if (activeFilters.tags.length > 0) {
          return activeFilters.tags.every(tag => concept.tags.includes(tag));
        }
        
        return true;
      })
    : [];
</script>

<div class="min-h-screen bg-gray-50 p-4">
  <div class="max-w-[2000px] mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-8 gap-6">
      <!-- Navigation Sidebar -->
      <aside class="md:col-span-2 lg:col-span-2">
        <div class="sticky top-4">
          <ConceptNavigation 
            concepts={$messages.concepts ?? []} 
            onFilterChange={filterConcepts}
          />
          
          {#if $currentConceptName}
            <div class="mt-4">
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
        {#if filteredConcepts.length > 0}
          <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {#each filteredConcepts as concept (concept.name)}
              <ConceptCard {concept} />
            {/each}
          </div>
        {:else}
          <div class="bg-white rounded-lg shadow-md p-8 text-center">
            <h2 class="text-xl font-semibold text-gray-700 mb-2">
              No concepts found
            </h2>
            <p class="text-gray-600">
              Try adjusting your filters to see more concepts.
            </p>
          </div>
        {/if}
      </main>
    </div>
  </div>
</div>

<style>
  /* Global styles can be added here if needed */
</style>
