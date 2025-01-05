<script>
  import { Link, ExternalLink } from 'lucide-svelte';
  import { currentConceptName, getConceptByName } from '../stores/conceptStore';
  
  export let relatedConcepts = [];
  export let onNavigate = () => {};

  // Get preview data for each related concept
  $: relatedConceptsData = relatedConcepts.map(name => {
    const concept = getConceptByName(name);
    return {
      name,
      description: concept?.core_description || 'Concept not found',
      primary_category: concept?.primary_category || 'Unknown Category',
      tags: concept?.tags || []
    };
  });
</script>

<div class="space-y-4">
  <div class="flex items-center gap-2 text-gray-700">
    <Link size={18} />
    <h4 class="font-medium">Related Concepts</h4>
  </div>

  <div class="grid gap-3">
    {#each relatedConceptsData as concept}
      <button
        class="group relative w-full text-left p-3 rounded-lg border hover:border-blue-300 hover:shadow-sm transition-all bg-white"
        on:click={() => onNavigate(concept.name)}
      >
        <div class="flex items-start justify-between">
          <div>
            <div class="flex items-center gap-2">
              <span class="font-medium">{concept.name}</span>
              <ExternalLink size={14} class="opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <p class="text-sm text-gray-600 line-clamp-2 mt-1">
              {concept.description}
            </p>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-2 mt-2">
          <span class="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
            {concept.primary_category}
          </span>
          {#each concept.tags.slice(0, 2) as tag}
            <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
              {tag}
            </span>
          {/each}
          {#if concept.tags.length > 2}
            <span class="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs">
              +{concept.tags.length - 2} more
            </span>
          {/if}
        </div>
      </button>
    {/each}
  </div>
</div>
