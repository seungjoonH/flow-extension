function useFetch() {
  const get = async (url: string) => {
    const response = await fetch(url);
    const { data, error } = await response.json();
    return { data, error };
  };

  const post = async (url: string, body: any) => {
    const jsonHeaders = { "Content-Type": "application/json" };
    const init = { method: "POST", headers: jsonHeaders, body: JSON.stringify(body) };
    const response = await fetch(url, init);
    const { data, error } = await response.json();
    return { data, error };
  };

  const patch = async (url: string, body: any) => {
    const jsonHeaders = { "Content-Type": "application/json" };
    const init = { method: "PATCH", headers: jsonHeaders, body: JSON.stringify(body) };

    const response = await fetch(url, init);
    const { data, error } = await response.json();
    return { data, error };
  };
  
  const del = async (url: string) => {
    const response = await fetch(url, { method: "DELETE" });
    const { data, error } = await response.json();
    return { data, error };
  };

  return { get, post, patch, del };
}

export default useFetch;