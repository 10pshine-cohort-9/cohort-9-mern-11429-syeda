
const API_URL = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/notes`;

// ========================================
// AUTH HEADERS
// ========================================

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// ========================================
// GET ALL NOTES
// ========================================

export const getNotes = async () => {
  const response = await fetch(API_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch notes"
    );
  }

  return Array.isArray(data.notes)
    ? data.notes
    : [];
};

// ========================================
// CREATE NOTE
// ========================================

export const createNote = async ({
  title,
  content,
}) => {
  const body = {
    title: String(title || "").trim(),
    content: String(content || ""),
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to create note"
    );
  }

  return {
    note: data.note,
  };
};

// ========================================
// UPDATE NOTE
// ========================================

export const updateNote = async (
  id,
  { title, content }
) => {
  const body = {
    title: String(title || "").trim(),
    content: String(content || ""),
  };

  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update note"
    );
  }

  return {
    note: data.note,
  };
};

// ========================================
// DELETE NOTE
// ========================================

export const deleteNote = async (id) => {
  const response = await fetch(
    `${API_URL}/${id}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to delete note"
    );
  }

  return data;
};