import { writable } from 'svelte/store';
import type { Project } from '$lib/api/types';

// Current selected project
export const currentProject = writable<Project | null>(null);
export const currentProjectSlug = writable<string | null>(null);
