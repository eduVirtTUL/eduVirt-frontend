export const injectToken = () => {
  const token = localStorage.getItem("token") ?? "";

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const stripEtag = (etag: string) => etag.replace(/"/g, "");
