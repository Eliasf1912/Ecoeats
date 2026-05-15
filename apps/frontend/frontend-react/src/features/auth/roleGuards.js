export function canAccessClientViews(session) {
  return session?.backendRole === 'client';
}

export function canAccessDriverViews(session) {
  return session?.backendRole === 'deliveryman';
}

export function canAccessOwnerViews(session) {
  return session?.backendRole === 'restaurant';
}
