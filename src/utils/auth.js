const normalizeRole = (user) => {
  return (user?.role || user?.userRole || "").toLowerCase()
}

const isPM = (user) => {
  const role = normalizeRole(user);
  return role === "pm" || role === "projectmanager"
}

module.exports = { isPM, normalizeRole }
