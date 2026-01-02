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
