<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Epic } from '$lib/api/types';
	import { createEpic } from '$lib/api/epics';

	export let projectId: number;

	const dispatch = createEventDispatcher<{
		close: void;
		created: Epic;
	}>();

	let subject = '';
	let description = '';
	let color = '#3b82f6'; // Default blue
	let isCreating = false;

	const colors = [
		'#3b82f6', // blue
		'#8b5cf6', // purple
		'#ec4899', // pink
		'#ef4444', // red
		'#f97316', // orange
		'#eab308', // yellow
		'#22c55e', // green
		'#14b8a6', // teal
		'#06b6d4', // cyan
	];

	async function handleCreate() {
		if (!subject.trim() || isCreating) return;

		isCreating = true;
		try {
			const epic = await createEpic({
				project: projectId,
				subject: subject.trim(),
				description: description.trim(),
				color
			});
			dispatch('created', epic);
		} catch (err) {
			console.error('Failed to create epic:', err);
			alert('Failed to create epic: ' + (err as Error).message);
		} finally {
			isCreating = false;
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
			<h2 class="text-lg font-semibold text-zinc-100">New Epic</h2>
		</div>

		<div class="p-4 space-y-4">
			<div>
				<label for="epic-subject" class="block text-sm font-medium text-zinc-400 mb-1">Title</label>
				<input
					id="epic-subject"
					type="text"
					bind:value={subject}
					placeholder="Epic name"
					class="w-full px-3 py-2 bg-surface-2 border border-border rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-lt-cyan focus:border-transparent"
					autofocus
				/>
			</div>

			<div>
				<label class="block text-sm font-medium text-zinc-400 mb-2">Color</label>
				<div class="flex gap-2 flex-wrap">
					{#each colors as c}
						<button
							type="button"
							on:click={() => color = c}
							class="w-8 h-8 rounded-full transition-transform {color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-surface-1 scale-110' : 'hover:scale-110'}"
							style="background-color: {c}"
						></button>
					{/each}
				</div>
			</div>

			<div>
				<label for="epic-desc" class="block text-sm font-medium text-zinc-400 mb-1">Description</label>
				<textarea
					id="epic-desc"
					bind:value={description}
					placeholder="Describe the epic (optional)"
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
					{isCreating ? 'Creating...' : 'Create Epic'}
				</button>
			</div>
		</div>
	</div>
</div>
