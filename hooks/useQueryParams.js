import { useQueryParams as libUseQueryParams, StringParam, NumberParam, withDefault, encodeQueryParams } from 'use-query-params';
// import { stringify } from 'query-string';

export default function useQueryParams() {
  const structure = {
    sortBy: StringParam,
    sortOrder: StringParam,
    s: StringParam,
    perPage: NumberParam,
    pageNumber: NumberParam
  };

  const [ queryParams, setQueryParams ] = libUseQueryParams({
    sortBy: withDefault(StringParam, 'createdAt'),
    sortOrder: withDefault(StringParam, 'desc'),
    s: withDefault(StringParam, ''),
    perPage: withDefault(NumberParam, 30),
    pageNumber: withDefault(NumberParam, 1)
  });
  // const { sortBy, sortOrder, s: searchQuery, perPage, pageNumber } = queryParams;

  return { queryParams, setQueryParams, structure, encodeQueryParams };
}

