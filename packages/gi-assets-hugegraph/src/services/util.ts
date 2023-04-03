/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url: string, options: any = {}, errorHandlerOptions = { skipErrorHandler: false }) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions: any = {
    ...defaultOptions,
    ...options,
    params: { ...options?.data },
  };

  console.log('newOptions', newOptions);

  let defaultHeaders;
  if (!(newOptions.body instanceof FormData)) {
    // 跨域时请求时，不设置默认header
    if (options?.mode !== 'cors') {
      defaultHeaders = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
      };
    }

    newOptions.body = JSON.stringify(newOptions.body);
  } else {
    // newOptions.body is FormData
    defaultHeaders = {
      Accept: 'application/json',
    };
  }

  newOptions.headers = {
    ...defaultHeaders,
    ...newOptions.headers,
  };

  const formatUrl = url.replace('http://', '').replace('localhost', '127.0.0.1');
  console.log('fetch', formatUrl);
  return fetch(formatUrl, newOptions)
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will Report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then(response => {
      const noWrap = Reflect.has(response, 'success');
      if (!response || !Object.keys(response)?.length) {
        const error: any = new Error();
        error.errMessage = '接口请求错误';
        throw error;
      } else if (response.result) {
        const responseResult = noWrap ? response : response.result;

        // 成功后，统一提示
        if (responseResult.success) {
          // handleCustomSuccess(settings);
        } else {
          // 处理程序返回的错误
          const result = responseResult || {};
          const error = new Error(result.errMessage);
          Object.assign(error, result);
          throw error;
        }
      }
      return response;
    })
    .catch(error => {
      throw error;
    });
}
