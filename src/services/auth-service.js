const API_URL = import.meta.env.VITE_API_URL;

// Get stored tokens
export function getTokens() {
  return {
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
  }
}

// Get current user from localStorage
export function getCurrentUser() {
  const userJson = localStorage.getItem("user")
  return userJson ? JSON.parse(userJson) : null
}

// Check if user is authenticated
export function isAuthenticated() {
  return !!getTokens().accessToken
}

// Check if user has required role
export function hasRole(requiredRoles) {
  const user = getCurrentUser()

  if (!user) return false

  if (Array.isArray(requiredRoles)) {
    return requiredRoles.includes(user.role)
  }

  return user.role === requiredRoles
}

// Refresh access token
export async function refreshToken() {
  const { refreshToken } = getTokens()

  if (!refreshToken) {
    throw new Error("No refresh token available")
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    })

    if (!response.ok) {
      throw new Error("Failed to refresh token")
    }

    const data = await response.json()
    localStorage.setItem("accessToken", data.accessToken)

    return data.accessToken
  } catch (error) {
    // If refresh fails, log the user out
    logout()
    throw error
  }
}

// Logout user
export function logout() {
  const { refreshToken } = getTokens()

  // Call logout API to invalidate refresh token
  if (refreshToken) {
    fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    }).catch(console.error) // Ignore errors on logout
  }

  // Clear local storage
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("user")
}

// Authenticated API request with token refresh
export async function authenticatedFetch(url, options = {}) {
  // Get access token
  let { accessToken } = getTokens()

  // Set up headers
  const headers = {
    ...options.headers,
    Authorization: `Bearer ${accessToken}`,
  }

  // Make request
  let response = await fetch(url, {
    ...options,
    headers,
  })

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    try {
      accessToken = await refreshToken()

      // Retry with new token
      headers.Authorization = `Bearer ${accessToken}`
      response = await fetch(url, {
        ...options,
        headers,
      })
    } catch (error) {
      console.error("Token refresh failed:", error)
      throw new Error("Authentication failed. Please log in again.")
    }
  }

  return response
}
