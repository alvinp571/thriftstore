import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import axios from "axios";
import {
  Alert,
  Box,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import "./register.css";
import logoShow from "./assets/EyeClose.svg"
import logoHide from "./assets/EyeOpen.svg"

const containerStyle = {
  backgroundColor: "black",
  color: "white",
  borderRadius: 25,
  boxShadow: "10px 10px 5px grey",
};

const textfieldStyle = {
  input: {
    color: "white",
    border: "1px solid white",
    borderRadius: "4px",
  },
  placeholder: {
    color: "lightgray",
  },
};

const btnRegister = {
  marginTop: 5,
  justifyContent: "center",
  borderRadius: "10px",
  backgroundColor: "#FE8A01",
  color: "black",
  border: "3px solid black",
};

function RegisterPage() {
  const backendUrl = process.env.REACT_APP_BACKEND_URL;
  const navigate = useNavigate();
  const [param, setParam] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // const [usernameIG, setUsernameIG] = useState('');
  const [phonenumber, setPhonenumber] = useState("");
  const [birthdate, setBirthdate] = useState("");
  // const [konfirmasiPassword, setKonfirmasiPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [errors, setErrors] = useState({});
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderidFromQuery = params.get("orderid");
  console.log(orderidFromQuery);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
    document.getElementById('show').style.display = 'none'
    document.getElementById('hide').style.display = 'flex'
  };

  const handleClickHidePassword = () => {
    setShowPassword((show) => !show);
    document.getElementById('show').style.display = 'flex'
    document.getElementById('hide').style.display = 'none'
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validate = () => {
    let tempErrors = {};

    // if (!name) {
    //   tempErrors.name = "nama harus diisi";
    // } else if (name.length > 255) {
    //   tempErrors.name = "nama maksimal berjumlah 255 karakter";
    // } else if (typeof name !== "string") {
    //   tempErrors.name = "nama harus berisikan huruf";
    // }
    if (!username) {
      tempErrors.username = "username harus diisi";
    } else if (username.length > 50) {
      tempErrors.username = "username maksimal berjumlah 50 karakter";
    }
    if (!password) {
      tempErrors.password = "password harus diisi";
    } else if (password.length > 255) {
      tempErrors.password = "password barang maksimal berjumlah 255 karakter";
    }
    // if (!konfirmasiPassword){
    //   tempErrors.konfirmasiPassword = 'konfirmasiPassword harus diisi';
    // }
    // else if (konfirmasiPassword.length > 255) {
    //   tempErrors.konfirmasiPassword = 'konfirmasi password barang maksimal berjumlah 255 karakter';
    // }
    if (!email) {
      tempErrors.email = "email harus diisi";
    } else if (email.length > 255) {
      tempErrors.email = "email barang maksimal berjumlah 255 karakter";
    }
    // if (!usernameIG){
    //   tempErrors.usernameIG = 'usernameIG harus diisi';
    // }
    // else if (usernameIG.length > 50) {
    //   tempErrors.usernameIG = 'usernameIG barang maksimal berjumlah 50 karakter';
    // }
    if (!phonenumber) {
      tempErrors.phonenumber = "phonenumber harus diisi";
    } else if (phonenumber.length < 10 || phonenumber.length > 12) {
      tempErrors.phonenumber = "phonenumber harus berjumlah antara 10-12 digit";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      // formData.append("name", name);
      formData.append("email", email);
      // formData.append('usernameIG', usernameIG);
      formData.append("phonenumber", phonenumber);
      formData.append("birthdate", birthdate);
      console.log([...formData]);

      const response = await axios.post(`${backendUrl}/register`, formData);
      console.log(response.data);

      setUsername("");
      setPassword("");
      // setName("");
      setEmail("");
      setBirthdate("");
      setPhonenumber("");
      // setUsernameIG('');
      // setKonfirmasiPassword("");

      localStorage.setItem("berhasilRegister", response.data.message);
      if (orderidFromQuery == null) {
        navigate("/login");
      } else {
        navigate(`/login?orderid=${orderidFromQuery}`);
      }
      // if (password !== konfirmasiPassword) {
      //   setMsgError("password harus sama dengan konfirmasi password");
      // }
      // else {
      //   try {
      //     const formData = new FormData();
      //     formData.append('username', username);
      //     formData.append('password', password);
      //     formData.append('name', name);
      //     formData.append('email', email);
      //     // formData.append('usernameIG', usernameIG);
      //     formData.append('phonenumber', phonenumber);
      //     formData.append('birthdate', birthdate);
      //     console.log([...formData]);

      //     const response = await axios.post(`${backendUrl}/register`, formData);
      //     console.log(response.data);

      //     setUsername('');
      //     setPassword('');
      //     setName('');
      //     setEmail('');
      //     setBirthdate('');
      //     setPhonenumber('');
      //     // setUsernameIG('');
      //     setKonfirmasiPassword('');

      //     localStorage.setItem('berhasilRegister', response.data.message);
      //     if (orderidFromQuery == null){
      //       navigate('/login');
      //     } else {
      //       navigate(`/login?orderid=${orderidFromQuery}`);
      //     }
      //   }
      //   catch (error) {
      //     console.log(error);
      //     setShowError(true);
      //     setMsgError(error.response.data.message);
      //     setTimeout(() => {
      //       setShowError(false);
      //     }, 5000);
      //   }
      // }
    }
  };

  return (
    <Container component="main" maxWidth="sm" sx={{ marginTop: 10 }}>
      {showError && (
        <Alert variant="filled" severity="error" sx={{ marginBottom: 5 }}>
          {msgError}
        </Alert>
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: 5,
          borderRadius: 5,
        }}
        style={containerStyle}
      >
        <Typography component="h1" variant="h4">
          Register
        </Typography>
        <Box sx={{ display: "flex" }}>
          <Typography>Already have an account?</Typography>&nbsp;&nbsp;&nbsp;
          <Typography sx={{ color: "#FE8A01" }}>
            {param ? (
              <a
                href={`/login?orderid=${orderidFromQuery}`}
                style={{ color: "#FE8A01", textDecoration: "none" }}
              >
                Login here
              </a>
            ) : (
              <a
                href="/login"
                style={{ color: "#FE8A01", textDecoration: "none" }}
              >
                Login here
              </a>
            )}
          </Typography>
        </Box>
        <Grid container spacing={3} marginTop={1}>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              placeholder="Username"
              value={username}
              helperText={errors.username}
              FormHelperTextProps={{ sx: { color: "red" } }}
              autoComplete="off"
              fullWidth
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              placeholder="Name"
              value={name}
              helperText={errors.name}
              FormHelperTextProps={{ sx: { color: "red" } }}
              autoComplete="off"
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
          </Grid> */}
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              type="email"
              placeholder="Email"
              value={email}
              helperText={errors.email}
              FormHelperTextProps={{ sx: { color: "red" } }}
              autoComplete="off"
              fullWidth
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              type="text"
              placeholder="Phone number"
              value={phonenumber}
              helperText={errors.phonenumber}
              FormHelperTextProps={{ sx: { color: "red" } }}
              autoComplete="off"
              fullWidth
              onChange={(e) => setPhonenumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              type="date"
              placeholder="Birthdate "
              value={birthdate}
              autoComplete="off"
              fullWidth
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <TextField
              sx={textfieldStyle}
              placeholder="UsernameIG"
              value={usernameIG}
              helperText={errors.usernameIG}
              FormHelperTextProps={{ sx: { color: 'red' } }}
              autoComplete='off'
              fullWidth
              onChange={(e) => setUsernameIG(e.target.value)}
            />
          </Grid> */}
          <Grid item xs={10}>
            {/* <TextField
              sx={textfieldStyle}
              placeholder="Password"
              type="password"
              value={password}
              helperText={errors.password}
              FormHelperTextProps={{ sx: { color: "red" } }}
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
            /> */}

            <TextField
              sx={textfieldStyle}
              placeholder="Password"
              type = {showPassword ? 'text' : 'password'}
              // type="password"
              value={password}
              helperText={errors.password}
              FormHelperTextProps={{ sx: { color: "red" } }}
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
            >
              <InputAdornment></InputAdornment>
            </TextField>
          </Grid>
          <Grid item xs={2} class="noPad">
          <div class="show" id="show" onClick={handleClickShowPassword}><img src={logoShow}/></div>
          <div class="hide" id="hide" onClick={handleClickHidePassword}><img src={logoHide}/></div>
          </Grid>
          <Grid item xs={12}>
            <Button style={btnRegister} fullWidth onClick={handleSubmit}>
              Register
            </Button>
          </Grid>
        </Grid>
      </Box>
        
    </Container>
  );
}

export default RegisterPage;
