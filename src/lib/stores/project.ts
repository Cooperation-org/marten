import { writable } from 'svelte/store';
import type { Project } from '$lib/api/types';

// Get saved project ID from localStorage
function getSavedProjectId(): number | null {
	if (typeof window === 'undefined') return null;
	const saved = localStorage.getItem('selected_project_id');
	return saved ? parseInt(saved, 10) : null;
}

// Create a custom store that persists to localStorage
function createProjectStore() {
	const { subscribe, set, update } = writable<Project | null>(null);

	return {
		subscribe,
		set: (project: Project | null) => {
			if (typeof window !== 'undefined') {
				if (project) {
					localStorage.setItem('selected_project_id', String(project.id));
				} else {
					localStorage.removeItem('selected_project_id');
				}
			}
			set(project);
		},
		update,
		getSavedId: getSavedProjectId
	};
}

// Current selected project
export const currentProject = createProjectStore();
export const currentProjectSlug = writable<string | null>(null);
