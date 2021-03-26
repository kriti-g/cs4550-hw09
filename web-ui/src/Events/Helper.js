export function inInvites(user_id, eve) {
  return eve.invites.some((inv) => inv.user.id === user_id);
}

export function getThisInvite(user_id, invites) {
  return invites.find((inv) => inv.user.id === user_id);
}

export function isOwner(user_id, eve) {
  return user_id === eve.user.id;
}

export function countInvites(invites) {
  let responses =  invites.reduce((responses, invite) => {
    let [yes, maybe, no, pending] = responses;
    switch(invite.response) {
      case "Yes": return [yes+1, maybe, no, pending];
      case "Maybe": return [yes, maybe+1, no, pending];
      case "No": return [yes, maybe, no+1, pending];
      case "Pending": return [yes, maybe, no, pending+1];
    }
  }, [0, 0, 0, 0]);
  let [yes, maybe, no, pending] = responses;
  return yes + " yes, " + maybe + " maybe, " + no + " no, " + pending + " pending."
}

export function formatDate(d) {
  var month = '' + (d.getMonth() + 1),
  day = '' + d.getDate(),
  year = d.getFullYear(),
  hours = '' + d.getHours(),
  minutes = '' + d.getMinutes(),
  seconds = '' + d.getSeconds();

  if (month.length < 2)
  month = '0' + month;
  if (day.length < 2)
  day = '0' + day;
  if (hours.length < 2)
  hours = '0' + hours;
  if (minutes.length < 2)
  minutes = '0' + minutes;
  if (seconds.length < 2)
  seconds = '0' + seconds;

  return [year, month, day].join('-') + ' ' + [hours, minutes, seconds].join(':');
}
