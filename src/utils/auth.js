const getUser = (req) => {
    req.user || (req.session && req.session.user)
}

const normalizeRole = (user) => {
    (user?.role || user?.userRole || "").toLowerCase()
}

const isPM = (user) => {
  const role = normalizeRole(user);
  return role === "pm" || role === "projectmanager";
}

module.exports = { getUser, isPM, normalizeRole };
