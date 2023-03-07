import useSWRInfinite from 'swr/infinite';
import { Resource, Response } from './models';
import { getTagsQueryString, getBasicQuery, allowNextQuery, fetcher } from './utils';

const useResources = (resourceName: string, tagIds: number[] = []): Resource => {
  const tagsQuery = getTagsQueryString(tagIds);

  const getKey = (index: number) => {
    const basicQuery = getBasicQuery(resourceName, index);
    const queryString = tagIds.length > 0 ? `${basicQuery}&${tagsQuery}` : basicQuery;
    return queryString;
  };

  const { data: payload, error, isValidating, size, setSize } = useSWRInfinite<Response>(getKey, fetcher);
  const uniqueTagIds: number[] = Array.from(new Set());

  const info = payload?.[payload.length - 1].info || { page: 0, totalRecords: 0 };
  const isNextQueryAllowed = allowNextQuery(info.page, info.totalRecords);

  return {
    payload,
    uniqueTagIds,
    isNextQueryAllowed,
    isLoading: !error && !payload,
    isError: error,
    isValidating,
    size,
    setSize,
  };
};

export default useResources;
