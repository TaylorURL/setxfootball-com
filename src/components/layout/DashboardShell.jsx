/**
 * DashboardShell — the authenticated app chrome shared by the player Dashboard
 * and the StaffPanel. Wraps the design-system AppShell with a routed Sidebar
 * (brand, nav, signed-in footer) and a top bar carrying the ThemeToggle.
 *
 * @param {object} props
 * @param {'dashboard'|'staff'} props.active - highlights the current nav entry
 * @param {React.ReactNode} props.children - main page content
 */
import { Link, useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, ShieldCheck, LogOut } from "lucide-react";
import {
  AppShell,
  Sidebar,
  SidebarItem,
  Button,
  ThemeToggle,
  Text,
} from "@bradley-t-t/sunday-design-system";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.PNG";

const Brand = () => (
  <Link to="/" className="flex items-center gap-3">
    <span className="inline-flex h-9 w-9 items-center justify-center rounded-ds-md bg-ds-accent ring-1 ring-white/15">
      <img src={logo} alt="" className="h-7 w-7 object-contain" />
    </span>
    <span>
      <span className="block text-[14px] font-black uppercase tracking-[0.04em] text-ds-text">
        SETX Football
      </span>
      <span className="mt-0.5 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.22em] text-ds-text-muted">
        <span className="inline-block h-0.5 w-3 bg-ds-accent" /> Camp Console
      </span>
    </span>
  </Link>
);

const DashboardShell = ({ active, children }) => {
  const navigate = useNavigate();
  const { user, signOut, isStaff } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const items = [
    { key: "home", label: "Home", icon: <Home />, to: "/" },
    { key: "dashboard", label: "My Dashboard", icon: <LayoutDashboard />, to: "/dashboard" },
    ...(isStaff()
      ? [{ key: "staff", label: "Staff Panel", icon: <ShieldCheck />, to: "/staff" }]
      : []),
  ];

  const sidebar = (
    <Sidebar
      brand={<Brand />}
      footer={
        <div className="space-y-2.5">
          <Text size="xs" tone="faint" truncate title={user?.email}>
            {user?.email}
          </Text>
          <Button variant="outline" size="sm" block onClick={handleSignOut}>
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        </div>
      }
    >
      {items.map((item) => (
        <SidebarItem
          key={item.key}
          label={item.label}
          icon={item.icon}
          active={active === item.key}
          onClick={() => navigate(item.to)}
        />
      ))}
    </Sidebar>
  );

  return (
    <AppShell sidebar={sidebar} brand={<Brand />} header={<ThemeToggle variant="icon" />}>
      {children}
    </AppShell>
  );
};

export default DashboardShell;
