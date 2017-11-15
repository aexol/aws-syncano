async function isAdmin(ctx) {
  if (!ctx.meta.admin) {
    return false
  }
  return true
}

export {isAdmin}
