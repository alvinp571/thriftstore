import { Button, Grid, TextField, Typography } from "@mui/material";
import { Box, Container } from "@mui/system";

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
    borderRadius: "10px",
  },
  placeholder: {
    color: "lightgray",
  },
};

const btnLogin = {
  marginTop: 5,
  justifyContent: "center",
  borderRadius: "10px",
  backgroundColor: "#FE8A01",
  color: "black",
  border: "3px solid black",
};

const btnLoginInvert = {
  marginTop: 5,
  justifyContent: "center",
  borderRadius: "10px",
  backgroundColor: "black",
  color: "#FE8A01",
  border: "3px solid #FE8A01",
};

function ForgotPage() {
  return (
    <>
      <Container component="main" maxWidth="sm" sx={{ marginTop: 10 }}>
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
            Forgot Password
          </Typography>
          <Grid container spacing={3} marginTop={1}>
            <Grid item xs={12}>
              <TextField
                sx={textfieldStyle}
                className="input"
                placeholder="Email"
                // value={username}
                autoComplete="off"
                fullWidth
                // helperText={errors.username}
                // FormHelperTextProps={{ sx: { color: "red" } }}
                // onChange={(e) => setUsername(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography>
                Please enter your email address, you will receive a link to
                reset your password.
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <a href="/login" style={{ color: "#FE8A01", textDecoration: "none" }}>
                <Button style={btnLoginInvert} fullWidth>
                  Back
                </Button>
              </a>
            </Grid>
            <Grid item xs={6}>
              <Button style={btnLogin} fullWidth>
                Confirm
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
}

export default ForgotPage;
