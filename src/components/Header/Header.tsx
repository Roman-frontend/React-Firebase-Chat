import React, { useState, useContext, useMemo, memo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@mui/material/styles";
import {
  Grid,
  AppBar,
  Zoom,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Avatar,
  Drawer,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HeaderProfile from "./HeaderProfile/HeaderProfile.jsx";
import { MaterialUISwitch } from "./HeaderStyles";
import { CustomThemeContext } from "../../Context/AppContext";
import imageProfile from "../../images/User-Icon.png";
import "tippy.js/dist/tippy.css";
import "../../i18n";

interface IProps {
  isOpenLeftBar: boolean;
  setIsOpenLeftBar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = memo((props: IProps) => {
  const theme = useTheme();
  const { isOpenLeftBar, setIsOpenLeftBar } = props;
  const { currentTheme, setTheme } = useContext(CustomThemeContext);
  const menuId = "primary-search-account-menu";
  const { t, i18n } = useTranslation();
  const [isOpenRightBarUser, setIsOpenRightBarUser] = useState(false);
  const tooltipEn = useMemo(() => {
    return i18n.language === "en"
      ? t("description.infoLanguage")
      : t("description.changeEnLanguage");
  }, [i18n.language]);
  const tooltipRu = useMemo(() => {
    return i18n.language === "ru"
      ? t("description.infoLanguage")
      : t("description.changeRuLanguage");
  }, [i18n.language]);

  const isDark = useMemo(() => {
    return Boolean(currentTheme === "dark");
  }, [currentTheme]);

  const changeLanguage = useCallback((language: string): void => {
    i18n.changeLanguage(language);
  }, []);

  const handleChangeSwitch = useCallback(
    (event: { target: { checked: boolean } }) => {
      const { checked } = event.target;
      if (
        !checked &&
        setTheme &&
        {}.toString.call(setTheme) === "[object Function]"
      ) {
        setTheme("dark");
      } else if (
        setTheme &&
        {}.toString.call(setTheme) === "[object Function]"
      ) {
        setTheme("light");
      }
    },
    []
  );

  const openRightBar: () => void = (): void => {
    setIsOpenRightBarUser(true);
  };

  const closeRightBar: () => void = (): void => {
    setIsOpenRightBarUser(false);
  };

  return (
    <Grid container spacing={1} style={{ justifyContent: "space-between" }}>
      <AppBar
        color="primary"
        sx={{
          "& .MuiAppBar-colorPrimary": {
            color: theme.palette.primary.dark,
          },
          background: theme.palette.primary.dark,
        }}
        position="relative"
      >
        <Toolbar>
          <IconButton
            onClick={() => setIsOpenLeftBar(!isOpenLeftBar)}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Grid item xs={9}>
            <Typography variant="h6" noWrap component="div">
              {t("description.header")}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <MaterialUISwitch
              sx={{ m: 1 }}
              checked={!isDark}
              onChange={handleChangeSwitch}
            />
          </Grid>
          <Grid item xs={1}>
            <Tooltip
              title={tooltipEn}
              TransitionComponent={Zoom}
              placement="bottom"
            >
              <Button
                style={{
                  background:
                    i18n.language === "en"
                      ? theme.palette.primary.main
                      : "none",
                  border: i18n.language === "en" ? "solid 2px" : "none",
                  padding: 0,
                }}
                color="inherit"
                onClick={() => changeLanguage("en")}
              >
                EN
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={1}>
            <Tooltip
              title={tooltipRu}
              TransitionComponent={Zoom}
              placement="bottom"
            >
              <Button
                style={{
                  background:
                    i18n.language === "ru"
                      ? theme.palette.primary.main
                      : "none",
                  border: i18n.language === "ru" ? "solid 2px" : "none",
                  padding: 0,
                }}
                color="inherit"
                onClick={() => changeLanguage("ru")}
              >
                RU
              </Button>
            </Tooltip>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              size="large"
              edge="end"
              data-testid="profile-button"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={openRightBar}
            >
              <Avatar alt="Remy Sharp" src={imageProfile} />
            </IconButton>
          </Grid>
          <div>
            <React.Fragment>
              <Drawer
                anchor="right"
                sx={{
                  "& .MuiDrawer-paperAnchorRight": {
                    background: theme.palette.primary.main,
                  },
                }}
                open={isOpenRightBarUser}
                onClose={closeRightBar}
              >
                <Box
                  sx={{ width: 250, margin: "56px 0px 0px 0px" }}
                  role="presentation"
                >
                  <HeaderProfile />
                </Box>
              </Drawer>
            </React.Fragment>
          </div>
        </Toolbar>
      </AppBar>
    </Grid>
  );
});

export default Header;
