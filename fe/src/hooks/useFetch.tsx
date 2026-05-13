function useFetch() {
  const get = async (url: string) => {
    const response = await fetch(url);
    
    const { ok, data, error } = await response.json();
    if (!ok) throw new Error(error?.message);
    return data;
  };

  const post = async (url: string, body: any) => {
    const jsonHeaders = { "Content-Type": "application/json" };
    const init = { method: "POST", headers: jsonHeaders, body: JSON.stringify(body) };
    const response = await fetch(url, init);
    const { ok, data, error } = await response.json();
    if (!ok) throw new Error(error?.message);
    return data;
  };

  const patch = async (url: string, body: any) => {
    const jsonHeaders = { "Content-Type": "application/json" };
    const init = { method: "PATCH", headers: jsonHeaders, body: JSON.stringify(body) };

    const response = await fetch(url, init);
    const { ok, data, error } = await response.json();
    if (!ok) throw new Error(error?.message);
    return data;
  };
  
  const del = async (url: string) => {
    const response = await fetch(url, { method: "DELETE" });
    const { ok, data, error } = await response.json();
    if (!ok) throw new Error(error?.message);
    return data;
  };

  return { get, post, patch, del };
}

export default useFetch;