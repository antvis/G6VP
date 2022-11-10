/**
 * 获取hash上的search对象
 * @param location
 * @returns
 */
 export const getSearchParams = (location: Location) => {
    const { hash } = location;
    const [path, search] = hash.split('?');
    const searchParams = new URLSearchParams(search);
    return {
      path,
      searchParams,
    };
};
