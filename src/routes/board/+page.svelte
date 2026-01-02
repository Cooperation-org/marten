<script lang="ts">
	import { onMount } from 'svelte';
	import Board from '$lib/components/board/Board.svelte';
	import { currentProject } from '$lib/stores/project';
	import { getUserStories, getUserStoryStatuses } from '$lib/api/userstories';
	import type { UserStory, UserStoryStatus } from '$lib/api/types';

	let statuses: UserStoryStatus[] = [];
	let stories: UserStory[] = [];
	let isLoading = true;
	let error = '';

	// Reload when project changes
	$: if ($currentProject) {
		loadData($currentProject.id);
	}

	async function loadData(projectId: number) {
		isLoading = true;
		error = '';
		try {
			[statuses, stories] = await Promise.all([
				getUserStoryStatuses(projectId),
				getUserStories(projectId)
			]);
			// Sort statuses by order
			statuses = statuses.sort((a, b) => a.order - b.order);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load board';
			console.error('Failed to load board:', err);
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Board - TaigaLT</title>
</svelte:head>

<div class="h-full flex flex-col">
	<!-- Header -->
	<header class="flex items-center justify-between px-6 py-4 border-b border-border">
		<div>
			<h1 class="text-lg font-semibold text-zinc-100">{$currentProject?.name || 'Select a project'}</h1>
			<p class="text-sm text-zinc-500">Kanban Board</p>
		</div>
		<div class="flex items-center gap-2">
			<button class="btn btn-ghost">
				<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
				</svg>
				Filter
			</button>
			<button class="btn btn-primary">
				<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				New Story
			</button>
		</div>
	</header>

	<!-- Board -->
	<div class="flex-1 overflow-hidden">
		{#if isLoading}
			<div class="flex items-center justify-center h-full">
				<div class="text-zinc-500">Loading board...</div>
			</div>
		{:else if error}
			<div class="flex items-center justify-center h-full">
				<div class="text-red-400">{error}</div>
			</div>
		{:else if !$currentProject}
			<div class="flex items-center justify-center h-full">
				<div class="text-zinc-500">Select a project to view the board</div>
			</div>
		{:else}
			<Board {statuses} {stories} projectId={$currentProject.id} />
		{/if}
	</div>
</div>
