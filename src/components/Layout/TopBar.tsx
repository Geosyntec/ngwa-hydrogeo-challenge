import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Login from "@mui/icons-material/Login";
import Logout from "@mui/icons-material/Logout";
import School from "@mui/icons-material/School";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  logout as logoutAction,
  selectIsAuthenticated,
  selectAuthUser,
} from "../../features/auth/authSlice";
import { logout as logoutApi } from "../../api/mockLogoutApi";
import { ROUTES, NAV_ITEMS, testHrefWithTeacherId } from "../../app/routes";
import { resolvePublicAssetUrl } from "../../utils/publicAssetUrl";

export default function TopBar() {
  const theme = useTheme();
  const brandColor = theme.palette.secondary.main;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectAuthUser);
  const [accountAnchor, setAccountAnchor] = useState<null | HTMLElement>(null);

  const openAccountMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAccountAnchor(e.currentTarget);
  };
  const closeAccountMenu = () => setAccountAnchor(null);

  const handleSignOut = async () => {
    closeAccountMenu();
    try {
      await logoutApi();
      dispatch(logoutAction());
      navigate(ROUTES.home);
    } catch {
      dispatch(logoutAction());
      navigate(ROUTES.home);
    }
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#000000',
        boxShadow: "none",
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          minHeight: { xs: 48, sm: 56 },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        {/* Left: brand */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flex: 1,
            gap: 1.25,
            minWidth: 0,
          }}
        >
          <Box
            component="img"
            src={resolvePublicAssetUrl("/assets/img/gw_logo.png")}
            alt="AquiferLab"
            sx={{
              height: { xs: 28, sm: 32 },
              width: "auto",
              objectFit: "contain",
              display: "block",
              flexShrink: 0,
            }}
          />
          <Typography
            component="span"
            πhydrology
            variant="h6"
            sx={{
              color: brandColor,
              fontWeight: 600,
              display: { xs: "none", sm: "block" },
            }}
          >
            AquiferLab
          </Typography>
        </Box>

        {/* Right: nav pills + account menu */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            component="nav"
            sx={{
              display: "flex",
              alignItems: "center",
              "& .nav-link": {
                color: "rgba(255,255,255,0.9)",
                textDecoration: "none",
                padding: theme.spacing(1, 1.5),
                borderRadius: theme.shape.borderRadius,
                fontSize: "0.875rem",
                "&:hover": {
                  color: brandColor,
                  backgroundColor: "rgba(255,255,255,0.08)",
                },
                "&.active": { color: brandColor, fontWeight: 600 },
              },
              "& .nav-divider": {
                width: 1,
                height: 20,
                backgroundColor: "rgba(255,255,255,0.3)",
                margin: 0,
              },
            }}
          >
            {NAV_ITEMS.map((item) => {
              return (
                <Box
                  key={item.path}
                  component="span"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    end={item.path === ROUTES.home}
                  >
                    {item.label}
                  </NavLink>
                </Box>
              );
            })}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
            <IconButton
              onClick={openAccountMenu}
              color="inherit"
              aria-label="Account menu"
              aria-controls={accountAnchor ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={accountAnchor ? "true" : "false"}
              sx={{ color: "rgba(255,255,255,0.9)" }}
            >
              <AccountCircle />
            </IconButton>
            {user?.name && (
              <Typography
                variant="body2"
                sx={{
                  color: "rgba(255,255,255,0.8)",
                  display: { xs: "none", sm: "block" },
                  mr: 0.5,
                }}
              >
                {user.name}
              </Typography>
            )}
          </Box>
          <Menu
            id="account-menu"
            anchorEl={accountAnchor}
            open={Boolean(accountAnchor)}
            onClose={closeAccountMenu}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{ sx: { minWidth: 200 } }}
          >
            <MenuItem
              component={Link}
              to={ROUTES.grading}
              onClick={closeAccountMenu}
            >
              <ListItemIcon>
                <School fontSize="small" />
              </ListItemIcon>
              <ListItemText>Teacher Portal</ListItemText>
            </MenuItem>
            {isAuthenticated ? (
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sign out</ListItemText>
              </MenuItem>
            ) : (
              <MenuItem
                component={Link}
                to={ROUTES.login}
                onClick={closeAccountMenu}
              >
                <ListItemIcon>
                  <Login fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sign in</ListItemText>
              </MenuItem>
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
