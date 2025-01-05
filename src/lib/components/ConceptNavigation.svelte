<script>
  import { Filter, Tags, FolderOpen } from 'lucide-svelte';

  // Props
  export let concepts = [];
  export let onFilterChange = () => {};

  // State
  let selectedTags = new Set();
  let selectedCategory = '';
  let showTagFilters = false;

  // Computed values
  $: allTags = new Set(
    concepts.flatMap(concept => concept.tags)
    .sort((a, b) => a.localeCompare(b))
  );

  $: allCategories = new Set(
    concepts.flatMap(concept => [
      concept.primary_category,
      ...concept.secondary_categories
    ]).sort((a, b) => a.localeCompare(b))
  );

  // Methods
  function toggleTag(tag) {
    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
    } else {
      selectedTags.add(tag);
    }
    selectedTags = selectedTags; // Trigger reactivity
    updateFilters();
  }

  function selectCategory(category) {
    selectedCategory = category === selectedCategory ? '' : category;
    updateFilters();
  }

  function updateFilters() {
    onFilterChange({
      tags: Array.from(selectedTags),
      category: selectedCategory
    });
  }

  function clearFilters() {
    selectedTags.clear();
    selectedTags = selectedTags;
    selectedCategory = '';
    updateFilters();
  }
</script>

<div class="w-full bg-white rounded-lg shadow-md p-3 sticky top-4">
  <!-- Category Selection -->
  <div class="mb-6">
    <div class="flex items-center gap-2 mb-3">
      <FolderOpen size={18} />
      <h2 class="text-lg font-semibold">Categories</h2>
    </div>
    <div class="space-y-2">
      {#each Array.from(allCategories) as category}
        <button
          class="w-full text-left px-3 py-2 rounded-md transition-colors {
            selectedCategory === category
              ? 'bg-blue-100 text-blue-700'
              : 'hover:bg-gray-100'
          }"
          on:click={() => selectCategory(category)}
        >
          {category}
        </button>
      {/each}
    </div>
  </div>

  <!-- Tag Filtering -->
  <div class="mb-4">
    <button
      class="flex items-center gap-2 mb-3 hover:text-blue-600 transition-colors"
      on:click={() => showTagFilters = !showTagFilters}
    >
      <Tags size={18} />
      <h2 class="text-lg font-semibold">Tags</h2>
      <span class="ml-auto text-sm text-gray-500">
        {selectedTags.size} selected
      </span>
    </button>
    
    {#if showTagFilters}
      <div class="space-y-2">
        {#each Array.from(allTags) as tag}
          <button
            class="flex items-center w-full px-3 py-2 rounded-md transition-colors {
              selectedTags.has(tag)
                ? 'bg-blue-100 text-blue-700'
                : 'hover:bg-gray-100'
            }"
            on:click={() => toggleTag(tag)}
          >
            <span class="flex-grow text-left">{tag}</span>
            {#if selectedTags.has(tag)}
              <span class="text-blue-600">✓</span>
            {/if}
          </button>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Active Filters Summary -->
  {#if selectedTags.size > 0 || selectedCategory}
    <div class="border-t pt-4">
      <div class="flex items-center gap-2 mb-3">
        <Filter size={18} />
        <h2 class="text-lg font-semibold">Active Filters</h2>
        <button
          class="ml-auto text-sm text-red-600 hover:text-red-700"
          on:click={clearFilters}
        >
          Clear all
        </button>
      </div>
      <div class="flex flex-wrap gap-2">
        {#if selectedCategory}
          <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {selectedCategory}
          </span>
        {/if}
        {#each Array.from(selectedTags) as tag}
          <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {tag}
          </span>
        {/each}
      </div>
    </div>
  {/if}
</div>
