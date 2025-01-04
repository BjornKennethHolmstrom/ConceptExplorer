<script>
  import { messages } from '../lib/stores/messages.js';
  import ConceptCard from '../lib/components/ConceptCard.svelte';

  let categories = [];
  let currentCategory = null;
  let currentConcepts = [];
  let relatedConceptsMap = {};

  categories.forEach(category => {
    category.concepts.forEach(concept => {
      relatedConceptsMap[concept.name] = {
        category: category.name,
        concept
      };
    });
  });

  $: categories = $messages.categories?.map(category => category.name) || [];

  function selectCategory(categoryName) {
    currentCategory = categoryName;
    currentConcepts =
      $messages.categories?.find(category => category.name === categoryName)
        ?.concepts || [];
  }
</script>

<div class="app">
  <aside class="sidebar">
    <ul>
      {#each categories as category}
        <li on:click={() => selectCategory(category)}>
          {category}
        </li>
      {/each}
    </ul>
  </aside>

  <main class="content">
    {#if currentCategory}
      <h1>{currentCategory}</h1>
      <div class="card-grid">
        {#each currentConcepts as concept}
          <ConceptCard {concept} {relatedConceptsMap} />
        {/each}
      </div>
    {:else}
      <p>Please select a category to explore concepts.</p>
    {/if}
  </main>
</div>

<style>
  .app {
    display: grid;
    grid-template-columns: 1fr 3fr;
    gap: 2rem;
  }

  .sidebar {
    background: #f7f7f7;
    padding: 1rem;
    border-radius: 8px;
    font-family: sans-serif;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
  }

  .sidebar li {
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.3s ease;
  }

  .sidebar li:hover {
    background-color: #ddd;
  }

  .content {
    padding: 1rem;
    font-family: sans-serif;
  }

  .card-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  h1 {
    margin-bottom: 1rem;
    color: #333;
  }
</style>


