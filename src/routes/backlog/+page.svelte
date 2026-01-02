<script lang="ts">
	import { currentProject } from '$lib/stores/project';
	import { getUserStories } from '$lib/api/userstories';
	import type { UserStory } from '$lib/api/types';

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
			stories = await getUserStories(projectId);
			// Sort by backlog order
			stories = stories.sort((a, b) => a.backlog_order - b.backlog_order);
		} catch (err) {
			error = err instanceof Error ? err.message : 'Failed to load backlog';
			console.error('Failed to load backlog:', err);
		} finally {
			isLoading = false;
		}
	}

	// Calculate totals
	$: openStories = stories.filter(s => !s.is_closed);
	$: totalPoints = stories.reduce((sum, s) => sum + (s.total_points || 0), 0);
	$: openPoints = openStories.reduce((sum, s) => sum + (s.total_points || 0), 0);

	function getInitials(name: string): string {
		return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
	}
</script>

<svelte:head>
	<title>Backlog - TaigaLT</title>
</svelte:head>

<div class="h-full flex flex-col">
	<!-- Header -->
	<header class="flex items-center justify-between px-6 py-4 border-b border-border">
		<div>
			<h1 class="text-lg font-semibold text-zinc-100">{$currentProject?.name || 'Select a project'}</h1>
			<p class="text-sm text-zinc-500">Backlog · {openStories.length} stories · {openPoints} points</p>
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

	<!-- Backlog List -->
	<div class="flex-1 overflow-auto">
		{#if isLoading}
			<div class="flex items-center justify-center h-full">
				<div class="text-zinc-500">Loading backlog...</div>
			</div>
		{:else if error}
			<div class="flex items-center justify-center h-full">
				<div class="text-red-400">{error}</div>
			</div>
		{:else if !$currentProject}
			<div class="flex items-center justify-center h-full">
				<div class="text-zinc-500">Select a project to view the backlog</div>
			</div>
		{:else if stories.length === 0}
			<div class="flex items-center justify-center h-full">
				<div class="text-zinc-500">No stories in backlog</div>
			</div>
		{:else}
			<table class="w-full">
				<thead class="sticky top-0 bg-surface-1 border-b border-border">
					<tr class="text-left text-xs text-zinc-500 uppercase tracking-wider">
						<th class="px-6 py-3 w-16">Ref</th>
						<th class="px-6 py-3">Story</th>
						<th class="px-6 py-3 w-32">Status</th>
						<th class="px-6 py-3 w-32">Assignee</th>
						<th class="px-6 py-3 w-20 text-right">Points</th>
					</tr>
				</thead>
				<tbody class="divide-y divide-border">
					{#each stories as story (story.id)}
						<tr class="hover:bg-surface-2 transition-colors cursor-pointer group">
							<td class="px-6 py-3">
								<span class="text-zinc-500 text-sm">#{story.ref}</span>
							</td>
							<td class="px-6 py-3">
								<div class="flex flex-col gap-1">
									<span class="text-zinc-100 group-hover:text-lt-cyan transition-colors">{story.subject}</span>
									<div class="flex items-center gap-2">
										{#if story.epics}
											{#each story.epics as epic}
												<span
													class="text-xs px-1.5 py-0.5 rounded"
													style="background-color: {epic.color}20; color: {epic.color}"
												>
													{epic.subject}
												</span>
											{/each}
										{/if}
										{#if story.tags}
											{#each story.tags as [tag, color]}
												<span
													class="text-xs px-1.5 py-0.5 rounded"
													style="background-color: {color || '#666'}20; color: {color || '#999'}"
												>
													{tag}
												</span>
											{/each}
										{/if}
									</div>
								</div>
							</td>
							<td class="px-6 py-3">
								<span
									class="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
									style="background-color: {story.status_extra_info.color}20; color: {story.status_extra_info.color}"
								>
									<span class="w-1.5 h-1.5 rounded-full" style="background-color: {story.status_extra_info.color}"></span>
									{story.status_extra_info.name}
								</span>
							</td>
							<td class="px-6 py-3">
								{#if story.assigned_to_extra_info}
									<div class="flex items-center gap-2">
										<div
											class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
											style="background-color: {story.assigned_to_extra_info.color}"
										>
											{getInitials(story.assigned_to_extra_info.full_name)}
										</div>
										<span class="text-sm text-zinc-400">{story.assigned_to_extra_info.full_name.split(' ')[0]}</span>
									</div>
								{:else}
									<span class="text-zinc-600 text-sm">Unassigned</span>
								{/if}
							</td>
							<td class="px-6 py-3 text-right">
								<span class="text-zinc-100 font-medium">{story.total_points || '-'}</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/if}
	</div>

	<!-- Footer summary -->
	{#if !isLoading && !error && stories.length > 0}
		<footer class="px-6 py-3 border-t border-border bg-surface-1 flex items-center justify-between text-sm">
			<span class="text-zinc-500">{stories.length} total stories</span>
			<span class="text-zinc-400">Total: <span class="text-zinc-100 font-medium">{totalPoints} points</span></span>
		</footer>
	{/if}
</div>
