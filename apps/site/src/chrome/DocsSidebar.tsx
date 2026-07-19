import { NavLink } from 'react-router-dom';
import { buildNavSections } from '../registry/nav';

const NAV_SECTIONS = buildNavSections();

export function SidebarNav() {
  return (
    <nav aria-label="Documentation">
      {NAV_SECTIONS.map((section, index) => (
        <div className="sidebar-section" key={section.label ?? index}>
          {section.label && <span className="sidebar-section-title">{section.label}</span>}
          {section.groups.map((group) => (
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
