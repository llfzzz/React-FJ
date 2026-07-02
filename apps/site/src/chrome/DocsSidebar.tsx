import { NavLink } from 'react-router-dom';
import { NAV_GROUPS } from '../registry/nav';

export function SidebarNav() {
  return (
    <nav aria-label="Documentation">
      {NAV_GROUPS.map((group) => (
        <div className="sidebar-group" key={group.label}>
          <span className="fj-eyebrow">{group.label}</span>
          <ul className="sidebar-list">
            {group.items.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} className="sidebar-link">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar() {
  return (
    <aside className="docs-sidebar">
      <SidebarNav />
    </aside>
  );
}
