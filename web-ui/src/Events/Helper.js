export function inInvites(user_id, eve) {
  return eve.invites.some((inv) => inv.user.id === user_id);
}

export function isOwner(user_id, eve) {
  console.log(["is owner", user_id, eve.user.id, user_id === eve.user.id])
  return user_id === eve.user.id;
}
