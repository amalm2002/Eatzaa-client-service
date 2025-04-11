import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

interface UsePaginatedFetchProps<T> {
  url: string;
  queryParams?: Record<string, any>;
  pageSize?: number;
}

export function usePaginatedFetch<T>({
  url,
  queryParams = {},
  pageSize = 10,
}: UsePaginatedFetchProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const prevQueryParamsRef = useRef<string>('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url, {
        params: {
          ...queryParams,
          page,
          limit: pageSize,
        },
      });

      setData(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error('Error fetching paginated data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentParams = JSON.stringify(queryParams);
    if (prevQueryParamsRef.current !== currentParams) {
      prevQueryParamsRef.current = currentParams;
      setPage(1); 
    }
    fetchData();
  }, [page, queryParams]);

  return { data, loading, page, totalPages, setPage };
}
