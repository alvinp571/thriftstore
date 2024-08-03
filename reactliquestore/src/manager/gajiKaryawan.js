import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {alpha} from '@mui/material/styles';
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
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {visuallyHidden} from '@mui/utils';
import axios from 'axios';
import styled from 'styled-components';
import {
  Autocomplete,
  Backdrop,
  Button,
  CssBaseline,
  Drawer,
  Fade,
  FormControl,
  Grid,
  Modal,
  TextField
} from '@mui/material';
import SupervisorSidebar from './sidebar';
import {AccountCircle, ChevronLeft, ChevronRight} from '@mui/icons-material';
import {addMonths, subMonths} from 'date-fns';
import {useAuth} from '../authContext';

const RootContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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

const headCells = [
  {id: 'tanggal', numeric: false, disablePadding: false, label: 'Tanggal'},
  {id: 'clockin', numeric: false, disablePadding: false, label: 'Clock-In'},
  {id: 'clockout', numeric: false, disablePadding: false, label: 'Clock-Out'},
  {id: 'jamKerja', numeric: true, disablePadding: false, label: 'Jam Kerja'},
  {id: 'gajiPokok', numeric: true, disablePadding: false, label: 'Gaji Pokok'},
  {id: 'uangMakan', numeric: false, disablePadding: false, label: 'Uang Makan'},
  {id: 'uangLembur', numeric: false, disablePadding: false, label: 'Uang Lembur'},
  {id: 'gajiLibur', numeric: false, disablePadding: false, label: 'Gaji Libur'},
  {id: 'terlambat', numeric: false, disablePadding: false, label: 'Terlambat'},
  {id: 'keterangan', numeric: false, disablePadding: false, label: 'Keterangan'},
  {id: 'totalGaji', numeric: false, disablePadding: false, label: 'Total Gaji'},
];

function EnhancedTableHead(props) {
  const {order, orderBy, onRequestSort} =
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
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired
};

