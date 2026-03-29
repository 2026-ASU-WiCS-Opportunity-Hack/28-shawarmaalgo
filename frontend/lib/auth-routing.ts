export function getRoleDestination(role?: string | null) {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/portal/admin';
    case 'chapter_lead':
    case 'chapter-leader':
    case 'content_creator':
      return '/portal/chapter';
    case 'coach':
      return '/portal/coach';
    default:
      return null;
  }
}

export function isAuthenticatedRole(role?: string | null) {
  return getRoleDestination(role) !== null;
}
