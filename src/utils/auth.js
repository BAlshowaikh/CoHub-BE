const normalizeRole = (user) => {
  const role = user?.role || ""
  return role.toLowerCase()
}

const isPM = (user) => {
  const role = normalizeRole(user);
  return role === "pm" || role === "manager"
}

module.exports = { isPM, normalizeRole }
