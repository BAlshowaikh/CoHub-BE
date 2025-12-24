const STATUS_ORDER = ["todo", "doing", "done"];

const isValidStatus = (status) =>{
    STATUS_ORDER.includes(status)
}

const canTransition = (from, to) => {
  if (from === to) return true;
  const fromIdx = STATUS_ORDER.indexOf(from);
  const toIdx = STATUS_ORDER.indexOf(to);
  if (fromIdx === -1 || toIdx === -1) return false;
  return toIdx === fromIdx + 1; // strict forward-only
}

module.exports = { STATUS_ORDER, isValidStatus, canTransition };
