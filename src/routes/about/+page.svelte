<script>
  import { base } from '$app/paths';
  import { ExternalLink, BookOpen, Rocket } from 'lucide-svelte';

  const projects = [
    {
      name: "Spiralize",
      description: "A site showcasing Spiral Dynamics with an assessment quiz to help people understand their developmental stage and worldview.",
      url: "https://www.spiralize.org",
      logo: "/project-logos/spiralize.svg" // You'll provide these images
    },
    {
      name: "TiTo",
      description: "An easy to use time tracking tool for multiple projects with report generation.",
      url: "https://bjornkennethholmstrom.github.io/TiTo",
      logo: "/project-logos/tito.svg"
    },
    {
      name: "Peace Project",
      description: "An ambitious initiative with the goal of ending the world's armed conflicts through systematic approaches and collaborative solutions.",
      url: "https://bjornkennethholmstrom.github.io/peace",
      logo: "/project-logos/peace.svg"
    },
    {
      name: "Faith for Peace",
      description: "A platform dedicated to uniting faiths and beliefs for a peaceful world, fostering interfaith dialogue and understanding.",
      url: "https://bjornkennethholmstrom.github.io/faith-for-peace",
      logo: "/project-logos/faith-for-peace.svg"
    },
    {
      name: "Unity Beyond the Known",
      description: "An initiative inspiring humanity to redirect resources from conflict toward peaceful exploration and discovery.",
      url: "https://bjornkennethholmstrom.github.io/UnityBeyondtheKnown/",
      icon: Rocket // Fallback to Lucide icon until logo is available
    }
  ];
</script>

<div class="min-h-screen bg-gray-50 p-4">
  <div class="max-w-4xl mx-auto">
    <!-- About Section -->
    <section class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h1 class="text-3xl font-bold mb-4">About Concept Explorer</h1>
      <p class="text-gray-600 mb-6">
        Concept Explorer is a platform for exploring and understanding various concepts, philosophies, and ideas. 
        It aims to make complex ideas accessible and encourage learning through interactive exploration.
      </p>
    </section>

    <!-- Creator Section -->
    <section class="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 class="text-2xl font-bold mb-4">About the Creator</h2>
      
      <div class="prose prose-blue max-w-none">
        <p class="mb-4">
          Björn "Pwnytale" K. Holmström is a systems thinker and creator with a background in engineering physics 
          and mathematical optimization. His diverse experience spans from software development at TOMLAB Optimization 
          to exploring traditional crafts and cultural practices across Sweden, the Basque Country, and Japan.
        </p>
        
        <p class="mb-6">
          Drawing from his background in systems thinking and technological innovation, he created Concept Explorer 
          to make complex ideas more accessible and to encourage deeper understanding of the concepts that shape our world. 
          Through this platform, he aims to facilitate meaningful connections between different fields of knowledge 
          and promote holistic understanding.
        </p>

        <div class="flex flex-col sm:flex-row gap-4">
          <a 
            href="https://bjornkennethholmstrom.wordpress.com/"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <BookOpen size={16} />
            Visit his blog
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>

    <!-- Other Projects -->
    <section class="bg-white rounded-lg shadow-md p-6">
      <h2 class="text-2xl font-bold mb-6">Other Projects</h2>
      
      <div class="grid gap-6">
        {#each projects as project}
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            class="block p-4 rounded-lg border hover:border-blue-200 transition-all hover:shadow-md"
          >
            <div class="flex items-start gap-4">
              <div class="flex-shrink-0">
                {#if project.logo}
                  <img 
                    src={project.logo} 
                    alt={`${project.name} logo`}
                    class="w-12 h-12 object-contain"
                  />
                {:else if project.icon}
                  <div class="p-2 bg-blue-50 rounded-lg">
                    <svelte:component this={project.icon} size={32} class="text-blue-600" />
                  </div>
                {/if}
              </div>
              <div class="flex-grow min-w-0">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="font-semibold truncate">{project.name}</h3>
                  <ExternalLink size={14} class="flex-shrink-0 text-gray-400" />
                </div>
                <p class="text-gray-600">{project.description}</p>
              </div>
            </div>
          </a>
        {/each}
      </div>
    </section>
  </div>
</div>
