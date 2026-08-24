
const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/notes`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getNotes = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch notes");
  }

  return Array.isArray(data.notes) ? data.notes : [];
};

export const createNote = async (title, content) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, content }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create note");
  }

  return data.note;
};

export const updateNote = async (id, title, content) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, content }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to update note");
  }

  return data.note;
};

export const deleteNote = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete note");
  }

  return data;
};