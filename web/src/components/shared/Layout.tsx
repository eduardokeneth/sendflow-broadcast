import { type ReactNode } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { logOut } from "../../services/auth";

type Props = { children: ReactNode };

export const Layout = ({ children }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/connections",
      label: "Conexões",
    },
  ];

  return (
    <div className="flex h-screen bg-surface">
      <aside className="w-64 bg-surface-container-low flex flex-col">
        <div className="h-16 flex items-center px-6">
          <h1 className="text-2xl font-bold text-on-surface font-grotesk">
            Sendflow
          </h1>
        </div>
        <nav className="flex-1 px-4 py-2">
          <ul>
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-2 text-on-surface rounded-md hover:bg-surface-container ${
                    location.pathname.startsWith(item.path)
                      ? "bg-primary-container text-on-primary"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-surface-container-low flex items-center justify-between px-6 border-b border-border-subtle">
          <div></div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-surface-container"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-on-surface-variant"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
