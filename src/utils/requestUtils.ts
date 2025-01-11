export const injectToken = () => {
  const token = localStorage.getItem("token") ?? "";

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
