import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import axios from "axios";
import styled from "styled-components";
import {
  Alert,
  Autocomplete,
  Backdrop,
  Button,
  CssBaseline,
  Drawer,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import AdminSidebar from "./sidebar";
import { useSpring, animated } from "@react-spring/web";
import { AccountCircle } from "@mui/icons-material";
import { useAuth } from "../authContext";
import { NumericFormat } from "react-number-format";

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Fade = React.forwardRef(function Fade(props, ref) {
  const {
    children,
    in: open,
    onClick,
    onEnter,
    onExited,
    ownerState,
    ...other
  } = props;
  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: open ? 1 : 0 },
    onStart: () => {
      if (open && onEnter) {
        onEnter(null, true);
      }
    },
    onRest: () => {
      if (!open && onExited) {
        onExited(null, true);
      }
    },
  });

  return (
    <animated.div ref={ref} style={style} {...other}>
      {React.cloneElement(children, { onClick })}
    </animated.div>
  );
});

Fade.propTypes = {
  children: PropTypes.element.isRequired,
  in: PropTypes.bool,
  onClick: PropTypes.any,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
  ownerState: PropTypes.any,
};

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  textAlign: "center",
};

export default function Live() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const [ShowSuccess, setShowSuccess] = useState(false);
  const [CekKode, setCekKode] = useState(false);
  const [MsgInsert, setMsgInsert] = useState("");
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [colourData, setColourData] = useState([]);
  const [DataTipe, setDataTipe] = useState([]);
  const [colourOrder, setColourOrder] = useState("");
  const [Colourcode, setColourcode] = useState("");
  const [TypeCode, setTypeCode] = useState("");
  const [Orderid, setOrderid] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [TotalPrice, setTotalPrice] = useState("");
  const [checkoutLink, setCheckoutLink] = useState("");
  const [errors, setErrors] = useState({});
  const [showLink, setShowLink] = useState(false);
  const handleCloseShowLink = () => setShowLink(false);
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const { auth, logout } = useAuth();
  const getusername = auth.user ? auth.user.username : "";

  const validate = () => {
    let tempErrors = {};

    // Validasi Orderid
    if (!Orderid) {
      tempErrors.Orderid = "Kode pemesanan harus diisi";
    } else if (Orderid.length > 3) {
      tempErrors.Orderid = "Kode pemesanan maksimal 3 karakter";
    } else if (parseInt(Orderid) < 1) {
      tempErrors.Orderid = "Kode pemesanan minimal berjumlah 1";
    }

    // Validasi Capital Price
    if (!PhoneNumber) {
      tempErrors.PhoneNumber = "Nomor wa harus diisi";
    } else if (PhoneNumber.length > 15) {
      // contoh panjang maksimal 15 karakter
      tempErrors.PhoneNumber = "Nomor wa maksimal 15 karakter";
    }

    // Validasi Default Price
    if (!TotalPrice) {
      tempErrors.TotalPrice = "Harga barang harus diisi";
    } else if (TotalPrice.length > 15) {
      // contoh panjang maksimal 15 karakter
      tempErrors.TotalPrice = "Harga barang maksimal 15 karakter";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const fetchDataType = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/dataTipe`);
      console.log(response.data);
      setDataTipe(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchDataColour = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/getColour`);
      console.log(response.data);
      setColourData(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataType();
    fetchDataColour();
  }, []);

  const optColour = colourData.map((item) => ({
    label: item.name,
    value: item.id,
    colourcode: item.colourcode,
    colourhex: item.colourhex,
  }));

  const optTipe = DataTipe.map((item) => ({
    name: item.nama,
    varian: item.varian,
    value: item.typecode,
  }));

  const handleAutocompleteColourChange = async (event, newValue) => {
    if (newValue == null) {
      setColourOrder("");
    } else {
      setColourOrder(newValue);
      try {
        const response = await axios.get(
          `${backendUrl}/admin/getColourOrder/${newValue.value}`
        );
        console.log(response.data);
        setColourcode(response.data.colourcode);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const handleAutocompleteTypeChange = (event, newValue) => {
    console.log(newValue);
    if (newValue == null) {
      setTypeCode("");
    } else {
      setTypeCode(newValue);
    }
  };

  const handleClear = async (e) => {
    e.preventDefault();
    setCheckoutLink("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      console.log(Colourcode);
      console.log(Orderid);
      console.log(PhoneNumber);
      console.log(TotalPrice);
      console.log(TypeCode);
      try {
        const typecode = TypeCode.value;
        const formData = new FormData();
        formData.append("colourcode", Colourcode);
        formData.append("orderid", Orderid);
        formData.append("phonenumber", PhoneNumber);
        formData.append("totalprice", TotalPrice);
        formData.append("typecode", typecode);
        const response = await axios.post(
          `${backendUrl}/admin/tambahTemporaryOrder`,
          formData
        );
        console.log(response.data.orderid);
        setCheckoutLink(
          `http://157.173.221.67/login?orderid=${response.data.orderid}`
        );
        // Convert phone number to international format
        const internationalPhoneNumber = `+62${PhoneNumber.substring(1)}`; // Assuming Indonesian format

        // Generate message for WhatsApp
        const message = `Selamat anda menang!. Silakan klik link berikut untuk melanjutkan ke checkout:\n http://157.173.221.67:3000/login?orderid=${response.data.orderid}`;
        // 081216509966
        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);

        // Create WhatsApp Web URL with international phone number
        const whatsappUrl = `whatsapp://send?phone=${internationalPhoneNumber}&text=${encodedMessage}`;

        // Open WhatsApp Web in new tab
        // window.location.href = whatsappUrl;
        const response2 = await axios.post(
          `${backendUrl}/admin/simpanCheckoutLink/${response.data.orderid}`
        );
        console.log(response2.data);
        setShowSuccess(true);
        setMsgInsert("Berhasil Menambah Pemesanan");
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
        setColourOrder("");
        setOrderid("");
        setTypeCode("");
        setPhoneNumber("");
        setTotalPrice("");
        setShowLink(true);
      } catch (error) {
        console.log(error.response.data);
        setShowError(true);
        if (error.response.data === "Kode pemesanan sudah digunakan") {
          setMsgError("Kode pemesanan sudah digunakan");
        } else {
          setMsgError("Gagal Menambah Pemesanan");
        }
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
    } else {
      console.log("Validation failed");
    }
  };

  const handleLogout = () => {
    setOpenLogout(false);
    logout();
  };

  const drawerWidth = 300;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              backgroundColor: "black",
              color: "white",
            },
          }}
          open
        >
          <AdminSidebar />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Button
          style={{ float: "right" }}
          color="inherit"
          onClick={handleOpenLogout}
          startIcon={<AccountCircle />}
        >
          {getusername}
        </Button>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={openLogout}
          onClose={handleCloseLogout}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              TransitionComponent: Fade,
            },
          }}
        >
          <Fade in={openLogout}>
            <Box sx={styleModal}>
              <AccountCircle style={{ fontSize: 100 }} />
              <Typography id="spring-modal-title" variant="h6" component="h2">
                Apakah anda yakin ingin keluar?
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" onClick={handleLogout}>
                  Ya
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCloseLogout}
                  sx={{ ml: 2, backgroundColor: "#FE8A01", color: "white" }}
                >
                  Tidak
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
        <br></br>
        <Toolbar />
        <RootContainer>
          {ShowSuccess && (
            <Alert
              variant="filled"
              severity="success"
              style={{ marginBottom: 3 }}
            >
              {MsgInsert}
            </Alert>
          )}
          {showError && (
            <Alert
              variant="filled"
              severity="error"
              style={{ marginBottom: 3 }}
            >
              {msgError}
            </Alert>
          )}
          <Typography variant="h3" marginBottom={5}>
            Input Pemesanan live
          </Typography>
          <FormControl>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography>Nomor WA *</Typography>
                <TextField
                  fullWidth
                  type="number"
                  autoComplete="off"
                  value={PhoneNumber}
                  error={!!errors.PhoneNumber}
                  helperText={errors.PhoneNumber}
                  FormHelperTextProps={{ sx: { color: "red" } }}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Pilih Warna *</Typography>
                <Autocomplete
                  fullWidth
                  options={optColour}
                  getOptionLabel={(option) => option.label}
                  getOptionSelected={(option, value) => option.value === value}
                  renderInput={(params) => <TextField {...params} />}
                  value={optColour.find(
                    (option) => option.value === colourOrder
                  )}
                  error={!!errors.colourOrder}
                  onChange={handleAutocompleteColourChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Kode Pemesanan *</Typography>
                <TextField
                  fullWidth
                  type="number"
                  inputProps={{ min: "1", inputMode: "numeric" }}
                  autoComplete="off"
                  value={Orderid}
                  error={!!errors.Orderid}
                  helperText={errors.Orderid}
                  FormHelperTextProps={{ sx: { color: "red" } }}
                  onChange={(e) => setOrderid(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Tipe Barang * (Nama - Varian)</Typography>
                <Autocomplete
                  fullWidth
                  options={optTipe}
                  getOptionLabel={(option) =>
                    option.name + " - " + option.varian
                  }
                  getOptionSelected={(option, value) => option.value === value}
                  renderInput={(params) => <TextField {...params} />}
                  value={optTipe.find((option) => option.value === TypeCode)}
                  error={!!errors.TypeCode}
                  onChange={handleAutocompleteTypeChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Harga *</Typography>
                <NumericFormat
                  fullWidth
                  autoComplete="off"
                  value={TotalPrice}
                  onValueChange={(values) => setTotalPrice(values.floatValue)}
                  thousandSeparator="."
                  decimalSeparator=","
                  customInput={TextField}
                  error={!!errors.TotalPrice}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">Rp</InputAdornment>
                    ),
                  }}
                  variant="outlined"
                />
                {!!errors.TotalPrice && (
                  <FormHelperText error sx={{ color: "red" }}>
                    {errors.TotalPrice}
                  </FormHelperText>
                )}
              </Grid>
              {checkoutLink && (
                <>
                  <Grid item xs={6}>
                    <Typography>
                      Selamat anda menang!. Silakan klik link berikut untuk
                      melanjutkan ke checkout: {checkoutLink}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Button
                      variant="contained"
                      onClick={handleClear}
                      fullWidth
                      style={{ backgroundColor: "orange", color: "white" }}
                    >
                      Clear Link
                    </Button>
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  fullWidth
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </FormControl>
          {/* <Modal
            aria-labelledby="spring-modal-title"
            aria-describedby="spring-modal-description"
            open={showLink}
            onClose={handleCloseShowLink}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                TransitionComponent: Fade,
              },
            }}
            >
            <Fade in={showLink}>
              <Box sx={styleModal}>
                <Typography id="spring-modal-title" variant="h6" component="h2">
                  Berhasil menambah pemesanan. Silakan klik link berikut untuk melanjutkan ke checkout:
                </Typography>
                <Typography>
                  {checkoutLink}
                </Typography>
              </Box>
            </Fade>
          </Modal> */}
        </RootContainer>
      </Box>
    </Box>
  );
}
