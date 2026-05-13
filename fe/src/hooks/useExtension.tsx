import useFetch from "./useFetch";

function useExtension() {
  const { get, post, patch, del } = useFetch();

  const BASE_URL = "/api/exts";
  
  const getExtensions = async () => {
    return await get(BASE_URL);
  };

  const createCustomExt = async (name: string) => {
    return await post(`${BASE_URL}/custom`, { name });
  };

  const updateFixedExt = async (name: string, checked: boolean) => {
    return await patch(`${BASE_URL}/fixed/${name}`, { checked });
  };

  const deleteCustomExt = async (name: string) => {
    return await del(`${BASE_URL}/custom/${name}`);
  };

  return {
    getExtensions,
    createCustomExt,
    updateFixedExt,
    deleteCustomExt,
  };
}

export default useExtension;