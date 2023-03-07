import { API_URL, PAGINATION_LIMIT } from 'utils/api';

export function fetcher<IResource>(url: string): Promise<IResource> {
  return fetch(url).then(res => res.json());
}

export const getTagsQueryString = (tagIds: number[]) => tagIds.map(id => `tagId=${id}`).join('&');

export const allowNextQuery = (page: number, totalRecords: number) => {
  const retrievedRecords = (page + 1) * PAGINATION_LIMIT;
  return totalRecords > PAGINATION_LIMIT && retrievedRecords < totalRecords;
};

export const getBasicQuery = (resourceName: string, index: number) =>
  `${API_URL}${resourceName}?page=${index}&limit=${PAGINATION_LIMIT}`;
