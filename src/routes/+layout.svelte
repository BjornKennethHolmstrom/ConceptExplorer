<script>
  import '../app.css';
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { Library, GamepadIcon, Info } from 'lucide-svelte';

  const navItems = [
    { href: `${base}/`, label: 'Browse', icon: Library },
    { href: `${base}/games`, label: 'Games', icon: GamepadIcon },
    { href: `${base}/about`, label: 'About', icon: Info }
  ];
</script>

<div class="min-h-screen bg-gray-50">
  <!-- Header -->
  <header class="bg-white border-b sticky top-0 z-50">
    <div class="max-w-[2000px] mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo/Brand -->
        <a href="{base}/" class="flex items-center gap-2 font-bold text-xl text-blue-600 hover:text-blue-700">
          <Library size={24} />
          <span>Concept Explorer</span>
        </a>

        <!-- Navigation -->
        <nav class="flex items-center gap-1">
          {#each navItems as item}
            <a
              href={item.href}
              class="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors {
                $page.url.pathname === item.href.replace(base, '')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }"
            >
              <svelte:component this={item.icon} size={20} />
              <span>{item.label}</span>
            </a>
          {/each}
        </nav>
      </div>
    </div>
  </header>

  <!-- Page Content -->
  <main>
    <slot />
  </main>
</div>
