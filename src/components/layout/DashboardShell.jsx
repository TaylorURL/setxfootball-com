/**
 * DashboardShell — the authenticated app chrome shared by the player Dashboard
 * and the StaffPanel. Wraps the design-system AppShell with a routed Sidebar
 * (brand, nav, signed-in footer) and a top bar carrying the ThemeToggle.
 *
 * @param {object} props
 * @param {'dashboard'|'staff'} props.active - highlights the current nav entry
 * @param {React.ReactNode} props.children - main page content
 */
import { useNavigate } from "react-router-dom";
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
import BrandMark from "../../components/brand/BrandMark";

const Brand = () => <BrandMark size="sm" subtitle="Camp Console" to="/" />;

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
