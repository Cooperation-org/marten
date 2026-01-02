<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { auth } from '$lib/stores/auth';
	import { currentProject } from '$lib/stores/project';
	import { getProjects } from '$lib/api/projects';
	import type { Project } from '$lib/api/types';

	let projects: Project[] = [];
	let showProjectDropdown = false;

	onMount(() => {
		auth.init();
	});

	// Redirect to login if not authenticated
	$: if (!$auth.isLoading && !$auth.isAuthenticated && !$page.url.pathname.startsWith('/login')) {
		goto('/login');
	}

	// Load projects when authenticated
	$: if ($auth.isAuthenticated && projects.length === 0) {
		loadProjects();
	}

	async function loadProjects() {
		try {
			projects = await getProjects();
			// Auto-select first project if none selected
			if (projects.length > 0 && !$currentProject) {
				currentProject.set(projects[0]);
			}
		} catch (err) {
			console.error('Failed to load projects:', err);
		}
	}

	function selectProject(project: Project) {
		currentProject.set(project);
		showProjectDropdown = false;
	}

	function handleLogout() {
		auth.logout();
		goto('/login');
	}

	function getInitials(name: string): string {
		return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
	}

	// Check if current route is login
	$: isLoginPage = $page.url.pathname.startsWith('/login');
</script>

{#if isLoginPage}
	<slot />
{:else if $auth.isLoading}
	<div class="min-h-screen bg-surface-0 flex items-center justify-center">
		<div class="text-zinc-500">Loading...</div>
	</div>
{:else if $auth.isAuthenticated}
	<div class="min-h-screen bg-surface-0 flex">
		<!-- Sidebar -->
		<aside class="w-56 bg-surface-1 border-r border-border flex flex-col">
			<!-- Logo -->
			<div class="p-4 border-b border-border">
				<a href="/" class="flex items-center gap-2">
					<img src="/logo.svg" alt="LinkedTrust" class="w-8 h-8" />
					<span class="font-semibold text-zinc-100">Taiga<span class="text-lt-cyan">LT</span></span>
				</a>
			</div>

			<!-- Project Selector -->
			<div class="p-2 border-b border-border">
				<div class="relative">
					<button
						on:click={() => showProjectDropdown = !showProjectDropdown}
						class="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-zinc-100 bg-surface-2 hover:bg-surface-3 transition-colors"
					>
						<span class="truncate">{$currentProject?.name || 'Select project'}</span>
						<svg class="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>

					{#if showProjectDropdown}
						<div class="absolute top-full left-0 right-0 mt-1 bg-surface-2 border border-border rounded-md shadow-lg z-50 max-h-64 overflow-auto">
							{#each projects as project (project.id)}
								<button
									on:click={() => selectProject(project)}
									class="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-surface-3 transition-colors"
									class:bg-surface-3={$currentProject?.id === project.id}
								>
									{project.name}
								</button>
							{/each}
							{#if projects.length === 0}
								<div class="px-3 py-2 text-sm text-zinc-500">No projects</div>
							{/if}
						</div>
					{/if}
				</div>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 p-2 space-y-1">
				<a href="/board" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-surface-3 transition-colors" class:bg-surface-3={$page.url.pathname === '/board'} class:text-zinc-100={$page.url.pathname === '/board'}>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
					</svg>
					Board
				</a>
				<a href="/backlog" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-surface-3 transition-colors" class:bg-surface-3={$page.url.pathname === '/backlog'} class:text-zinc-100={$page.url.pathname === '/backlog'}>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
					</svg>
					Backlog
				</a>
				<a href="/epics" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-surface-3 transition-colors" class:bg-surface-3={$page.url.pathname === '/epics'} class:text-zinc-100={$page.url.pathname === '/epics'}>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
					</svg>
					Epics
				</a>
				<a href="/velocity" class="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-surface-3 transition-colors" class:bg-surface-3={$page.url.pathname === '/velocity'} class:text-zinc-100={$page.url.pathname === '/velocity'}>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
					</svg>
					Velocity
				</a>
			</nav>

			<!-- User & Logout -->
			<div class="p-3 border-t border-border">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-2">
						<div class="w-8 h-8 rounded-full bg-lt-cyan flex items-center justify-center text-xs font-medium text-zinc-900">
							{$auth.user ? getInitials($auth.user.full_name || $auth.user.username) : '?'}
						</div>
						<span class="text-sm text-zinc-400 truncate">{$auth.user?.username}</span>
					</div>
					<button
						on:click={handleLogout}
						class="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
						title="Logout"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
						</svg>
					</button>
				</div>
			</div>
		</aside>

		<!-- Main content -->
		<main class="flex-1 overflow-hidden">
			<slot />
		</main>
	</div>
{/if}
