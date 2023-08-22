import React from 'react';

// project import
import { Formik } from 'formik';
import { Link as RouterLink } from 'react-router-dom';
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import AnimateButton from 'components/@extended/AnimateButton';
import * as Yup from 'yup';
// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  Link,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

import { useHistory } from 'react-router-dom';

import AuthWrapper from 'components/auth/AuthWrapper';

import { Login as OnLogin } from 'services/auth.service';
import { GetCurrentUser } from 'services/user.service';
import { CURRENT_USER } from 'business/rule/index';

// ================================|| LOGIN ||================================ //

const Login = () => {
  const history = useHistory();

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const setCurrentUser = (user) => {
    localStorage.setItem(CURRENT_USER, JSON.stringify(user));
  };

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Formik
            initialValues={{
              username: '',
              password: ''
            }}
            validationSchema={Yup.object().shape({
              username: Yup.string().min(2).required('Enter your account'),
              password: Yup.string().max(255).required('Enter your password')
            })}
            onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
              setStatus({ success: false });
              setSubmitting(false);
              OnLogin(values)
                .then((res) => {
                  if (res) {
                    GetCurrentUser().then((user) => {
                      setCurrentUser(user);
                      history.push('/');
                    });
                  }
                })
                .catch((err) => {
                  setStatus({ success: false });
                  setErrors({ submit: err.message });
                  setSubmitting(false);
                });
            }}
          >
            {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
              <form noValidate onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="email-login">Username</InputLabel>
                      <OutlinedInput
                        id="username-login"
                        type="text"
                        value={values.username}
                        name="username"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        placeholder="Enter your account"
                        fullWidth
                        error={Boolean(touched.username && errors.username)}
                      />
                      {touched.username && errors.username && (
                        <FormHelperText error id="standard-weight-helper-text-username-login">
                          {errors.username}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1}>
                      <InputLabel htmlFor="password-login">Password</InputLabel>
                      <OutlinedInput
                        fullWidth
                        error={Boolean(touched.password && errors.password)}
                        id="-password-login"
                        type={showPassword ? 'text' : 'password'}
                        value={values.password}
                        name="password"
                        onBlur={handleBlur}
                        onChange={handleChange}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                              edge="end"
                              size="large"
                            >
                              {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                            </IconButton>
                          </InputAdornment>
                        }
                        placeholder="Enter password"
                      />
                      {touched.password && errors.password && (
                        <FormHelperText error id="standard-weight-helper-text-password-login">
                          {errors.password}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} sx={{ mt: -1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                      <Link variant="h6" component={RouterLink} to="" color="text.primary">
                        Forgot Password?
                      </Link>
                    </Stack>
                  </Grid>
                  {errors.submit && (
                    <Grid item xs={12}>
                      <FormHelperText error>{errors.submit}</FormHelperText>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <AnimateButton>
                      <Button
                        disableElevation
                        disabled={isSubmitting}
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Login
                      </Button>
                    </AnimateButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};
export default Login;
