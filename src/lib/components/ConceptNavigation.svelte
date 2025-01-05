<script>
  import { Filter, Tags, FolderOpen, ChevronDown, ChevronRight } from 'lucide-svelte';

  // Props
  export let concepts = [];
  export let onFilterChange = () => {};

  // State
  let selectedTags = new Set();
  let selectedCategories = new Set();
  let showTagFilters = false;
  let expandedGroups = new Set(['Philosophical', 'Political']); // Default expanded groups

  // Category groups mapping
  const categoryGroups = {
    'Philosophical': [
      'Philosophical Movements',
      'Ethical Systems',
      'Epistemology',
      'Metaphysical Systems'
    ],
    'Political': [
      'Political Ideologies',
      'Political Systems',
      'Governance Models'
    ],
    'Scientific': [
      'Scientific Theories',
      'Scientific Methods',
      'Technology Frameworks',
      'Systems Theory'
    ],
    'Cultural': [
      'Cultural Movements',
      'Social Movements',
      'Religious Traditions',
      'Art Theory'
    ],
    'Methodological': [
      'Research Methods',
      'Knowledge Systems',
      'Analytical Frameworks',
      'Critical Theories'
    ]
  };

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

  // Get categories for a group
  function getCategoriesInGroup(group) {
    return categoryGroups[group].filter(cat => allCategories.has(cat));
  }

  // Check if a group has any matching categories
  function groupHasCategories(group) {
    return getCategoriesInGroup(group).length > 0;
  }

  // Toggle group expansion
  function toggleGroup(group) {
    if (expandedGroups.has(group)) {
      expandedGroups.delete(group);
    } else {
      expandedGroups.add(group);
    }
    expandedGroups = expandedGroups; // Trigger reactivity
  }

  // Methods
  function toggleTag(tag) {
    if (selectedTags.has(tag)) {
      selectedTags.delete(tag);
    } else {
      selectedTags.add(tag);
    }
    selectedTags = selectedTags;
    updateFilters();
  }

  function toggleCategory(category) {
    if (selectedCategories.has(category)) {
      selectedCategories.delete(category);
    } else {
      selectedCategories.add(category);
    }
    selectedCategories = selectedCategories;
    updateFilters();
  }

  function updateFilters() {
    onFilterChange({
      tags: Array.from(selectedTags),
      categories: Array.from(selectedCategories)
    });
  }

  function clearFilters() {
    selectedTags.clear();
    selectedCategories.clear();
    selectedTags = selectedTags;
    selectedCategories = selectedCategories;
    updateFilters();
  }
</script>

<div class="w-full bg-white rounded-lg shadow-md p-3">
  <!-- Category Groups -->
  <div class="mb-6">
    <div class="flex items-center gap-2 mb-3">
      <FolderOpen size={18} />
      <h2 class="text-lg font-semibold">Categories</h2>
      {#if selectedCategories.size > 0}
        <span class="ml-auto text-sm text-gray-500">
          {selectedCategories.size} selected
        </span>
      {/if}
    </div>

    <div class="space-y-2">
      {#each Object.entries(categoryGroups) as [group, _], i (group)}
        {#if groupHasCategories(group)}
          <div class="border rounded-md overflow-hidden">
            <button
              class="w-full px-3 py-2 text-left bg-gray-50 hover:bg-gray-100 flex items-center justify-between"
              on:click={() => toggleGroup(group)}
            >
              <span class="font-medium">{group}</span>
              {#if expandedGroups.has(group)}
                <ChevronDown size={16} />
              {:else}
                <ChevronRight size={16} />
              {/if}
            </button>

            {#if expandedGroups.has(group)}
              <div class="py-1">
                {#each getCategoriesInGroup(group) as category}
                  <button
                    class="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between {
                      selectedCategories.has(category)
                        ? 'text-blue-700 bg-blue-50 hover:bg-blue-50'
                        : ''
                    }"
                    on:click={() => toggleCategory(category)}
                  >
                    <span class="text-sm">{category}</span>
                    {#if selectedCategories.has(category)}
                      <span class="text-blue-600">✓</span>
                    {/if}
                  </button>
                {/each}
              </div>
            {/if}
          </div>
        {/if}
      {/each}
    </div>
  </div>

  <!-- Tag Filtering -->
  <div class="mb-4">
    <button
      class="flex items-center gap-2 mb-3 hover:text-blue-600 transition-colors w-full"
      on:click={() => showTagFilters = !showTagFilters}
    >
      <Tags size={18} />
      <h2 class="text-lg font-semibold">Tags</h2>
      <span class="ml-auto text-sm text-gray-500">
        {selectedTags.size} selected
      </span>
      {#if selectedTags.size > 0 || showTagFilters}
        <ChevronDown size={16} />
      {:else}
        <ChevronRight size={16} />
      {/if}
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
  {#if selectedTags.size > 0 || selectedCategories.size > 0}
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
        {#each Array.from(selectedCategories) as category}
          <span class="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            {category}
          </span>
        {/each}
        {#each Array.from(selectedTags) as tag}
          <span class="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
            {tag}
          </span>
        {/each}
      </div>
    </div>
  {/if}
</div>
