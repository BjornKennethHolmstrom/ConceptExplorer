<script>
  import { 
    ChevronDown, 
    ChevronUp, 
    Smile, 
    Frown, 
    History, 
    Sparkles, 
    Tags, 
    FolderOpen,
    ListFilter
  } from 'lucide-svelte';
  import RelatedConcepts from './RelatedConcepts.svelte';
  import { currentConceptName } from '../stores/conceptStore';

  export let concept = {
    name: "Unknown Concept",
    tags: [],
    primary_category: "",
    secondary_categories: [],
    aspects: {},
    core_description: "No description available.",
    positive_aspect: "No positive aspects available.",
    negative_aspect: "No negative aspects available.",
    historical_context: "No historical context available.",
    modern_applications: [],
    reflection_questions: [],
    related_concepts: []
  };

  let isExpanded = false;
  let selectedAspect = Object.keys(concept.aspects)[0] || null;

  $: aspectKeys = Object.keys(concept.aspects);

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function selectAspect(aspect) {
    selectedAspect = aspect;
  }
</script>

<div class="w-full bg-white rounded-lg shadow-md transition-all duration-300 {
  isExpanded ? 'lg:col-span-2 xl:col-span-3 row-span-2' : 'hover:shadow-lg'
}">
  <!-- Card Header -->
  <div class="border-b">
    <div class="p-4">
      <div class="flex items-start justify-between mb-2">
        <h3 class="text-xl font-semibold">{concept.name}</h3>
        <button 
          class="p-1 hover:bg-gray-100 rounded-full transition-colors"
          on:click={toggleExpanded}
        >
          {#if isExpanded}
            <ChevronUp size={20} />
          {:else}
            <ChevronDown size={20} />
          {/if}
        </button>
      </div>

      <!-- Categories and Tags -->
      <div class="flex flex-wrap gap-2 mb-3">
        <div class="flex items-center gap-1 text-sm text-blue-600">
          <FolderOpen size={14} />
          <span>{concept.primary_category}</span>
        </div>
        <div class="flex flex-wrap gap-1">
          {#each concept.tags as tag}
            <span class="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs">
              {tag}
            </span>
          {/each}
        </div>
      </div>

      <!-- Core Description -->
      <p class="text-gray-600">{concept.core_description}</p>
    </div>
  </div>

  {#if isExpanded}
    <div class="p-4 space-y-6">
      <!-- Aspect Navigation -->
      {#if aspectKeys.length > 0}
        <div class="border rounded-lg overflow-hidden">
          <div class="flex overflow-x-auto">
            {#each aspectKeys as aspect}
              <button
                class="px-4 py-2 whitespace-nowrap transition-colors {
                  selectedAspect === aspect
                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                    : 'hover:bg-gray-50 border-b border-gray-200'
                }"
                on:click={() => selectAspect(aspect)}
              >
                {aspect}
              </button>
            {/each}
          </div>

          <!-- Aspect Content -->
          {#if selectedAspect}
            <div class="p-4 bg-gray-50">
              <p class="mb-3">{concept.aspects[selectedAspect].description}</p>
              <div class="space-y-2">
                <h4 class="font-medium">Key Features:</h4>
                <ul class="list-disc list-inside">
                  {#each concept.aspects[selectedAspect].key_features as feature}
                    <li>{feature}</li>
                  {/each}
                </ul>
              </div>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Positive and Negative Aspects Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-green-50 p-4 rounded-lg">
          <div class="flex items-center gap-2 text-green-700 font-medium mb-2">
            <Smile size={18} />
            <span>Positive Aspects</span>
          </div>
          <p class="text-gray-800">{concept.positive_aspect}</p>
        </div>
        <div class="bg-red-50 p-4 rounded-lg">
          <div class="flex items-center gap-2 text-red-700 font-medium mb-2">
            <Frown size={18} />
            <span>Negative Aspects</span>
          </div>
          <p class="text-gray-800">{concept.negative_aspect}</p>
        </div>
      </div>

      <!-- Historical Context -->
      <div class="bg-blue-50 p-4 rounded-lg">
        <div class="flex items-center gap-2 text-blue-700 font-medium mb-2">
          <History size={18} />
          <span>Historical Context</span>
        </div>
        <p class="text-gray-800">{concept.historical_context}</p>
      </div>

      <!-- Modern Applications -->
      <div class="bg-purple-50 p-4 rounded-lg">
        <div class="flex items-center gap-2 text-purple-700 font-medium mb-2">
          <Sparkles size={18} />
          <span>Modern Applications</span>
        </div>
        <div class="flex flex-wrap gap-2">
          {#each concept.modern_applications as application}
            <span class="px-3 py-1 bg-white/50 rounded-full text-sm">
              {application}
            </span>
          {/each}
        </div>
      </div>

      <!-- Reflection Questions -->
      <div class="border rounded-lg p-4">
        <h4 class="font-medium mb-3">Reflection Questions</h4>
        <div class="space-y-2">
          {#each concept.reflection_questions as question}
            <p class="text-gray-700">{question}</p>
          {/each}
        </div>
      </div>

      <!-- Related Concepts -->
      <div class="border-t pt-4">
        <RelatedConcepts
          relatedConcepts={concept.related_concepts}
          onNavigate={(conceptName) => {
            currentConceptName.set(conceptName);
          }}
        />
      </div>
    </div>
  {/if}
</div>
