import { api } from './client';
import type { UserStory, UserStoryStatus } from './types';

export async function getUserStories(projectId: number): Promise<UserStory[]> {
	return api.get<UserStory[]>('/userstories', {
		project: projectId,
		page_size: 500,
		order_by: '-modified_date'
	});
}

export async function getUserStory(id: number): Promise<UserStory> {
	return api.get<UserStory>(`/userstories/${id}`);
}

export async function updateUserStory(id: number, data: Partial<UserStory>): Promise<UserStory> {
	return api.patch<UserStory>(`/userstories/${id}`, data);
}

export async function getUserStoryStatuses(projectId: number): Promise<UserStoryStatus[]> {
	return api.get<UserStoryStatus[]>('/userstory-statuses', { project: projectId });
}

export async function createUserStory(data: {
	project: number;
	subject: string;
	status?: number;
	description?: string;
}): Promise<UserStory> {
	return api.post<UserStory>('/userstories', data);
}
