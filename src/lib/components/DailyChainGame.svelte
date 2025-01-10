<script>
  import { Link2, Calendar, Trophy } from 'lucide-svelte';
  import { onDestroy } from 'svelte';
  
  export let concepts = [];
  
  let currentPuzzle = 0; // 0-2 for three daily puzzles
  let selectedConcepts = [null, null, null]; // For storing user's answers
  let showCompletion = false;
  let searchQuery = '';
  let suggestedConcepts = [];
  let correctSteps = [false, false, false]; // Track which steps are correct
  let showSuccess = false; // Show success message before next puzzle
  let attempts = [0, 0, 0]; // Track attempts for each step
  let hintsUsed = [0, 0, 0]; // Track hint level for each step
  let score = 100; // Starting score, reduced by hint usage

  // Get deterministic seed from today's date
  function getTodaysSeed() {
    const date = new Date();
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  }

  // Seeded random number generator
  function createSeededRandom(seed) {
    let seedHash = Array.from(seed).reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0) | 0;
    }, 0);
    
    return function() {
      seedHash = (seedHash * 9301 + 49297) % 233280;
      return seedHash / 233280;
    };
  }

  // Check if two concepts are related
  function areConceptsRelated(concept1, concept2) {
    if (!concept1 || !concept2) return false;
    
    // Direct relation in related_concepts
    const directlyRelated = concept1.related_concepts.includes(concept2.name) ||
                           concept2.related_concepts.includes(concept1.name);
    
    // Shared categories
    const sharedCategories = concept1.secondary_categories.some(cat => 
      concept2.secondary_categories.includes(cat) || concept2.primary_category === cat
    ) || concept2.secondary_categories.includes(concept1.primary_category);
    
    // Shared tags
    const sharedTags = concept1.tags.some(tag => concept2.tags.includes(tag));
    
    return directlyRelated || sharedCategories || sharedTags;
  }

  // Generate today's puzzles
  function generateDailyPuzzles() {
    const seededRandom = createSeededRandom(getTodaysSeed());
    const puzzles = [];
    
    // Helper to get random concept
    const getRandomConcept = () => {
      const index = Math.floor(seededRandom() * concepts.length);
      return concepts[index];
    };
    
    // Generate puzzles with increasing difficulty (1, 2, and 3 steps)
    for (let difficulty = 1; difficulty <= 3; difficulty++) {
      let startConcept, endConcept;
      let tries = 0;
      let validPath = false;
      
      // Keep trying until we find a valid path
      while (!validPath && tries < 100) {
        startConcept = getRandomConcept();
        endConcept = getRandomConcept();
        
        // Simple check for possible path (can be improved)
        if (difficulty === 1) {
          validPath = concepts.some(c => 
            areConceptsRelated(c, startConcept) && areConceptsRelated(c, endConcept)
          );
        } else {
          // For harder difficulties, just ensure concepts aren't directly related
          validPath = !areConceptsRelated(startConcept, endConcept);
        }
        
        tries++;
      }
      
      puzzles.push({
        start: startConcept,
        end: endConcept,
        stepsNeeded: difficulty
      });
    }
    
    return puzzles;
  }

  let dailyPuzzles = generateDailyPuzzles();

  // Get hints for a specific step
  function getHints(stepIndex) {
    const puzzle = dailyPuzzles[currentPuzzle];
    const steps = [puzzle.start, ...selectedConcepts.slice(0, puzzle.stepsNeeded), puzzle.end];
    const prevConcept = steps[stepIndex];
    const nextConcept = steps[stepIndex + 2];
    
    // Find valid connections
    const validConcepts = concepts.filter(c => 
      (!prevConcept || areConceptsRelated(c, prevConcept)) &&
      (!nextConcept || areConceptsRelated(c, nextConcept))
    );

    // Get hint based on level
    switch(hintsUsed[stepIndex]) {
      case 1:
        return {
          type: 'basic',
          content: {
            firstLetter: validConcepts[0].name[0],
            categories: [...new Set(validConcepts.map(c => c.primary_category))].slice(0, 2)
          }
        };
      case 2:
        const sharedTags = validConcepts[0].tags.filter(tag => 
          (prevConcept?.tags.includes(tag) || nextConcept?.tags.includes(tag))
        );
        return {
          type: 'intermediate',
          content: {
            firstTwoLetters: validConcepts[0].name.slice(0, 2),
            sharedTags: sharedTags.slice(0, 2)
          }
        };
      case 3:
        return {
          type: 'advanced',
          content: {
            possibleConcepts: validConcepts.slice(0, 3).map(c => c.name)
          }
        };
      default:
        return null;
    }
  }

  // Handle concept search
  function handleSearch() {
    if (!searchQuery.trim()) {
      suggestedConcepts = [];
      return;
    }

    suggestedConcepts = concepts
      .filter(concept => 
        concept.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        concept.name !== dailyPuzzles[currentPuzzle].start.name &&
        concept.name !== dailyPuzzles[currentPuzzle].end.name &&
        !selectedConcepts.some(c => c?.name === concept.name)
      )
      .slice(0, 5);
  }

  // Check if a single step in the chain is valid
  function isStepValid(index) {
    const puzzle = dailyPuzzles[currentPuzzle];
    const steps = [puzzle.start, ...selectedConcepts.slice(0, puzzle.stepsNeeded), puzzle.end];
    
    if (index >= steps.length - 1) return false;
    return steps[index] && steps[index + 1] && areConceptsRelated(steps[index], steps[index + 1]);
  }

  // Handle concept selection with attempt tracking
  function handleConceptSelection(stepIndex, concept) {
    selectedConcepts[stepIndex] = concept;
    if (!isStepValid(stepIndex)) {
      attempts[stepIndex]++;
      // Offer hint after every 3 attempts
      if (attempts[stepIndex] % 3 === 0 && hintsUsed[stepIndex] < 3) {
        hintsUsed[stepIndex]++;
        score -= 10; // Reduce score for using hints
      }
    }
    searchQuery = '';
    suggestedConcepts = [];
  }

  // Show success message and move to next puzzle after delay
  function handleSuccess() {
    showSuccess = true;
    setTimeout(() => {
      showSuccess = false;
      if (currentPuzzle < 2) {
        currentPuzzle++;
        selectedConcepts = [null, null, null];
        correctSteps = [false, false, false];
        searchQuery = '';
      } else {
        showCompletion = true;
      }
    }, 2000); // Show success message for 2 seconds
  }

  // Update correctness when concepts change
  $: {
    selectedConcepts;
    correctSteps = selectedConcepts.map((_, index) => isStepValid(index));
  }

  $: {
    searchQuery;
    handleSearch();
  }

  // Timer cleanup
  let timer;
  onDestroy(() => {
    if (timer) clearTimeout(timer);
  });
