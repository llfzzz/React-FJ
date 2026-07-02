import { NavLink } from 'react-router-dom';
import { buildNavGroups } from '../registry/nav';

const NAV_GROUPS = buildNavGroups();

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
