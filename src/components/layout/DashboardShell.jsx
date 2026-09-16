/**
 * Shared by the player Dashboard and the StaffPanel, so chrome changes belong
 * here, not in either page.
 *
 * The sidebar is the console's one navy surface; the working area stays on
 * paper so a roster reads like a printed sheet.
 *
 * @param {object} props
 * @param {'dashboard'|'staff'} props.active - highlights the current nav entry
 * @param {React.ReactNode} props.children - main page content
 */
import { useNavigate } from "react-router-dom";
import { Home, LayoutDashboard, ShieldCheck, LogOut } from "lucide-react";
import { AppShell, Sidebar, SidebarItem, Button, Text } from "@bradley-t-t/sunday-design-system";
import { useAuth } from "../../context/AuthContext";
import BrandMark from "./BrandMark";

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
    <div data-surface="navy" className="flex h-full min-h-0 flex-col bg-ds-bg text-ds-text">
      <Sidebar
        brand={<Brand />}
        footer={
          <div className="space-y-3">
            <Text size="xs" tone="faint" truncate title={user?.email}>
              {user?.email}
            </Text>
            <Button variant="outline" size="sm" block className="control" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" aria-hidden="true" /> Sign Out
            </Button>
          </div>
        }
      >
        {items.map((item) => (
          <SidebarItem
            key={item.key}
            label={item.label}
            icon={item.icon}
            className="control"
            active={active === item.key}
            onClick={() => navigate(item.to)}
          />
        ))}
      </Sidebar>
    </div>
  );

  return (
    <AppShell sidebar={sidebar} brand={<Brand />}>
      {children}
    </AppShell>
  );
};

export default DashboardShell;
