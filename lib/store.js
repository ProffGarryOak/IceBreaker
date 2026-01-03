import { create } from "zustand";

export const useContentStore = create((set, get) => ({
  content: null,
  isLoading: false,
  error: null,
  isInitialized: false,

  fetchContent: async (force = false) => {
    const { content, isLoading, isInitialized } = get();

    // If already loaded and not forcing, return queries
    if (isInitialized && content && !force) {
      return;
    }

    // If already loading, don't trigger another request
    if (isLoading) return;

    set({ isLoading: true, error: null });

    try {
      const res = await fetch("/api/content/get");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      set({ content: data, isInitialized: true, error: null });
    } catch (err) {
      set({ error: err.message });
      console.error("Store fetch error:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // Partial update for optimistic UI
  updateContent: (newContent) => {
    set({ content: newContent });
  },

  // Helper to move item (replicates Dashboard logic)
  moveContentItem: async (itemId, category, fromList, toList) => {
    const { content, updateContent, fetchContent } = get();
    if (!content) return;

    // Optimistic update
    try {
      const itemToMove = content[category][fromList].find(
        (item) => item.id === itemId
      );

      if (!itemToMove) throw new Error("Item not found");

      const newContent = JSON.parse(JSON.stringify(content));
      newContent[category][fromList] = newContent[category][fromList].filter(
        (item) => item.id !== itemId
      );
      newContent[category][toList].push(itemToMove);

      updateContent(newContent);

      // API Call
      const res = await fetch("/api/content/move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          fromList,
          toList,
          itemId,
        }),
      });

      if (!res.ok) throw new Error("Failed to move item");
    } catch (err) {
      console.error("Store move error:", err);
      // Revert/Refetch on error
      fetchContent(true);
      throw err; // Re-throw to let component handle UI feedback if needed
    }
  },

  // Helper to remove item
  removeContentItem: async (itemId, category, list) => {
    const { content, updateContent, fetchContent } = get();
    if (!content) return;

    try {
      // Optimistic update
      const newContent = { ...content }; // Shallow copy is ok if we deeply clone the changed part, but pure deep clone is safer or structured clone
      // Deep clone for safety when manipulating nested arrays
      const deepContent = JSON.parse(JSON.stringify(content));

      deepContent[category][list] = deepContent[category][list].filter(
        (item) => item.id !== itemId
      );

      updateContent(deepContent);

      const res = await fetch("/api/content/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          list,
          itemId,
        }),
      });

      if (!res.ok) throw new Error("Failed to remove item");
    } catch (err) {
      console.error("Store remove error:", err);
      // Revert
      fetchContent(true);
      throw err;
    }
  },
}));
