<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { UserStory, UserStoryStatus } from '$lib/api/types';
	import { createUserStory } from '$lib/api/userstories';

	export let projectId: number;
	export let statuses: UserStoryStatus[] = [];
	export let defaultStatus: number | null = null;

	const dispatch = createEventDispatcher<{
		close: void;
		created: UserStory;
	}>();

	let subject = '';
	let description = '';
	let status = defaultStatus || (statuses.length > 0 ? statuses[0].id : null);
	let isCreating = false;

	async function handleCreate() {
		if (!subject.trim() || isCreating) return;

		isCreating = true;
		const subjectText = subject.trim();
		const descText = description.trim();
		const statusId = status;

		// Optimistic: create temp story and close immediately
		const tempId = -Date.now();
		const tempStory: UserStory = {
			id: tempId,
			ref: 0,
			subject: subjectText,
			description: descText,
			status: statusId || statuses[0]?.id || 0,
			status_extra_info: statuses.find(s => s.id === statusId)
				? { name: statuses.find(s => s.id === statusId)!.name, color: statuses.find(s => s.id === statusId)!.color, is_closed: false }
				: { name: 'New', color: '#999', is_closed: false },
			assigned_to: null,
			assigned_to_extra_info: null,
			owner: 0,
			owner_extra_info: {} as any,
			project: projectId,
			project_extra_info: { id: projectId, name: '', slug: '' },
			milestone: null,
			milestone_name: null,
			milestone_slug: null,
			is_closed: false,
			total_points: null,
			kanban_order: Date.now(),
			backlog_order: Date.now(),
			sprint_order: Date.now(),
			created_date: new Date().toISOString(),
			modified_date: new Date().toISOString(),
			tags: [],
			epics: null
		};

		dispatch('created', tempStory);

		// Create in background
		try {
			const story = await createUserStory({
				project: projectId,
				subject: subjectText,
				description: descText,
				status: statusId || undefined
			});
			dispatch('updated', story, tempId);
		} catch (err) {
			console.error('Failed to create story:', err);
			dispatch('error', tempId);
			alert('Failed to create story: ' + (err as Error).message);
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			dispatch('close');
		} else if (e.key === 'Enter' && e.metaKey) {
			handleCreate();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

<div class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" on:click={() => dispatch('close')}>
	<div
		class="bg-surface-1 border border-border rounded-lg shadow-2xl w-full max-w-lg"
		on:click|stopPropagation
	>
		<div class="p-4 border-b border-border">
			<h2 class="text-lg font-semibold text-zinc-100">New Story</h2>
		</div>

		<div class="p-4 space-y-4">
			<div>
				<label for="story-subject" class="block text-sm font-medium text-zinc-400 mb-1">Title</label>
				<input
					id="story-subject"
					type="text"
					bind:value={subject}
					placeholder="What needs to be done?"
					class="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lt-cyan focus:border-transparent"
					autofocus
				/>
			</div>

			{#if statuses.length > 0}
				<div>
					<label for="story-status" class="block text-sm font-medium text-zinc-400 mb-1">Status</label>
					<select
						id="story-status"
						bind:value={status}
						class="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-zinc-100 focus:outline-none focus:ring-2 focus:ring-lt-cyan focus:border-transparent"
					>
						{#each statuses.sort((a, b) => a.order - b.order) as s}
							<option value={s.id}>{s.name}</option>
						{/each}
					</select>
				</div>
			{/if}

			<div>
				<label for="story-desc" class="block text-sm font-medium text-zinc-400 mb-1">Description</label>
				<textarea
					id="story-desc"
					bind:value={description}
					placeholder="Add details (optional)"
					rows="3"
					class="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lt-cyan focus:border-transparent resize-none"
				></textarea>
			</div>
		</div>

		<div class="p-4 border-t border-border flex justify-between items-center">
			<p class="text-xs text-zinc-600">Press <kbd class="px-1 py-0.5 bg-surface-2 rounded text-zinc-500">Cmd+Enter</kbd> to create</p>
			<div class="flex gap-2">
				<button
					on:click={() => dispatch('close')}
					class="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
				>
					Cancel
				</button>
				<button
					on:click={handleCreate}
					disabled={!subject.trim() || isCreating}
					class="px-4 py-2 text-sm bg-lt-cyan text-zinc-900 font-medium rounded-md hover:bg-lt-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{isCreating ? 'Creating...' : 'Create Story'}
				</button>
			</div>
		</div>
	</div>
</div>
