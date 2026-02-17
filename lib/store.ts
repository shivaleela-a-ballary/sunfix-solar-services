// localStorage helpers for persistent data storage

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : fallback
  } catch {
    return fallback
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable
  }
}

function removeItem(key: string): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(key)
}

export const store = {
  // Users
  getUsers: () => getItem<import("./types").User[]>("sunfix_users", []),
  setUsers: (users: import("./types").User[]) => setItem("sunfix_users", users),

  // Technicians
  getTechnicians: () => getItem<import("./types").Technician[]>("sunfix_technicians", []),
  setTechnicians: (techs: import("./types").Technician[]) => setItem("sunfix_technicians", techs),

  // Jobs
  getJobs: () => getItem<import("./types").Job[]>("sunfix_jobs", []),
  setJobs: (jobs: import("./types").Job[]) => setItem("sunfix_jobs", jobs),

  // Ratings
  getRatings: () => getItem<import("./types").Rating[]>("sunfix_ratings", []),
  setRatings: (ratings: import("./types").Rating[]) => setItem("sunfix_ratings", ratings),

  // Current user session
  getCurrentUser: () => getItem<import("./types").User | null>("sunfix_current_user", null),
  setCurrentUser: (user: import("./types").User | null) => setItem("sunfix_current_user", user),

  // Clear all
  clearAll: () => {
    removeItem("sunfix_users")
    removeItem("sunfix_technicians")
    removeItem("sunfix_jobs")
    removeItem("sunfix_ratings")
    removeItem("sunfix_current_user")
  },
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
