<script>
  import { ArrowDown, X, Filter } from 'lucide-svelte';

  export let resultCount;
  export let activeFilters;
  export let currentSortMethod;
  export let onClearFilters;

  const sortMethodNames = {
    'alphabetical': 'A-Z',
    'chronological': 'Timeline'
  };
</script>

<div class="sticky top-0 bg-white/80 backdrop-blur-sm shadow-sm p-3 mb-4 rounded-lg">
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <span class="font-medium">{resultCount} concepts</span>
      
      {#if activeFilters.categories.length > 0 || activeFilters.tags.length > 0}
        <div class="flex items-center gap-2">
          <Filter size={16} class="text-blue-600" />
          <div class="flex flex-wrap gap-2">
            {#each activeFilters.categories as category}
              <span class="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-sm">
                {category}
              </span>
            {/each}
            {#each activeFilters.tags as tag}
              <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-sm">
                {tag}
              </span>
            {/each}
          </div>
        </div>
      {/if}
      
      <span class="text-gray-500">
        Sorted: {sortMethodNames[currentSortMethod]}
      </span>
    </div>

    {#if activeFilters.categories.length > 0 || activeFilters.tags.length > 0}
      <button
        class="text-sm text-red-600 hover:text-red-700 flex items-center gap-1"
        on:click={onClearFilters}
      >
        <X size={14} />
        Clear filters
      </button>
    {/if}
  </div>
</div>
