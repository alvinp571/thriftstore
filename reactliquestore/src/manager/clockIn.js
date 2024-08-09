import { useState } from 'react';
import { styled } from 'styled-components';
import { Alert, Backdrop, Box, Button, CssBaseline, Drawer, Fade, Grid, Modal, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SupervisorSidebar from './sidebar';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../authContext';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const buttonStyle = {
  marginTop: '10px',
  width: '70px',
  height: '70px',
  color: 'black',
  border: '1px solid black',
  borderRadius: "50%",
  fontSize: "20px"
};

const buttonStyleEmpty = {
  marginTop: '10px',
  width: '70px',
  height: '70px',
  color: 'black',
  border: '1px solid black',
  borderRadius: "50%",
  fontSize: "20px",
  display: 'none'
};

const buttonStyleBackspace = {
  marginTop: '10px',
  width: '70px',
  height: '70px',
  color: 'black',
  borderRadius: "50%",
  fontSize: "20px"
};

const CircleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const Circle = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: ${props => (props.filled ? 'black' : 'white')};
  border: 1px solid black;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin: 5px;
`;

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  textAlign: 'center'
};

const ClockIn = () => {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [digitCount, setDigitCount] = useState(0);
  const [showCircles, setShowCircles] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState();
  const [msgError, setMsgError] = useState();
  const { auth, logout } = useAuth();
  const getusername = auth.user ? auth.user.username : '';
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  
  const handleNumberClick = async (number) => {
    if (!showCircles) setShowCircles(true);
    console.log(digitCount);
    // Tambahkan angka ke passcode dan perbarui digit count
    const updatedPasscode = passcode + number;
    setPasscode(updatedPasscode);
    const updatedDigitCount = digitCount + 1;
    setDigitCount(updatedDigitCount);

    // Jika sudah mencapai 4 digit, lakukan posting data
    if (updatedDigitCount === 4) {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/supervisor/clockin`, { passcode: updatedPasscode });
        console.log(response.data);
        setMsgSuccess(response.data.message);
        setShowSuccess(true);
        localStorage.setItem('berhasilClockIn', response.data.message);
        redirectBack();
      } catch (error) {
        setMsgError(error.response.data.message);
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
      // Set digit count kembali ke 0 dan reset passcode
      setDigitCount(0);
      setPasscode('');
    }
  };

  const handleBackspaceClick = () => {
    if (passcode.length > 0) {
      setPasscode(passcode.slice(0, -1));
      setDigitCount(prevCount => prevCount - 1);
    }
  };

  const redirectBack = () => {
    navigate('/supervisor/karyawan/presensi');
  };

  const handleLogout = () => {
    setOpenLogout(false);
    logout();
  };

  const drawerWidth = 300;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, backgroundColor: 'black', color: 'white' },
          }}
          open
        >
          <SupervisorSidebar />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Button style={{float: 'right'}} color="inherit" onClick={handleOpenLogout} startIcon={<AccountCircle />}>
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
                <Button variant="outlined" onClick={handleCloseLogout} sx={{ ml: 2, backgroundColor: '#FE8A01', color: 'white' }}>
                  Tidak
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
        <br></br>
        <Toolbar />
        <center><RootContainer>
          {showSuccess && (
            <Alert variant="filled" severity="success" style={{ marginBottom: 20 }}>
              { msgSuccess }
            </Alert>
          )}
          {showError && (
            <Alert variant="filled" severity="error" style={{ marginBottom: 20 }}>
              { msgError }
            </Alert>
          )}
          {!showCircles && <Title>Enter passcode</Title>}
          {showCircles && (
            <CircleContainer>
              {[...Array(4)].map((_, index) => (
                <Circle key={index} filled={index < digitCount}>
                  {/* {index < digitCount ? passcode[index] : ''} */}
                </Circle>
              ))}
            </CircleContainer>
          )}
          <InputContainer>
            <Grid container>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0].map((number) => (
                number !== '' ? (
                  <Grid item xs={4} key={number}>
                    <Button style={buttonStyle} onClick={() => handleNumberClick(number)}>
                      {number}
                    </Button>
                  </Grid>
                ) : <Grid item xs={4} key={number}>
                <Button style={buttonStyleEmpty}>
                </Button>
              </Grid>
              ))}
              <Grid item xs={4}>
                <Button style={buttonStyleBackspace} onClick={handleBackspaceClick}>←</Button>
              </Grid>
            </Grid>
          </InputContainer>
        </RootContainer></center>
      </Box>
    </Box>
  );
};

export default ClockIn;
