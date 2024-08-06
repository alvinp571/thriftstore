import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import styled from 'styled-components';
import {Alert, Backdrop, Button, CssBaseline, Drawer, Grid, Modal, TextField, Typography} from '@mui/material';
import SupervisorSidebar from './sidebar';
import {animated, useSpring} from '@react-spring/web';
import {AccountCircle} from '@mui/icons-material';
import {useAuth} from '../authContext';
import TableHead from "@mui/material/TableHead";

const RootContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

const tableHeaders = [
  {id: 'fullName', numeric: false, disablePadding: false, label: 'Nama Lengkap'},
  {id: 'role', numeric: false, disablePadding: false, label: 'Posisi'},
  {id: 'phoneNumber', numeric: true, disablePadding: false, label: 'Nomor HP'},
  {id: 'email', numeric: false, disablePadding: false, label: 'Email'}
];

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
    from: {opacity: 0},
    to: {opacity: open ? 1 : 0},
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
      {React.cloneElement(children, {onClick})}
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

const styleModalBesar = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  borderRadius: 5,
  p: 4,
  overflowY: 'auto'
};

export default function DataKaryawan() {
  const drawerWidth = 300;

  const {auth, logout} = useAuth();
  const [openLogout, setOpenLogout] = useState(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);

  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const [messageUpdate, setMessageUpdate] = useState('');

  const getUsername = auth.user ? auth.user.username : '';

  const [employeeList, setEmployeeList] = useState([]);

  // Form values
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState({});
  const [fullName, setFullName] = useState("");
  const [workingHours, setWorkingHours] = useState("");
  const [payPerHour, setPayPerHour] = useState("");
  const [overtimePay, setOvertimePay] = useState("");
  const [foodAllowance, setFoodAllowance] = useState("");

  // Get employee list
  useEffect(() => {
    const fetchData = async () => await axios.get(`${process.env.REACT_APP_ENDPOINTS_EMPLOYEES_SERVICE}`);

    fetchData().then(res => setEmployeeList(res.data.employeeList));
  }, []);

  // Handle open edit employee modal
  const handleOpenEdit = async (employeeId) => {
    const employeeData = await axios.get(`${process.env.REACT_APP_ENDPOINTS_EMPLOYEES_SERVICE}/${employeeId}`)
      .then(res => res.data);

    setSelectedEmployeeId(employeeId);
    setFullName(employeeData.payDetail.fullName);
    setWorkingHours(employeeData.payDetail.workingHours);
    setPayPerHour(employeeData.payDetail.payPerHour);
    setOvertimePay(employeeData.payDetail.overtimePay);
    setFoodAllowance(employeeData.payDetail.foodAllowance);

    setOpenEdit(true);
  };

  const handleUpdateEmployee = async () => {
    await axios.put(`${process.env.REACT_APP_ENDPOINTS_EMPLOYEES_SERVICE}/${selectedEmployeeId}`, {
      "payDetail": {
        "fullName": fullName,
        "workingHours": workingHours,
        "payPerHour": payPerHour,
        "overtimePay": overtimePay,
        "foodAllowance": foodAllowance
      }
    });

    setOpenEdit(false);
  }

  const handleLogout = () => {
    setOpenLogout(false);
    logout();
  };

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline/>
      <Box
        component="nav"
        sx={{width: {sm: drawerWidth}, flexShrink: {sm: 0}}}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: {xs: 'none', sm: 'block'},
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'black',
              color: 'white'
            },
          }}
          open
        >
          <SupervisorSidebar/>
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{flexGrow: 1, p: 3, width: {sm: `calc(100% - ${drawerWidth}px)`}}}
      >
        <Button style={{float: 'right'}} color="inherit" onClick={handleOpenLogout} startIcon={<AccountCircle/>}>
          {getUsername}
        </Button>
        <Modal
          aria-labelledby="spring-modal-title"
          aria-describedby="spring-modal-description"
          open={openLogout}
          onClose={handleCloseLogout}
          closeAfterTransition
          slots={{backdrop: Backdrop}}
          slotProps={{
            backdrop: {
              TransitionComponent: Fade,
            },
          }}
        >
          <Fade in={openLogout}>
            <Box sx={styleModal}>
              <AccountCircle style={{fontSize: 100}}/>
              <Typography id="spring-modal-title" variant="h6" component="h2">
                Apakah anda yakin ingin keluar?
              </Typography>
              <Box sx={{mt: 2}}>
                <Button variant="outlined" onClick={handleLogout}>
                  Ya
                </Button>
                <Button variant="outlined" onClick={handleCloseLogout}
                        sx={{ml: 2, backgroundColor: '#FE8A01', color: 'white'}}>
                  Tidak
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
        <br></br>
        <Toolbar/>
        <RootContainer>
          {showSuccessUpdate && (
            <Alert variant="filled" severity="success" style={{marginTop: 20, backgroundColor: '#1B9755'}}>
              {messageUpdate}
            </Alert>
          )}

          <Box sx={{width: '100%'}}>
            <Paper sx={{width: '100%', mb: 2}}>
              <TableContainer>
                <Table
                  sx={{minWidth: 750}}
                  aria-labelledby="tableTitle"
                >
                  <TableHead>
                    <TableRow>
                      {tableHeaders.map((headers) => (
                        <TableCell
                          key={headers.id}
                          align={'center'}
                          sx={{fontWeight: "bold"}}
                        >
                          {headers.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {employeeList && employeeList.map((employee) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={employee.id}
                          sx={{cursor: 'pointer'}}
                        >
                          <TableCell align="center">{employee.fullName}</TableCell>
                          <TableCell align="center">{employee.role}</TableCell>
                          <TableCell align="center">{employee.phoneNumber}</TableCell>
                          <TableCell align="center">{employee.email}</TableCell>
                          <TableCell sx={{display: 'flex'}}>
                            <Tooltip title="edit">
                              <IconButton onClick={() => handleOpenEdit(employee.id)}>
                                <EditIcon/>
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* ini modal edit data karyawan */}
              <Modal
                aria-labelledby="spring-modal-title"
                aria-describedby="spring-modal-description"
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                closeAfterTransition
                slots={{backdrop: Backdrop}}
                slotProps={{
                  backdrop: {
                    TransitionComponent: Fade,
                  },
                }}
              >
                <Fade in={openEdit}>
                  <Box sx={styleModalBesar}>
                    <form>
                      <Grid container spacing={3}>
                        {/* Full Name */}
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            disabled
                            label={"Full Name"}
                            value={fullName}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            required
                            type={"number"}
                            label={"Jam Kerja Pokok"}
                            value={workingHours}
                            onChange={e => setWorkingHours(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            required
                            type={"number"}
                            label={"Gaji Per Jam"}
                            value={payPerHour}
                            onChange={e => setPayPerHour(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            required
                            type={"number"}
                            label={"Gaji Lembur"}
                            value={overtimePay}
                            onChange={e => setOvertimePay(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            required
                            type={"number"}
                            label={"Uang Makan"}
                            value={foodAllowance}
                            onChange={e => setFoodAllowance(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            onClick={handleUpdateEmployee}
                            fullWidth
                            style={{backgroundColor: 'black', color: 'white'}}>
                            Update
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Box>
                </Fade>
              </Modal>
            </Paper>
          </Box>
        </RootContainer>
      </Box>
    </Box>
  );
}
