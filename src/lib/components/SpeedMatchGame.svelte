<script>
  import { Timer, Check, X, Play, RotateCcw } from 'lucide-svelte';
  
  export let concepts = [];
  
  const GAME_DURATION = 60; // Game duration in seconds
  let timeLeft = GAME_DURATION;
  let score = 0;
  let currentPair = null;
  let gameActive = false;
  let gameOver = false;
  let feedback = null;
  let feedbackTimer;
  let stats = {
    correct: 0,
    incorrect: 0,
    total: 0
  };

  // Get a random concept from the list
  function getRandomConcept() {
    return concepts[Math.floor(Math.random() * concepts.length)];
  }

  // Check if two concepts are related
  function areConceptsRelated(concept1, concept2) {
    if (!concept1 || !concept2) return false;
    
    // Check if either concept lists the other as related
    const relatedTo1 = concept1.related_concepts.includes(concept2.name);
    const relatedTo2 = concept2.related_concepts.includes(concept1.name);
    
    // Check if they share categories or tags
    const shareCategories = concept1.secondary_categories.some(cat => 
      concept2.secondary_categories.includes(cat) || concept2.primary_category === cat
    ) || concept2.secondary_categories.includes(concept1.primary_category);
    
    const shareTags = concept1.tags.some(tag => concept2.tags.includes(tag));
    
    return relatedTo1 || relatedTo2 || shareCategories || shareTags;
  }

  // Generate a new pair of concepts
  function generatePair() {
    const concept1 = getRandomConcept();
    let concept2;
    
    // 50% chance of selecting a related concept
    if (Math.random() < 0.5) {
      // Try to select a related concept
      const relatedNames = concept1.related_concepts;
      const relatedConcepts = concepts.filter(c => relatedNames.includes(c.name));
      concept2 = relatedConcepts.length > 0 
        ? relatedConcepts[Math.floor(Math.random() * relatedConcepts.length)]
        : getRandomConcept();
    } else {
      // Select a random concept
      do {
        concept2 = getRandomConcept();
      } while (concept2.name === concept1.name);
    }
    
    return {
      concept1,
      concept2,
      isRelated: areConceptsRelated(concept1, concept2)
    };
  }

  // Handle player's answer
  function handleAnswer(playerAnswer) {
    if (!gameActive || !currentPair) return;
    
    const isCorrect = playerAnswer === currentPair.isRelated;
    score += isCorrect ? 100 : -50;
    stats = {
      ...stats,
      correct: stats.correct + (isCorrect ? 1 : 0),
      incorrect: stats.incorrect + (isCorrect ? 0 : 1),
      total: stats.total + 1
    };
    
    // Show feedback
    clearTimeout(feedbackTimer);
    feedback = {
      correct: isCorrect,
      text: isCorrect ? '+100' : '-50'
    };
    feedbackTimer = setTimeout(() => {
      feedback = null;
    }, 1000);
    
    currentPair = generatePair();
  }

  // Start game
  function startGame() {
    gameActive = true;
    gameOver = false;
    timeLeft = GAME_DURATION;
    score = 0;
    stats = { correct: 0, incorrect: 0, total: 0 };
    currentPair = generatePair();
  }

  // Reset game
  function resetGame() {
    gameActive = false;
    gameOver = false;
    timeLeft = GAME_DURATION;
    score = 0;
    stats = { correct: 0, incorrect: 0, total: 0 };
    currentPair = null;
  }

  import { onDestroy } from 'svelte';

  // Timer logic
  let timer;
  
  $: if (gameActive && timeLeft > 0) {
    clearInterval(timer); // Clear any existing timer
    timer = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        clearInterval(timer);
        gameActive = false;
        gameOver = true;
      }
    }, 1000);
  } else if (!gameActive) {
    clearInterval(timer);
  }

  onDestroy(() => {
    if (timer) clearInterval(timer);
    if (feedbackTimer) clearTimeout(feedbackTimer);
  });

  // Keyboard event handler
  function handleKeydown(event) {
    if (!gameActive) return;
    
    if (event.key === 'ArrowLeft') {
      handleAnswer(false);
    } else if (event.key === 'ArrowRight') {
      handleAnswer(true);
    }
  }
</script>

<svelte:window on:keydown={handleKeydown}/>

<div class="w-full bg-white rounded-lg shadow-md">
  <div class="border-b p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">Speed Match</h2>
      <!-- Feedback Indicator -->
      {#if feedback}
        <div
          class="absolute left-1/2 top-4 -translate-x-1/2 transform px-4 py-2 rounded-full font-bold text-lg transition-opacity"
          class:bg-green-100={feedback.correct}
          class:text-green-700={feedback.correct}
          class:bg-red-100={!feedback.correct}
          class:text-red-700={!feedback.correct}
        >
          {feedback.text}
        </div>
      {/if}
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2 text-blue-600">
          <Timer size={20} />
          <span>{timeLeft}s</span>
        </div>
        <div class="text-xl font-bold">
          Score: {score}
        </div>
      </div>
    </div>
  </div>

  <div class="p-4">
    {#if !gameActive && !gameOver}
      <div class="text-center py-8">
        <h3 class="text-xl font-semibold mb-4">
          Match Related Concepts
        </h3>
        <p class="text-gray-600 mb-6">
          Quickly decide if two concepts are related. Use arrow keys or buttons to answer.
          <br />
          Score points for correct answers, but be careful - wrong answers cost points!
        </p>
        <button
          on:click={startGame}
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <Play size={20} />
          Start Game
        </button>
      </div>
    {:else if gameOver}
      <div class="text-center py-8">
        <h3 class="text-2xl font-bold mb-4">Game Over!</h3>
        <div class="space-y-2 mb-6">
          <p class="text-lg">Final Score: {score}</p>
          <p>Correct: {stats.correct}</p>
          <p>Incorrect: {stats.incorrect}</p>
          <p>Accuracy: {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%</p>
        </div>
        <button
          on:click={resetGame}
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <RotateCcw size={20} />
          Play Again
        </button>
      </div>
    {:else if currentPair}
      <div class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold mb-2">{currentPair.concept1.name}</h4>
            <p class="text-sm text-gray-600">{currentPair.concept1.core_description}</p>
          </div>
          <div class="p-4 bg-gray-50 rounded-lg">
            <h4 class="font-semibold mb-2">{currentPair.concept2.name}</h4>
            <p class="text-sm text-gray-600">{currentPair.concept2.core_description}</p>
          </div>
        </div>

        <div class="flex justify-center gap-4">
          <button
            on:click={() => handleAnswer(false)}
            class="px-6 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
          >
            <X size={20} />
            Not Related
          </button>
          <button
            on:click={() => handleAnswer(true)}
            class="px-6 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
          >
            <Check size={20} />
            Related
          </button>
        </div>

        <div class="text-center text-sm text-gray-500">
          Use ← → arrow keys or buttons to answer
        </div>
      </div>
    {/if}
  </div>
</div>
