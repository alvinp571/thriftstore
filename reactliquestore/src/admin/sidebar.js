import {ExpandLess, ExpandMore, LocalShippingOutlined, ShoppingBagOutlined} from '@mui/icons-material';
import {Collapse, ListSubheader, Typography} from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import {useEffect, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const [openStok, setOpenStok] = useState(false);
  const [openOrderDelivery, setopenOrderDelivery] = useState(false);
  const handleStokClick = () => {
    setOpenStok(!openStok);
  };
  const handleOrderDeliveryClick = () => {
    setopenOrderDelivery(!openOrderDelivery);
  };

  useEffect(() => {
    // Check if the current path matches any of the Stok paths
    if (location.pathname.startsWith('/admin/stok')) {
      setOpenStok(true);
    }

    // Check if the current path matches any of the OrderDelivery paths
    if (location.pathname.startsWith('/admin/orderDelivery')) {
      setopenOrderDelivery(true);
    }
  }, [location.pathname]);

  return (
    <div>
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader" style={{color: 'white', backgroundColor: 'black'}}>
            <Typography fontSize={50} color={'#FE8A01'}>Lique Admin</Typography>
          </ListSubheader>
        }
      >
        <ListItem button onClick={handleStokClick}>
          <ShoppingBagOutlined/>&nbsp;&nbsp;&nbsp;
          <ListItemText primary="Inventory"/>
          {openStok ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>

        <Collapse in={openStok} timeout="auto" unmountOnExit>
          <List component="div" disablePadding style={{paddingLeft: 20}}>
            <ListItem button component={Link} to="/admin/stok/reviewStok">
              <ListItemText primary="Kelola Stock"/>
            </ListItem>
            <ListItem button component={Link} to="/admin/stok/tipeBarang">
              <ListItemText primary="Kelola Produk"/>
            </ListItem>
          </List>
        </Collapse>

        <ListItem button onClick={handleOrderDeliveryClick}>
          <LocalShippingOutlined/>&nbsp;&nbsp;&nbsp;
          <ListItemText primary="Pesanan dan Pengiriman"/>
          {openOrderDelivery ? <ExpandLess/> : <ExpandMore/>}
        </ListItem>

        <Collapse in={openOrderDelivery} timeout="auto" unmountOnExit>
          <List component="div" disablePadding style={{paddingLeft: 20}}>
            <ListItem button component={Link} to="/admin/orderDelivery/live">
              <ListItemText primary="Input Pesanan Live"/>
            </ListItem>
            <ListItem button component={Link} to="/admin/orderDelivery/pemesanan">
              <ListItemText primary="Kelola Pemesanan"/>
            </ListItem>
            <ListItem button component={Link} to="/admin/orderDelivery/no_resi">
              <ListItemText primary="Input Nomor Resi"/>
            </ListItem>
            <ListItem button component={Link} to="/admin/orderDelivery/pengiriman">
              <ListItemText primary="Input Pengiriman"/>
            </ListItem>
            <ListItem button component={Link} to=""> // TODO: Add redirect link
              <ListItemText primary="Pengaturan Pesanan"/>
            </ListItem>
            <ListItem button component={Link} to="/admin/orderDelivery/reviewOrderDelivery">
              <ListItemText primary="Review Pesanan dan Pengiriman"/>
            </ListItem>
          </List>
        </Collapse>
      </List>
    </div>
  );
};

export default AdminSidebar;
