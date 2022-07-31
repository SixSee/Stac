import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import LogoutIcon from '@mui/icons-material/Logout';
import Typography from '@mui/material/Typography';
import StoreIcon from '@mui/icons-material/Store';
import HistoryIcon from '@mui/icons-material/History';
import Market from './Market';
import Orders from './Orders';
import { AuthContext } from '../../../context/Authcontext';
import AddItemForm from './AddItemForm';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import '../style/index.css'
import SellerItems from './SellerItems';
import Refunds from './Refunds';

import SavingsIcon from '@mui/icons-material/Savings';
const drawerWidth = 240;

function AmazonDrawer(props) {
  const { window } = props;
  const { user, loggedIn } = React.useContext(AuthContext);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [currComponent, setCurrComponent] = React.useState(<Market />);
  let components;
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  console.log(user.role);
  if (user !== undefined && user.role === 'SELLER') {
    components = {
      // 'Market': { 'icon': [<StoreIcon />], content: [<Market />] },
      'Your Items': { 'icon': [<StoreIcon />], content: [<SellerItems />] },
      'Refunds': { 'icon': [<SavingsIcon />], content: [<Refunds person={"seller"} />] },
      // 'Your Orders': { 'icon': [<HistoryIcon />], content: [<Orders />] },
      'New Item': { 'icon': [<AddCircleIcon />], content: [<AddItemForm />] }

    };
  } else {
    components = {
      'Market': { 'icon': [<StoreIcon />], content: [<Market />] },
      'Refunds': { 'icon': [<SavingsIcon />], content: [<Refunds person={"buyer"} />] },
      'Your Orders': { 'icon': [<HistoryIcon />], content: [<Orders />] }

    };

  }
  React.useEffect(() => {
    if (user && user.role === "SELLER") {
      setCurrComponent(<SellerItems />);
    }
  }, [])
  const arr = Object.keys(components);
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {arr.map((text, index) => (
          <ListItem key={text} disablePadding >
            <ListItemButton onClick={() => { setCurrComponent(components[text].content[0]); }}>
              <ListItemIcon>
                {components[text].icon[0]}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List>
        <ListItem key={'logout'} disablePadding >
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={'Logout'} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Amazon Hackon
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        {currComponent}
      </Box>
    </Box>
  );
}

AmazonDrawer.propTypes = {
  window: PropTypes.func,
};

export default AmazonDrawer;
