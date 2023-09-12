export const post = async (url, data) => {
  const raw = await fetch(`/api${url}`, {
    method: "POST",
    headers: {
      Content_Type: "application/json",
    },
    body: JSON.stringify(data),
  });

  const response = await raw.json();

  return response;
};
