<script lang="ts">
	import { onMount } from 'svelte';
	import Board from '$lib/components/board/Board.svelte';
	import IssueModal from '$lib/components/IssueModal.svelte';
	import CreateStoryModal from '$lib/components/CreateStoryModal.svelte';
	import { currentProject } from '$lib/stores/project';
	import { getUserStories, getUserStoryStatuses } from '$lib/api/userstories';
	import { api } from '$lib/api';
	import type { UserStory, UserStoryStatus, User } from '$lib/api/types';

	let statuses: UserStoryStatus[] = [];
	let stories: UserStory[] = [];
	let projectMembers: User[] = [];
	let isLoading = true;
	let error = '';

	// Modal state
	let selectedStory: UserStory | null = null;
	let showCreateModal = false;
	let createDefaultStatus: number | null = null;

	// Reload when project changes
	$: if ($currentProject) {
		loadData($currentProject.id);
	}

	async function loadData(projectId: number) {
		isLoading = true;
		error = '';
		try {
			[statuses, stories, projectMembers] = await Promise.all([
				getUserStoryStatuses(projectId),
				getUserStories(projectId),
				api.get<User[]>('/users', { project: projectId })
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

	function handleStorySelect(e: CustomEvent<UserStory>) {
		selectedStory = e.detail;
	}

	function handleStoryUpdate(e: CustomEvent<UserStory>) {
		const updated = e.detail;
		stories = stories.map(s => s.id === updated.id ? updated : s);
		selectedStory = updated;
	}

	function handleStoryDelete(e: CustomEvent<number>) {
		const deletedId = e.detail;
		stories = stories.filter(s => s.id !== deletedId);
		selectedStory = null;
	}

	function openCreateModal(statusId: number | null = null) {
		createDefaultStatus = statusId;
		showCreateModal = true;
	}

	function handleStoryCreated(e: CustomEvent<UserStory>) {
		stories = [...stories, e.detail];
		showCreateModal = false;
	}

	function handleAddToColumn(e: CustomEvent<number>) {
		openCreateModal(e.detail);
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
			<button class="btn btn-primary" on:click={() => openCreateModal()}>
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
			<Board {statuses} {stories} projectId={$currentProject.id} on:select={handleStorySelect} on:addToColumn={handleAddToColumn} />
		{/if}
	</div>
</div>

<!-- Issue Modal -->
{#if selectedStory}
	<IssueModal
		story={selectedStory}
		{statuses}
		{projectMembers}
		on:close={() => selectedStory = null}
		on:update={handleStoryUpdate}
		on:delete={handleStoryDelete}
	/>
{/if}

<!-- Create Story Modal -->
{#if showCreateModal && $currentProject}
	<CreateStoryModal
		projectId={$currentProject.id}
		{statuses}
		defaultStatus={createDefaultStatus}
		on:close={() => showCreateModal = false}
		on:created={handleStoryCreated}
	/>
{/if}
