import type { User, UserRole } from "@/lib/types"
import { store, generateId } from "@/lib/store"

export interface SignupData {
  name: string
  email: string
  phone: string
  password: string
  role: UserRole
  cluster: string
}

export interface LoginData {
  email: string
  password: string
}

// Store passwords separately (hashed in real app)
function getPasswords(): Record<string, string> {
  if (typeof window === "undefined") return {}
  try {
    const data = localStorage.getItem("sunfix_passwords")
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

function setPassword(email: string, password: string) {
  const passwords = getPasswords()
  passwords[email] = password
  localStorage.setItem("sunfix_passwords", JSON.stringify(passwords))
}

export function signup(data: SignupData): { success: boolean; user?: User; error?: string } {
  const users = store.getUsers()
  const existing = users.find((u) => u.email === data.email)
  if (existing) {
    return { success: false, error: "An account with this email already exists" }
  }

  const user: User = {
    id: generateId(),
    name: data.name,
    email: data.email,
    phone: data.phone,
    role: data.role,
    cluster: data.cluster,
    createdAt: new Date().toISOString(),
  }

  users.push(user)
  store.setUsers(users)
  store.setCurrentUser(user)
  setPassword(data.email, data.password)

  return { success: true, user }
}

export function login(data: LoginData): { success: boolean; user?: User; error?: string } {
  const users = store.getUsers()
  const user = users.find((u) => u.email === data.email)

  if (!user) {
    return { success: false, error: "No account found with this email" }
  }

  const passwords = getPasswords()
  if (passwords[data.email] !== data.password) {
    return { success: false, error: "Incorrect password" }
  }

  store.setCurrentUser(user)
  return { success: true, user }
}

export function logout(): void {
  store.setCurrentUser(null)
}

export function getCurrentUser(): User | null {
  return store.getCurrentUser()
}
