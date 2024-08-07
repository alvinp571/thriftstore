import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { visuallyHidden } from '@mui/utils';
import axios from 'axios';
import styled from 'styled-components';
import { Alert, Autocomplete, Backdrop, Button, CssBaseline, Drawer, Grid, Modal, TextField, Typography } from '@mui/material';
import SupervisorSidebar from './sidebar';
import { useSpring, animated } from '@react-spring/web';
import { format } from 'date-fns';
import { AccountCircle } from '@mui/icons-material';
import { useAuth } from '../authContext';

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const btnTambahKaryawan = {
    justifyContent: 'center',
    width: '15vw',
    borderRadius: '10px',
    backgroundColor: '#FE8A01',
    color: 'black',
    border: '3px solid black'
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'fullname', numeric: false, disablePadding: false, label: 'Nama Lengkap' },
  { id: 'jabatan', numeric: false, disablePadding: false, label: 'Posisi' },
  { id: 'tanggallahir', numeric: false, disablePadding: false, label: 'Tanggal Lahir' },
  { id: 'age', numeric: true, disablePadding: false, label: 'Umur' },
  { id: 'nomorwa', numeric: true, disablePadding: false, label: 'Nomor HP' },
  { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
  { id: 'username', numeric: false, disablePadding: false, label: 'Username' },
  { id: 'jam_masuk', numeric: false, disablePadding: false, label: 'Jam Masuk' },
  { id: 'jadwal_libur', numeric: false, disablePadding: false, label: 'Jadwal Libur' },
  { id: 'firstjoindate', numeric: false, disablePadding: false, label: 'Tanggal Pertama Bekerja' },
  { id: 'lastupdate', numeric: false, disablePadding: false, label: 'Last Update' },
  { id: 'status', numeric: false, disablePadding: false, label: 'Status' },
  { id: 'aksi', numeric: false, disablePadding: false, }
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={'center'}
            // align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

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
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [showSuccessInsert, setShowSuccessInsert] = useState(false);
  const [messageInsert, setMessageInsert] = useState('');
  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const [messageUpdate, setMessageUpdate] = useState('');
  const [showSuccessDelete, setShowSuccessDelete] = useState(false);
  const [messageDelete, setMessageDelete] = useState('');
  const [showError, setShowError] = useState(false);
  const [msgError, setMsgError] = useState();
  const [errors, setErrors] = useState({});

  // variabel insert

  // variabel edit
  const optHarilibur = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];
  const [id, setId] = useState('');
  const [username, setUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [firstjoindate, setFirstjoindate] = useState('');
  const [entryhour, setEntryhour] = useState('');
  const [jadwal_libur, setJadwal_libur] = useState('');
  const [accessRight, setAccessRight] = useState('');
  const [rolesKaryawan, setRolesKaryawan] = useState([]);
  const [status, setStatus] = useState('');
  const listStatus = ['active', 'suspended', 'inactive', 'unknown'];

  const [openTambah, setOpenTambah] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  const handleCloseTambah = () => setOpenTambah(false);
  const handleCloseEdit = () => setOpenEdit(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleOpenLogout = () => setOpenLogout(true);
  const handleCloseLogout = () => setOpenLogout(false);
  const { auth, logout } = useAuth();
  const getUsername = auth.user ? auth.user.username : '';

  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // Mengambil substring dari posisi 0 sampai 5
  };

  const fetchDataKaryawan = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/manager/dataKaryawan`);
      console.log(response.data);
      // if (response.data.status !== "inactive") {
      //   setRows(response.data);
      // }
      setRows(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataRoles = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/manager/getRolesKaryawan`);
      console.log(response.data);
      setRolesKaryawan(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataKaryawan();
  }, []);

  const validate = () => {
    let tempErrors = {};
    if (!username || username.length > 25) {
      tempErrors.username = 'Username harus diisi dan maksimal 25 karakter';
    }
    if (!fullname || fullname.length > 255) {
      tempErrors.fullname = 'Fullname harus diisi dan maksimal 255 karakter';
    }
    if (!phonenumber || phonenumber.length > 20) {
      tempErrors.phonenumber = 'Nomor WA harus diisi dan maksimal 20 karakter';
    }
    if (!email || email.length > 255 || !/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email harus diisi dengan format yang benar dan maksimal 255 karakter';
    }
    if (!accessRight) {
      tempErrors.id = 'posisi harus diisi';
    }
    if (!birthdate) {
      tempErrors.birthdate = 'Tanggal lahir harus diisi';
    }
    if (!firstjoindate) {
      tempErrors.firstjoindate = 'Tanggal pertama bekerja harus diisi';
    }
    if (!entryhour) {
      tempErrors.entryhour = 'Jam masuk harian harus diisi';
    }
    if (!jadwal_libur || jadwal_libur.length > 10) {
      tempErrors.jadwal_libur = '=Jadwal libur harus diisi dan maksimal 20 karakter';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage, rows],
  );


  const removeSeconds = (timeString) => {
    if (timeString) {
      const timeParts = timeString.split(':');
      return `${timeParts[0]}:${timeParts[1]}`;
    }
    return '';
  };

  const optRoles = rolesKaryawan.map(item => ({
    label: item.position,
    value: item.id,
  }));

  const handleOpenTambah = async () => {
    setOpenTambah(true);
    fetchDataRoles();
    setFullname('');
    setAccessRight('');
    setBirthdate('');
    setPhonenumber('');
    setEmail('');
    setUsername('');
    setFirstjoindate('');
    setEntryhour('');
    setJadwal_libur('');
  };

  const handleOpenEdit = async (id) => {
    fetchDataRoles();
    setOpenEdit(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/manager/getEditDataKaryawan?idEmployee=${id}`);
      console.log(response.data);
      setId(response.data.id);
      setFullname(response.data.fullname);
      setAccessRight(response.data.accessRight.id);
      const formattedBirthDate = format(new Date(response.data.birthdate), 'yyyy-MM-dd');
      setBirthdate(formattedBirthDate);
      setPhonenumber(response.data.phonenumber);
      setEmail(response.data.email);
      setUsername(response.data.username);
      const formattedFirstJoinDate = format(new Date(response.data.firstjoindate), 'yyyy-MM-dd');
      setFirstjoindate(formattedFirstJoinDate);
      const formattedEntryhour = removeSeconds(response.data.jam_masuk);
      setEntryhour(formattedEntryhour);
      setJadwal_libur(response.data.jadwal_libur);
      setStatus(response.data.status);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleConfirmEdit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const jam_masuk = `${entryhour}:00`;

      console.log(id);
      console.log(fullname);
      console.log(accessRight);
      console.log(birthdate);
      console.log(phonenumber);
      console.log(email);
      console.log(username);
      console.log(firstjoindate);
      console.log(jam_masuk);
      console.log(jadwal_libur);
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/manager/editKaryawan`, { fullname, accessRight, birthdate, phonenumber, email, username, firstjoindate, jam_masuk, jadwal_libur, status, id });
        console.log(response.data);
        setShowSuccessUpdate(true);
        setMessageUpdate("Berhasil Ubah Data Karyawan");
        setTimeout(() => {
          setShowSuccessUpdate(false);
        }, 5000);
        fetchDataKaryawan();
      } catch (error) {
        setErrors(error.response);
        setMsgError("Gagal Ubah Data Karyawan");
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
      setOpenEdit(false);
    } else {
      console.log("Validation failed");
    }
  };

  const handleConfirmDelete = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/manager/deleteKaryawan/${id}`);
      console.log('Employee deleted:', response.data);
      setShowSuccessDelete(true);
      setMessageDelete("Berhasil Hapus Karyawan");
      setTimeout(() => {
        setShowSuccessDelete(false);
      }, 5000);
      fetchDataKaryawan();
    } catch (error) {
      console.error('Error deleting employee:', error);
      setMsgError("Gagal Hapus Karyawan");
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
    setOpenDelete(false);
  };

  const handleConfirmTambah = async (e) => {
    e.preventDefault();
    if (validate()) {
      const jam_masuk = `${entryhour}:00`;
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/manager/tambahKaryawan`, { fullname, accessRight, birthdate, phonenumber, email, username, firstjoindate, jam_masuk, jadwal_libur });
        console.log(response.data);
        setShowSuccessInsert(true);
        setMessageInsert("Berhasil Tambah Karyawan");
        setTimeout(() => {
          setShowSuccessInsert(false);
        }, 5000);
        fetchDataKaryawan();
      } catch (error) {
        setErrors(error.response);
        setMsgError("Gagal Tambah Karyawan");
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 5000);
      }
      setOpenTambah(false);
    } else {
      console.log("Validation failed");
    }
  };

  const handleLogout = () => {
    setOpenLogout(false);
    logout();
  };

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
          {getUsername}
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
        <RootContainer>
          {showSuccessInsert && (
            <Alert variant="filled" severity="success" style={{ marginTop: 20, backgroundColor: '#1B9755' }}>
              { messageInsert }
            </Alert>
          )}
          {showSuccessUpdate && (
            <Alert variant="filled" severity="success" style={{ marginTop: 20, backgroundColor: '#1B9755' }}>
              { messageUpdate }
            </Alert>
          )}
          {showSuccessDelete && (
            <Alert variant="filled" severity="success" style={{ marginTop: 20, backgroundColor: '#1B9755' }}>
              { messageDelete }
            </Alert>
          )}
          {showError && (
            <Alert variant="filled" severity="danger" style={{ marginTop: 20, backgroundColor: '#F80000' }}>
              { msgError }
            </Alert>
          )}
          <Box sx={{ width: '100%' }}>
            <Paper sx={{ width: '100%', mb: 2 }}>
              <TableContainer>
                  <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  >
                  <EnhancedTableHead
                      order={order}
                      orderBy={orderBy}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                  />
                  <TableBody>
                      {visibleRows.map((row) => {
                      return (
                          <>
                          <TableRow
                          hover
                          tabIndex={-1}
                          key={row.id}
                          sx={{ cursor: 'pointer' }}
                          >
                          <TableCell align="center">{row.fullname}</TableCell>
                          <TableCell align="center">{row.jabatan}</TableCell>
                          <TableCell align="center">{row.tanggallahir}</TableCell>
                          <TableCell align="center">{row.umur}</TableCell>
                          <TableCell align="center">{row.nomorwa}</TableCell>
                          <TableCell align="center">{row.email}</TableCell>
                          <TableCell align="center">{row.username}</TableCell>
                          <TableCell align="center">{formatTime(row.jam_masuk)}</TableCell>
                          <TableCell align="center">{row.jadwal_libur}</TableCell>
                          <TableCell align="center">{row.firstjoindate}</TableCell>
                          <TableCell align="center">{row.lastupdate || '-'}</TableCell>
                          <TableCell align="center">
                          {row.status === "active" && (
                            <Button style={{ borderRadius: '25px', border: '3px solid black', color: 'white', backgroundColor: 'green'}}>
                              Bekerja
                            </Button>
                          )}
                          {row.status === "suspended" && (
                            <Button style={{ borderRadius: '25px', border: '3px solid black', color: 'white', backgroundColor: 'yellowgreen' }}>
                              Suspended
                            </Button>
                          )}
                          {row.status === "inactive" && (
                            <Button style={{ borderRadius: '25px', border: '3px solid black', color: 'white', backgroundColor: 'red' }}>
                              Inactive
                            </Button>
                          )}
                            {row.status === "unknown" && (
                            <Button style={{ borderRadius: '25px', border: '3px solid black', color: 'white', backgroundColor: 'grey' }}>
                              Unknown
                            </Button>
                          )}
                          </TableCell>
                          <TableCell sx={{display: 'flex'}}>
                            <Tooltip title="edit">
                              <IconButton onClick={() => handleOpenEdit(row.id)}>
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={handleOpenDelete}>
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                          </TableRow>
                          
                          {/* ini modal edit data karyawan */}
                          <Modal
                            aria-labelledby="spring-modal-title"
                            aria-describedby="spring-modal-description"
                            open={openEdit}
                            onClose={handleCloseEdit}
                            closeAfterTransition
                            slots={{ backdrop: Backdrop }}
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
                                  <Grid item xs={12}>
                                    <Typography>Nama Lengkap *</Typography>
                                    <TextField
                                      fullWidth
                                      value={fullname}
                                      error={!!errors.fullname}
                                      onChange={(e) => setFullname(e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography>Posisi *</Typography>
                                    <Autocomplete
                                      fullWidth
                                      options={optRoles}
                                      getOptionLabel={(option) => option.label}
                                      getOptionSelected={(option, value) => option.value === value} 
                                      renderInput={(params) => <TextField {...params} />}
                                      value={optRoles.find((option) => option.value === accessRight)}
                                      error={!!errors.accessRight}
                                      onChange={(e, value) => setAccessRight(value ? value.value : '')} 
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography>Tanggal Lahir *</Typography>
                                    <TextField
                                      fullWidth
                                      type='date'
                                      value={birthdate}
                                      error={!!errors.birthdate}
                                      onChange={(e) => setBirthdate(e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography>Nomor HP *</Typography>
                                    <TextField
                                      fullWidth
                                      type='tel'
                                      inputMode='tel'
                                      value={phonenumber}
                                      error={!!errors.phonenumber}
                                      onChange={(e) => setPhonenumber(e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography>Email *</Typography>
                                    <TextField
                                      fullWidth
                                      type='email'
                                      value={email}
                                      error={!!errors.email}
                                      onChange={(e) => setEmail(e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography>Username *</Typography>
                                    <TextField
                                      fullWidth
                                      value={username}
                                      error={!!errors.username}
                                      onChange={(e) => setUsername(e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography>Tanggal Pertama Bekerja *</Typography>
                                    <TextField
                                      fullWidth
                                      type='date'
                                      value={firstjoindate}
                                      error={!!errors.firstjoindate}
                                      onChange={(e) => setFirstjoindate(e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography>Jam Masuk Harian *</Typography>
                                    <TextField
                                      fullWidth
                                      type='time'
                                      value={entryhour}
                                      error={!!errors.entryhour}
                                      onChange={(e) => setEntryhour(e.target.value)}
                                    />
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography>Jadwal Libur *</Typography>
                                    <Autocomplete
                                      fullWidth
                                      options={optHarilibur}
                                      value={jadwal_libur}
                                      renderInput={(params) => <TextField {...params} />}
                                      error={!!errors.jadwal_libur}
                                      onChange={(event, value) => setJadwal_libur(value)}
                                    />
                                  </Grid>
                                  <Grid item xs={12}>
                                    <Typography>Status *</Typography>
                                    <Autocomplete
                                      fullWidth
                                      value={status}
                                      onChange={(event, newValue) => {
                                        setStatus(newValue)
                                      }}
                                      options={listStatus}
                                      renderInput={(params) => <TextField {...params} />}
                                      error={!!errors.status}
                                    />
                                  </Grid>
                                    <Grid item xs={12}>
                                      <Button variant="contained" onClick={handleConfirmEdit} fullWidth style={{ backgroundColor: 'black', color: 'white' }}>
                                        Submit
                                      </Button>
                                    </Grid>
                                  </Grid>
                                </form>
                              </Box>
                            </Fade>
                          </Modal>

                          <Modal
                            aria-labelledby="spring-modal-title"
                            aria-describedby="spring-modal-description"
                            open={openDelete}
                            onClose={handleCloseDelete}
                            closeAfterTransition
                            slots={{ backdrop: Backdrop }}
                            slotProps={{
                              backdrop: {
                                TransitionComponent: Fade,
                              },
                            }}
                          >
                            <Fade in={openDelete}>
                              <Box sx={styleModal}>
                                <Typography id="spring-modal-title" variant="h6" component="h2">
                                  Apakah anda yakin ingin membuang data ini?
                                </Typography>
                                <Box sx={{ mt: 2 }}>
                                  <Button variant="outlined" onClick={() => handleConfirmDelete(row.id)} sx={{ mr: 2, backgroundColor: '#FE8A01', color: 'white' }}>
                                    Ya
                                  </Button>
                                  <Button variant="outlined" onClick={handleCloseDelete}>
                                    Tidak
                                  </Button>
                                </Box>
                              </Box>
                            </Fade>
                          </Modal>
                          </>
                      );
                      })}
                      {emptyRows > 0 && (
                      <TableRow>
                        <TableCell colSpan={10} />
                      </TableRow>
                      )}
                  </TableBody>
                  </Table>
              </TableContainer>
              <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
              />
              </Paper>
          </Box>
          <Button style={btnTambahKaryawan} onClick={handleOpenTambah}>+ Tambah Karyawan</Button>
          {/* ini modal tambah tipe */}
          <Modal
            aria-labelledby="spring-modal-title"
            aria-describedby="spring-modal-description"
            open={openTambah}
            onClose={handleCloseTambah}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                TransitionComponent: Fade,
              },
            }}
          >
            <Fade in={openTambah}>
              <Box sx={styleModalBesar}>
              <form>
                <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography>Nama Lengkap *</Typography>
                  <TextField
                    fullWidth
                    value={fullname}
                    error={!!errors.fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Posisi *</Typography>
                  <Autocomplete
                    fullWidth
                    options={optRoles}
                    getOptionLabel={(option) => option.label}
                    getOptionSelected={(option, value) => option.value === value} 
                    renderInput={(params) => <TextField {...params} />}
                    value={optRoles.find((option) => option.value === accessRight)}
                    error={!!errors.accessRight}
                    onChange={(e, value) => setAccessRight(value ? value.value : '')} 
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Tanggal Lahir *</Typography>
                  <TextField
                    fullWidth
                    type='date'
                    value={birthdate}
                    error={!!errors.birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Nomor HP *</Typography>
                  <TextField
                    fullWidth
                    type='tel'
                    inputMode='tel'
                    value={phonenumber}
                    error={!!errors.phonenumber}
                    onChange={(e) => setPhonenumber(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Email *</Typography>
                  <TextField
                    fullWidth
                    type='email'
                    value={email}
                    error={!!errors.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Username *</Typography>
                  <TextField
                    fullWidth
                    value={username}
                    error={!!errors.username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography>Tanggal Pertama Bekerja *</Typography>
                  <TextField
                    fullWidth
                    type='date'
                    value={firstjoindate}
                    error={!!errors.firstjoindate}
                    onChange={(e) => setFirstjoindate(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography>Jam Masuk Harian *</Typography>
                  <TextField
                    fullWidth
                    type='time'
                    value={entryhour}
                    error={!!errors.entryhour}
                    onChange={(e) => setEntryhour(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography>Jadwal Libur *</Typography>
                  <Autocomplete
                    fullWidth
                    options={optHarilibur}
                    value={jadwal_libur}
                    renderInput={(params) => <TextField {...params} />}
                    error={!!errors.jadwal_libur}
                    onChange={(event, value) => setJadwal_libur(value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button variant="contained" onClick={handleConfirmTambah} fullWidth style={{ backgroundColor: 'black', color: 'white' }}>
                    Submit
                  </Button>
                </Grid>
                </Grid>
              </form>
              </Box>
            </Fade>
          </Modal>
        </RootContainer>
      </Box>
    </Box>
  );
}