function EnhancedTableToolbar(props) {
  const {numSelected} = props;

  return (
    <Toolbar
      sx={{
        pl: {sm: 2},
        pr: {xs: 1, sm: 1},
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{flex: '1 1 100%'}}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{flex: '1 1 100%'}}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Employee Data
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon/>
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon/>
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const idrFormat = new Intl.NumberFormat('en-ID', {
  style: 'currency',
  currency: 'IDR'
});

const formatCurrency = (number) => {
  if (!number) number = 0;
  return idrFormat.format(number);
};

export default function GajiKaryawan() {
  const {auth, logout} = useAuth();
  const getUsername = auth.user ? auth.user.username : '';
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [rows, setRows] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [openLogout, setOpenLogout] = useState(false);

  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState({});
  const [scheduledClockIn, setScheduledClockIn] = useState('');
  const [offDay, setOffDay] = useState('');
  const [payDetail, setPayDetail] = useState({});

  const months = [
    'Januari', 'Februari', 'Maret', 'April',
    'Mei', 'Juni', 'Juli', 'Agustus',
    'September', 'Oktober', 'November', 'Desember'
  ];
  const currentMonthName = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();


  const drawerWidth = 300;

  // Log out handlers
  const handleLogout = () => {
    setOpenLogout(false);
    logout();
  };

  const handleOpenLogout = () => setOpenLogout(true);

  const handleCloseLogout = () => setOpenLogout(false);

  // Table handlers
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

  // Selected employee handlers
  const handleEmployeeChange = (event, newValue) => {
    setCurrentEmployee(newValue);
  };

  // Selected date handlers
  const handlePreviousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  // Update page data when selected employee or data change
  useEffect(() => {
    if (!currentEmployee || !currentEmployee.id) return;

    const fetchData = async () => {
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();

      const url = `${process.env.REACT_APP_ENDPOINTS_EMPLOYEES_SERVICE}/${currentEmployee.id}/pay-detail?month=${month}&year=${year}`;
      const data = await axios.get(url).then(res => res.data);

      setPayDetail(data);
    }

    fetchData();
  }, [currentEmployee, currentDate]);

  useEffect(() => {
    if (!currentEmployee || !currentEmployee.id) return;

    const fetchData = async () => {
      const url = `${process.env.REACT_APP_ENDPOINTS_EMPLOYEES_SERVICE}/${currentEmployee.id}`;
      const data = await axios.get(url).then(res => res.data);
      
      setScheduledClockIn(data.scheduledClockIn);
      setOffDay(data.offDay);
    }
    
    fetchData();
  }, [currentEmployee]);

  // Fetch employee list
  useEffect(() => {
    const fetchData = async () => await axios.get(process.env.REACT_APP_ENDPOINTS_EMPLOYEES_SERVICE);

    fetchData()
      .then(res => {
        console.log(res.data);
        const employeeOptions = res.data.employeeList.map(e => ({"id": e.id, "label": e.fullName}));
        setEmployeeOptions(employeeOptions);
      });
  }, []);

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

      {/* Main component */}
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

        {/* Root container */}
        <RootContainer>
          {/* Employee selector */}
          <Box sx={{minWidth: 300}}>
            <FormControl fullWidth>
              <Typography>Pilih Karyawan *</Typography>
              <Autocomplete
                fullWidth
                options={!employeeOptions ? [{label: "Loading...", id: 0}] : employeeOptions}
                renderInput={(params) => <TextField {...params} label="Employee"/>}
                onChange={handleEmployeeChange}
              />
            </FormControl>
          </Box>

          {/* Month selector */}
          <Grid container alignItems="center" justifyContent="center">
            <Grid item>
              <IconButton onClick={handlePreviousMonth}>
                <ChevronLeft/>
              </IconButton>
            </Grid>
            <Grid item>
              <Typography variant="h6">{`${currentMonthName} ${currentYear}`}</Typography>
            </Grid>
            <Grid item>
              <IconButton onClick={handleNextMonth}>
                <ChevronRight/>
              </IconButton>
            </Grid>
          </Grid>

          {/* Pay detail table */}
          <Box sx={{width: '100%'}}>
            {scheduledClockIn !== '' && offDay !== '' && (
              <Typography>Jam masuk: {scheduledClockIn} &nbsp;&nbsp;&nbsp; Jadwal Libur: Setiap {offDay}</Typography>
            )}
            <Paper sx={{width: '100%', mb: 2}}>
              <TableContainer sx={{maxHeight: 400}}>
                <Table
                  sx={{minWidth: 750}}
                  aria-labelledby="tableTitle"
                  stickyHeader
                >
                  <EnhancedTableHead
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                  <TableBody>
                    {payDetail && payDetail.dailyPayDetail?.map(pd => {
                      return (
                        <TableRow hover tabIndex={-1} sx={{cursor: 'pointer'}}>
                          <TableCell align="center">{pd?.date}</TableCell>
                          <TableCell align="center">{pd?.clockIn || 0}</TableCell>
                          <TableCell align="center">{pd?.clockOut || 0}</TableCell>
                          <TableCell align="center">{pd?.hoursWorked || 0}</TableCell>
                          <TableCell align="center">{formatCurrency(pd?.basePay)}</TableCell>
                          <TableCell align="center">{formatCurrency(pd?.foodAllowance)}</TableCell>
                          <TableCell align="center">{formatCurrency(pd?.overtimePay)}</TableCell>
                          <TableCell align="center">{formatCurrency(pd?.offPay)}</TableCell>
                          <TableCell align="center">{formatCurrency(pd?.absentCount)}</TableCell>
                          <TableCell align="center">{pd?.attendanceStatus}</TableCell>
                          <TableCell align="center">{formatCurrency(pd?.netPay)}</TableCell>
                        </TableRow>
                      );
                    })}
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

              {/* Monthly Pay Summary */}
              <Table>
                <TableRow
                  sx={{display: "grid", gridTemplateColumns: "auto 5% 20%", gridTemplateRows: "repeat(3, auto)"}}>
                  <TableCell align="right">Gaji Kotor</TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">{formatCurrency(payDetail.monthlyPayGross)}</TableCell>
                </TableRow>
                <TableRow
                  sx={{display: "grid", gridTemplateColumns: "auto 5% 20%", gridTemplateRows: "repeat(3, auto)"}}>
                  <TableCell align="right">Absen</TableCell>
                  <TableCell align="center">{payDetail.absentCount}</TableCell>
                  <TableCell align="center">{formatCurrency(payDetail.absentDeduction)}</TableCell>
                </TableRow>
                <TableRow
                  sx={{display: "grid", gridTemplateColumns: "auto 5% 20%", gridTemplateRows: "repeat(3, auto)"}}>
                  <TableCell align="right">Terlambat</TableCell>
                  <TableCell align="center">{payDetail.lateCount}</TableCell>
                  <TableCell align="center">{formatCurrency(payDetail.lateDeduction)}</TableCell>
                </TableRow>
                <TableRow
                  sx={{display: "grid", gridTemplateColumns: "auto 5% 20%", gridTemplateRows: "repeat(3, auto)"}}>
                  <TableCell align="right">Potongan</TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">{formatCurrency(payDetail.netDeduction)}</TableCell>
                </TableRow>
                <TableRow
                  sx={{display: "grid", gridTemplateColumns: "auto 5% 20%", gridTemplateRows: "repeat(3, auto)"}}>
                  <TableCell align="right">Total Gaji</TableCell>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">{formatCurrency(payDetail.monthlyPayNet)}</TableCell>
                </TableRow>
              </Table>
            </Paper>
          </Box>
        </RootContainer>
      </Box>
    </Box>
  );
}
