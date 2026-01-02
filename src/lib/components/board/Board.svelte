<script lang="ts">
	import type { UserStory, UserStoryStatus } from '$lib/api/types';
	import Column from './Column.svelte';
	import { api } from '$lib/api';

	export let statuses: UserStoryStatus[] = [];
	export let stories: UserStory[] = [];
	export let projectId: number;

	// Group stories by status
	$: storiesByStatus = statuses.reduce((acc, status) => {
		acc[status.id] = stories.filter(s => s.status === status.id);
		return acc;
	}, {} as Record<number, UserStory[]>);

	async function handleDrop(e: CustomEvent<{ storyId: number; newStatusId: number }>) {
		const { storyId, newStatusId } = e.detail;

		// Optimistically update local state
		const storyIndex = stories.findIndex(s => s.id === storyId);
		if (storyIndex !== -1) {
			stories[storyIndex] = { ...stories[storyIndex], status: newStatusId };
			stories = [...stories]; // trigger reactivity
		}

		// Send to API
		try {
			await api.patch(`/userstories/${storyId}`, {
				status: newStatusId,
				version: stories[storyIndex]?.version
			});
		} catch (error) {
			// Rollback on error - would need to store previous state
			console.error('Failed to update story status:', error);
			// TODO: show toast, rollback
		}
	}
</script>

<div class="flex gap-4 p-4 h-full overflow-x-auto">
	{#each statuses.sort((a, b) => a.order - b.order) as status (status.id)}
		<Column
			{status}
			stories={storiesByStatus[status.id] || []}
			on:drop={handleDrop}
		/>
	{/each}
</div>