</script>

<div class="w-full bg-white rounded-lg shadow-md">
  <div class="border-b p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold flex items-center gap-2">
        <Calendar size={24} class="text-blue-500" />
        Daily Concept Chain
      </h2>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500">Puzzle {currentPuzzle + 1}/3</span>
      </div>
    </div>
  </div>

  <div class="p-4">
    {#if !showCompletion}
      <div class="space-y-6">
        <!-- Instructions -->
        <div class="text-center">
          <p class="text-gray-600 mb-2">
            Connect the concepts by finding {dailyPuzzles[currentPuzzle].stepsNeeded} intermediate concept{dailyPuzzles[currentPuzzle].stepsNeeded > 1 ? 's' : ''} 
            that form a valid chain of relationships.
          </p>
        </div>

        <!-- Concept Chain Display -->
        <div class="flex items-center justify-center gap-2 flex-wrap">
          <!-- Success Message -->
          {#if showSuccess}
            <div class="absolute inset-0 flex items-center justify-center bg-black/10 z-20">
              <div class="bg-white p-6 rounded-lg shadow-lg text-center">
                <h3 class="text-xl font-bold text-green-600 mb-2">Perfect Chain!</h3>
                <p class="text-gray-600">Moving to next puzzle...</p>
              </div>
            </div>
          {/if}

          <!-- Start Concept -->
          <div class="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
            {dailyPuzzles[currentPuzzle].start.name}
          </div>
          
          <!-- Intermediate Steps -->
          {#each Array(dailyPuzzles[currentPuzzle].stepsNeeded) as _, i}
            <div class="flex items-center gap-2">
              <Link2 size={20} class="text-gray-400" />
              {#if selectedConcepts[i]}
                <div class="px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors {
                  correctSteps[i] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }">
                  {selectedConcepts[i].name}
                  <button
                    class="text-gray-400 hover:text-gray-600"
                    on:click={() => {
                      selectedConcepts[i] = null;
                      correctSteps[i] = false;
                    }}
                  >
                    ×
                  </button>
                </div>
              {:else}
                <div class="relative">
                  <input
                    type="text"
                    placeholder="Find concept..."
                    class="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
                    bind:value={searchQuery}
                  />
                  
                  {#if suggestedConcepts.length > 0}
                    <div class="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border">
                      {#each suggestedConcepts as concept}
                        <button
                          class="w-full px-4 py-2 text-left hover:bg-gray-50"
                          on:click={() => handleConceptSelection(i, concept)}
                        >
                          {concept.name}
                        </button>
                      {/each}
                    </div>
                  {/if}

                  {#if !selectedConcepts[i] && attempts[i] >= 3}
                    <div class="mt-2 text-sm">
                      {#if hintsUsed[i] === 1}
                        <div class="text-blue-600">
                          <p>Hint: Look for a concept that:</p>
                          <ul class="list-disc list-inside ml-2">
                            <li>Starts with '{getHints(i).content.firstLetter}'</li>
                            <li>Belongs to: {getHints(i).content.categories.join(' or ')}</li>
                          </ul>
                        </div>
                      {:else if hintsUsed[i] === 2}
                        <div class="text-blue-600">
                          <p>Hint: The concept:</p>
                          <ul class="list-disc list-inside ml-2">
                            <li>Starts with '{getHints(i).content.firstTwoLetters}...'</li>
                            <li>Relates to: {getHints(i).content.sharedTags.join(', ')}</li>
                          </ul>
                        </div>
                      {:else if hintsUsed[i] === 3}
                        <div class="text-blue-600">
                          <p>Hint: One of these concepts will work:</p>
                          <ul class="list-disc list-inside ml-2">
                            {#each getHints(i).content.possibleConcepts as concept}
                              <li>{concept}</li>
                            {/each}
                          </ul>
                        </div>
                      {/if}
                    </div>
                  {/if}
                </div>
              {/if}
            </div>
          {/each}

          <!-- End Concept -->
          <Link2 size={20} class="text-gray-400" />
          <div class="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
            {dailyPuzzles[currentPuzzle].end.name}
          </div>
        </div>

        <!-- Check Solution Button -->
        <div class="flex justify-center">
          <button
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedConcepts.slice(0, dailyPuzzles[currentPuzzle].stepsNeeded).includes(null)}
            on:click={() => {
              const isValid = correctSteps.slice(0, dailyPuzzles[currentPuzzle].stepsNeeded).every(step => step);
              if (isValid) {
                handleSuccess();
              }
            }}
          >
            Check Solution
          </button>
        </div>
      </div>
    {:else}
      <!-- Completion Screen -->
      <div class="text-center py-8">
        <Trophy size={48} class="text-yellow-500 mx-auto mb-4" />
        <h3 class="text-2xl font-bold mb-2">Daily Challenges Complete!</h3>
        <div class="space-y-2 mb-6">
          <p class="text-lg">Final Score: {score}</p>
          <p>Total Hints Used: {hintsUsed.reduce((a, b) => a + b, 0)}</p>
          <p class="text-sm text-gray-500">(-10 points per hint used)</p>
        </div>
        <p class="text-gray-600 mb-6">
          Come back tomorrow for new concept chains to solve.
        </p>
        <button
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          on:click={() => {
            currentPuzzle = 0;
            selectedConcepts = [null, null, null];
            correctSteps = [false, false, false];
            attempts = [0, 0, 0];
            hintsUsed = [0, 0, 0];
            score = 100;
            showCompletion = false;
          }}
        >
          Play Again
        </button>
      </div>
    {/if}
  </div>
</div>
