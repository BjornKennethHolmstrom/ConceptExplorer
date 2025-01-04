<script>
  import { ChevronDown, ChevronUp, Smile, Frown, BookOpen, Link } from 'lucide-svelte';
  import { getContext } from 'svelte';

  export let relatedConceptsMap; // Pass a map of concepts with their categories.

  export let concept = {
    name: "Unknown Concept",
    description: "No description available.",
    positive_aspect: "No positive aspects available.",
    negative_aspect: "No negative aspects available.",
    historical_context: "No historical context available.",
    modern_applications: "No modern applications available.",
    reflection_questions: [],
    related_concepts: []
  };

  let isExpanded = false;

  function toggleExpanded() {
    isExpanded = !isExpanded;
  }

  function navigateToConcept(conceptName) {
    if (relatedConceptsMap[conceptName]) {
      const { category, concept } = relatedConceptsMap[conceptName];
      // Logic to update the UI to show this concept in its category
      // You can emit an event or directly update state/context
      alert(`Navigate to ${conceptName} under ${category}`);
    } else {
      alert(`Concept ${conceptName} not found!`);
    }
  }
</script>

<div class="concept-card">
  <div class="card-header" on:click={toggleExpanded}>
    <h3>{concept.name}</h3>
    <button class="toggle-button">
      {#if isExpanded}
        <ChevronUp size="20" />
      {:else}
        <ChevronDown size="20" />
      {/if}
    </button>
  </div>
  {#if isExpanded}
    <div class="card-content">
      <p><strong><BookOpen size="16" /> Description:</strong> {concept.description}</p>
      <p>
        <strong class="positive"><Smile size="16" /> Positive:</strong> 
        {concept.positive_aspect}
      </p>
      <p>
        <strong class="negative"><Frown size="16" /> Negative:</strong> 
        {concept.negative_aspect}
      </p>
      <p><strong>Historical Context:</strong> {concept.historical_context}</p>
      <p><strong>Modern Applications:</strong> {concept.modern_applications}</p>
      <div>
        <strong>Reflection Questions:</strong>
        <ul>
          {#each concept.reflection_questions as question}
            <li>{question}</li>
          {/each}
        </ul>
      </div>
      <div>
        <strong><Link size="16" /> Related Concepts:</strong>
        <ul>
          {#each concept.related_concepts as related}
            <li>
              <a 
                href="#" 
                on:click|preventDefault={() => navigateToConcept(related)} 
                class="related-concept"
              >
                {related}
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
</div>

<style>
  .concept-card {
    border: 1px solid #ddd;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 8px;
    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    transition: all 0.3s ease;
  }

  .concept-card:hover {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    font-weight: bold;
  }

  h1 {
    background: linear-gradient(to right, #e3f2fd, #e0f7fa);
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  .toggle-button {
    background: none;
    border: none;
    cursor: pointer;
  }

  .card-content {
    margin-top: 1rem;
  }

  .positive {
    color: #4caf50; /* Soft green */
  }

  .negative {
    color: #f44336; /* Soft red */
  }

  .related-concept {
    cursor: pointer;
    text-decoration: underline;
    color: #007bff; /* Subtle blue */
    transition: color 0.2s ease;
  }

  .related-concept:hover {
    color: #0056b3; /* Darker blue */
  }

  ul {
    margin: 0;
    padding-left: 1.5rem;
  }

  li {
    margin-bottom: 0.5rem;
  }

  p {
    margin-bottom: 1rem;
  }

  strong {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
</style>

