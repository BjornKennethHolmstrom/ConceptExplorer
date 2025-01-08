<script>
  import { messages } from '$lib/stores/messages.js';
  import GuessTheConceptGame from '$lib/components/GuessTheConceptGame.svelte';
  import { GamepadIcon, Brain, Clock, Trophy } from 'lucide-svelte';
  
  let selectedMode = 'guess'; // Default game mode
  
  const gameModes = [
    {
      id: 'guess',
      name: 'Guess the Concept',
      description: 'Test your knowledge by guessing concepts from their descriptions.',
      icon: Brain,
      comingSoon: false
    },
    {
      id: 'speed',
      name: 'Speed Match',
      description: 'Race against time to match related concepts.',
      icon: Clock,
      comingSoon: true
    },
    {
      id: 'challenge',
      name: 'Daily Challenge',
      description: 'A new set of concept puzzles every day.',
      icon: Trophy,
      comingSoon: true
    }
  ];
</script>

<div class="min-h-screen bg-gray-50 p-4">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold flex items-center gap-2 mb-2">
        <GamepadIcon class="text-blue-500" />
        Concept Games
      </h1>
      <p class="text-gray-600">
        Fun ways to explore and learn about different concepts.
      </p>
    </div>

    <!-- Game Mode Selection -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {#each gameModes as mode}
        <button
          class="relative p-4 bg-white rounded-lg shadow-md border-2 transition-all {
            mode.id === selectedMode 
              ? 'border-blue-500 ring-2 ring-blue-200'
              : 'border-transparent hover:border-gray-200'
          } {mode.comingSoon ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}"
          on:click={() => !mode.comingSoon && (selectedMode = mode.id)}
        >
          <div class="flex flex-col items-center text-center gap-2">
            <svelte:component this={mode.icon} size={24} class={
              mode.id === selectedMode ? 'text-blue-500' : 'text-gray-500'
            }/>
            <h3 class="font-semibold">{mode.name}</h3>
            <p class="text-sm text-gray-600">{mode.description}</p>
          </div>
          {#if mode.comingSoon}
            <div class="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
              Coming Soon
            </div>
          {/if}
        </button>
      {/each}
    </div>

    <!-- Game Area -->
    <div class="mb-8">
      {#if selectedMode === 'guess'}
        <GuessTheConceptGame concepts={$messages.concepts ?? []} />
      {:else if selectedMode === 'speed'}
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 class="text-xl font-semibold text-gray-700 mb-2">Coming Soon!</h2>
          <p class="text-gray-600">This game mode is currently in development.</p>
        </div>
      {:else if selectedMode === 'challenge'}
        <div class="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 class="text-xl font-semibold text-gray-700 mb-2">Coming Soon!</h2>
          <p class="text-gray-600">Daily challenges will be available soon!</p>
        </div>
      {/if}
    </div>
  </div>
</div>
