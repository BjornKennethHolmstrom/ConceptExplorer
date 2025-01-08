<script>
  import { Brain, CheckIcon, XIcon, RefreshCwIcon, HelpCircleIcon } from 'lucide-svelte';
  
  export let concepts = [];
  
  let currentQuestion = null;
  let options = [];
  let selectedAnswer = null;
  let score = 0;
  let gamesPlayed = 0;
  let showAnswer = false;
  let hintUsed = false;

  // Generate a new question
  function generateQuestion() {
    // Reset states
    selectedAnswer = null;
    showAnswer = false;
    hintUsed = false;

    // Pick random concept and category
    const correctConcept = concepts[Math.floor(Math.random() * concepts.length)];
    const questionTypes = [
      { type: 'description', getText: c => c.core_description },
      { type: 'positive', getText: c => c.positive_aspect },
      { type: 'application', getText: c => c.modern_applications[0] },
    ];
    const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    // Generate incorrect options
    let wrongOptions = [];
    while (wrongOptions.length < 3) {
      const option = concepts[Math.floor(Math.random() * concepts.length)];
      if (option.name !== correctConcept.name && !wrongOptions.find(o => o.name === option.name)) {
        wrongOptions.push(option);
      }
    }

    // Shuffle all options
    const allOptions = [correctConcept, ...wrongOptions].sort(() => Math.random() - 0.5);

    // Get the question text and censor the concept name and its plural form
    let questionText = questionType.getText(correctConcept);
    const censorPattern = new RegExp(`${correctConcept.name}s?`, 'gi');
    questionText = questionText.replace(censorPattern, '【CONCEPT】');

    currentQuestion = {
      concept: correctConcept,
      text: questionText,
      type: questionType.type,
    };
    options = allOptions;
  }

  function handleAnswer(concept) {
    if (selectedAnswer) return; // Prevent multiple answers
    selectedAnswer = concept;
    
    if (concept.name === currentQuestion.concept.name) {
      score += hintUsed ? 0.5 : 1;
    }
    showAnswer = true;
    gamesPlayed++;
  }

  function showHint() {
    hintUsed = true;
    // Could add more sophisticated hints based on other concept properties
  }

  function getQuestionPrompt(type) {
    switch (type) {
      case 'description':
        return 'Which concept is described by:';
      case 'positive':
        return 'Which concept has this positive aspect:';
      case 'application':
        return 'Which concept includes this modern application:';
      default:
        return 'Which concept matches this description:';
    }
  }

  // Start first game when component mounts
  $: if (concepts?.length > 0 && !currentQuestion) {
    generateQuestion();
  }
</script>

<div class="w-full bg-white rounded-lg shadow-md">
  <div class="border-b p-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold flex items-center gap-2">
        <Brain class="text-blue-500" size={24} />
        Guess the Concept
      </h2>
      <div class="text-sm text-gray-500">
        Score: {score}/{gamesPlayed} ({((score/Math.max(1, gamesPlayed)) * 100).toFixed(1)}%)
      </div>
    </div>
  </div>

  <div class="p-4 space-y-4">
    <!-- Question -->
    {#if currentQuestion}
      <div class="space-y-2">
        <p class="font-medium text-gray-700">{getQuestionPrompt(currentQuestion.type)}</p>
        <p class="text-gray-600 italic">"{currentQuestion.text}"</p>
      </div>

      <!-- Options -->
      <div class="grid gap-3">
        {#each options as concept}
          <button
            on:click={() => handleAnswer(concept)}
            disabled={showAnswer}
            class="w-full p-3 rounded-lg border transition-all {
              showAnswer
                ? concept.name === currentQuestion.concept.name
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : concept.name === selectedAnswer?.name
                  ? 'bg-red-50 border-red-200 text-red-700'
                  : 'bg-gray-50 border-gray-200 text-gray-500'
                : 'hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700'
            }"
          >
            <div class="flex items-center justify-between">
              <span>{concept.name}</span>
              {#if showAnswer && concept.name === currentQuestion.concept.name}
                <CheckIcon size={18} class="text-green-500" />
              {/if}
              {#if showAnswer && concept.name === selectedAnswer?.name && concept.name !== currentQuestion.concept.name}
                <XIcon size={18} class="text-red-500" />
              {/if}
            </div>
          </button>
        {/each}
      </div>

      <!-- Actions -->
      <div class="flex justify-between pt-4">
        {#if !showAnswer}
          <button
            on:click={showHint}
            disabled={hintUsed}
            class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors {
              hintUsed
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-600 hover:bg-blue-50'
            }"
          >
            <HelpCircleIcon size={18} />
            {hintUsed ? 'Hint used' : 'Use hint (-0.5 points)'}
          </button>
        {:else}
          <button
            on:click={generateQuestion}
            class="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <RefreshCwIcon size={18} />
            Next question
          </button>
        {/if}
      </div>
    {/if}
  </div>
</div>
