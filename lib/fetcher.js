import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';

const fetcher = (url, args) => {
  const argsFiltered = pickBy(args);
  const params = new URLSearchParams(argsFiltered);
  const thisUrl = !isEmpty(argsFiltered) ? `${url}?${params}` : url;
  return fetch(thisUrl).then(r => r.json());
}

export default fetcher;