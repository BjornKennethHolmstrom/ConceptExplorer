<script>
  import { GithubIcon, MessageSquare, BugIcon, Lightbulb, Send } from 'lucide-svelte';
  
  let formData = {
    name: '',
    email: '',
    type: 'concept',
    subject: '',
    message: ''
  };

  let isSubmitting = false;
  let submitStatus = null;

  async function handleSubmit(event) {
    event.preventDefault();
    isSubmitting = true;
    
    try {
      const response = await fetch('https://formspree.io/f/mqaawqry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        submitStatus = 'success';
        formData = {
          name: '',
          email: '',
          type: 'concept',
          subject: '',
          message: ''
        };
      } else {
        submitStatus = 'error';
      }
    } catch (error) {
      submitStatus = 'error';
    }
    
    isSubmitting = false;
    setTimeout(() => {
      submitStatus = null;
    }, 5000);
  }
</script>

<div class="min-h-screen bg-gray-50 p-4">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <section class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h1 class="text-3xl font-bold mb-4">Contribute to ConceptExplorer</h1>
      <p class="text-gray-600 mb-6">
        Help make ConceptExplorer better by contributing new concepts, suggesting improvements, or reporting issues.
        Your input helps create a more comprehensive resource for everyone.
      </p>
    </section>

    <!-- GitHub Section -->
    <section class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex items-start gap-4">
        <div class="p-2 bg-gray-50 rounded-lg">
          <GithubIcon size={24} class="text-gray-700" />
        </div>
        <div>
          <h2 class="text-xl font-semibold mb-2">Open Source</h2>
          <p class="text-gray-600 mb-4">
            ConceptExplorer is open source! You can contribute directly through our GitHub repository:
          </p>
          <div class="space-y-2">
            <a 
              href="https://github.com/bjornkennethholmstrom/ConceptExplorer"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
            >
              View project on GitHub
              <GithubIcon size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Contribution Types -->
    <section class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold mb-4">Ways to Contribute</h2>
      
      <div class="grid gap-4 md:grid-cols-3">
        <!-- New Concepts -->
        <div class="p-4 bg-blue-50 rounded-lg">
          <div class="flex items-center gap-2 text-blue-700 mb-2">
            <Lightbulb size={20} />
            <h3 class="font-medium">New Concepts</h3>
          </div>
          <p class="text-gray-600 text-sm">
            Submit new concepts with their descriptions, history, and connections.
          </p>
        </div>

        <!-- Improvements -->
        <div class="p-4 bg-green-50 rounded-lg">
          <div class="flex items-center gap-2 text-green-700 mb-2">
            <MessageSquare size={20} />
            <h3 class="font-medium">Suggestions</h3>
          </div>
          <p class="text-gray-600 text-sm">
            Suggest improvements to existing concepts or features.
          </p>
        </div>

        <!-- Bug Reports -->
        <div class="p-4 bg-red-50 rounded-lg">
          <div class="flex items-center gap-2 text-red-700 mb-2">
            <BugIcon size={20} />
            <h3 class="font-medium">Bug Reports</h3>
          </div>
          <p class="text-gray-600 text-sm">
            Help improve the app by reporting technical issues.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Form -->
    <section class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-xl font-semibold mb-4">Send Feedback</h2>
      
      <form on:submit={handleSubmit} class="space-y-4">
        <div class="grid gap-4 md:grid-cols-2">
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              bind:value={formData.name}
              required
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              bind:value={formData.email}
              required
              class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            />
          </div>
        </div>

        <!-- Type -->
        <div>
          <label for="type" class="block text-sm font-medium text-gray-700 mb-1">
            Type of Feedback
          </label>
          <select
            id="type"
            bind:value={formData.type}
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          >
            <option value="concept">New Concept Submission</option>
            <option value="improvement">Suggest Improvement</option>
            <option value="bug">Report Issue</option>
            <option value="other">Other Feedback</option>
          </select>
        </div>

        <!-- Subject -->
        <div>
          <label for="subject" class="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            bind:value={formData.subject}
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          />
        </div>

        <!-- Message -->
        <div>
          <label for="message" class="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            bind:value={formData.message}
            rows="6"
            required
            class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
          ></textarea>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            class="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={16} />
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>

          {#if submitStatus}
            <div class={`px-4 py-2 rounded-lg ${
              submitStatus === 'success' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-700'
            }`}>
              {submitStatus === 'success' 
                ? 'Message sent successfully!' 
                : 'Error sending message. Please try again.'}
            </div>
          {/if}
        </div>

        <!-- Privacy Note -->
        <p class="text-sm text-gray-500">
          Your contact information will only be used to respond to your submission.
          We value your privacy and will not share your information with third parties.
        </p>
      </form>
    </section>
  </div>
</div>
