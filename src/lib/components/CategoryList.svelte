<script>
  import { messages } from '../stores/messages.js';
  import { onMount } from 'svelte';

  let categories = [];

  // Load categories on mount
  onMount(() => {
    $messages && (categories = Object.keys($messages));
  });
</script>

<div class="category-list">
  {#each categories as category}
    <div class="category-item">
      <h2>{category}</h2>
      <a href="#{category}">View Concepts</a> <!-- Link to individual categories -->
    </div>
  {/each}
</div>

<style>
  .category-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .category-item {
    background: #f0f0f0;
    padding: 1rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
</style>

