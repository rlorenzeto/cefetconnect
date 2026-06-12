export function getEventCommunityId(event) {
  return (
    event?.comunidade?.idComunidade ||
    event?.fk_Comunidade_idComunidade ||
    event?.idComunidade ||
    null
  );
}

export function filterVisibleEvents(events = [], myCommunities = []) {
  const myCommunityIds = new Set(
    myCommunities
      .map((community) => String(community.idComunidade || ""))
      .filter(Boolean)
  );

  return events.filter((event) => {
    const eventCommunityId = getEventCommunityId(event);

    if (!eventCommunityId) {
      return true;
    }

    return myCommunityIds.has(String(eventCommunityId));
  });
}

export function isEventFinished(event) {
  if (!event?.dataEvento) return false;

  const eventDate = new Date(event.dataEvento);

  if (Number.isNaN(eventDate.getTime())) return false;

  return eventDate < new Date();
}

export function sortEventsWithFinishedLast(events = []) {
  return [...events].sort((a, b) => {
    const aFinished = isEventFinished(a);
    const bFinished = isEventFinished(b);

    if (aFinished !== bFinished) {
      return aFinished ? 1 : -1;
    }

    const aDate = new Date(a.dataEvento).getTime();
    const bDate = new Date(b.dataEvento).getTime();

    if (aFinished && bFinished) {
      return bDate - aDate;
    }

    return aDate - bDate;
  });
}

export function getUpcomingEvents(events = []) {
  return events
    .filter((event) => !isEventFinished(event))
    .sort(
      (a, b) =>
        new Date(a.dataEvento).getTime() - new Date(b.dataEvento).getTime()
    );
}