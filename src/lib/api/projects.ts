import { api } from './client';
import type { Project } from './types';

export async function getProjects(): Promise<Project[]> {
	return api.get<Project[]>('/projects');
}

export async function getProject(projectId: number): Promise<Project> {
	return api.get<Project>(`/projects/${projectId}`);
}

export async function getProjectBySlug(slug: string): Promise<Project> {
	const projects = await api.get<Project[]>('/projects', { slug });
	if (projects.length === 0) {
		throw new Error(`Project not found: ${slug}`);
	}
	return projects[0];
}

export async function updateProjectTags(projectId: number, tags: [string, string | null][]): Promise<Project> {
	return api.patch<Project>(`/projects/${projectId}`, { tags });
}

export function isArchived(project: Project): boolean {
	return project.tags?.some(([tag]) => tag.toLowerCase() === 'archived') ?? false;
}
