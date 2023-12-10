import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { ColorModeContext, useMode } from './theme'
import { CssBaseline, ThemeProvider, Typography } from '@mui/material'
import { Box, Button, TextField, useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import { tokens } from '../src/theme'
import { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'

import SideBar from './pages/global/sidebar/SideBar'
import TopBar from './pages/global/topbar/TopBar'
import Summary from './pages/summary'
import Devices from './pages/devices'
import Users from './pages/users'
import Reports from './pages/reports'
import AddUsers from './pages/addUsers'
import './index.css'
import DeviceStat from './components/deviceStat/DeviceStat'
import User from './components/user'
import TopBarLoginPage from './pages/global/topbar/TopBarLoginPage'
import AddDevices from './pages/addDevices'

const checkoutSchema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Required'),
  password: yup.string().required('Required'),
})
const initialValues = {
  email: '',
  password: '',
}

function App() {
  const [theme, colorMode] = useMode()
  const colors = tokens(theme.palette.mode)
  const [isSidebar, setIsSidebar] = useState(true)
  const isNonMobile = useMediaQuery('(min-width:600px)')

  const handleFormSubmit = (values) => {
    const config = {
      method: 'POST',
      url: `http://137.184.13.207:3300/api/users/login`,
      headers: {
        'content-type': 'application/json',
      },
      data: {
        emailAddress: values.email,
        password: values.password,
      },
    }
    if (values !== null) {
      axios(config)
        .then((response) => {
          console.log(response)
          localStorage.setItem('accessToken', response.data.accessToken)
          window.location.reload(false)
        })
        .catch((error) => {
          console.log(error.response.data)
          alert(error.response.data.error.message)
        })
    }
  }

  const getFromLocalStorege = () => {
    const value = localStorage.getItem('accessToken')
    if (value === null) {
      return false
    }
    return true
  }

  const [isAuth, setAuth] = useState(() => {
    return getFromLocalStorege()
  })

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {isAuth ? (
            <>
              <SideBar isSidebar={isSidebar} />
              <main className="content">
                <TopBar setIsSidebar={setIsSidebar} />
                <Routes>
                  <Route path="/" element={<Summary />} />
                  <Route path="/devices" element={<Devices />} />
                  <Route path="/users" element={<Users />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/users/addusers" element={<AddUsers />} />
                  <Route path="/devices/adddevice" element={<AddDevices />} />
                  <Route
                    path="/devices/devicestat/:id"
                    element={<DeviceStat />}
                  />
                  <Route path="/users/user" element={<User />} />
                </Routes>
              </main>
            </>
          ) : (
            <>
              <Box width="100vw">
                <Box width="100%">
                  <TopBarLoginPage />
                </Box>
                <Box
                  width="100%"
                  className="login-container"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Box
                    m="0 32px"
                    width="25%"
                    bgcolor={colors.primary[400]}
                    padding="32px"
                    borderRadius="10px"
                  >
                    <Box
                      display="flex"
                      width="100%"
                      mb="32px"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <Box className="logoContainer" sx={{ cursor: 'pointer' }}>
                        <img src={`../../assets/logo.jpg`} alt="logo" />
                      </Box>
                      <Typography
                        variant="h2"
                        fontWeight="500"
                        mt="32px"
                        color={colors.greenAccent[200]}
                      >
                        Weight Stat
                      </Typography>
                    </Box>
                    <Formik
                      onSubmit={handleFormSubmit}
                      initialValues={initialValues}
                      validationSchema={checkoutSchema}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                      }) => (
                        <form onSubmit={handleSubmit}>
                          <Box
                            display="grid"
                            gap="32px"
                            width="100%"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                              '& > div': {
                                gridColumn: isNonMobile ? undefined : 'span 4',
                              },
                            }}
                          >
                            <TextField
                              fullWidth
                              variant="filled"
                              type="text"
                              label="Email"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.email}
                              name="email"
                              error={!!touched.email && !!errors.email}
                              helperText={touched.email && errors.email}
                              sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                              fullWidth
                              variant="filled"
                              type="password"
                              label="Password"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              value={values.password}
                              name="password"
                              error={!!touched.password && !!errors.password}
                              helperText={touched.password && errors.password}
                              sx={{ gridColumn: 'span 4' }}
                            />
                          </Box>
                          <Box display="flex" justifyContent="center" mt="32px">
                            <Button
                              type="submit"
                              color="secondary"
                              variant="contained"
                              size="large"
                            >
                              Login
                            </Button>
                          </Box>
                        </form>
                      )}
                    </Formik>
                    <Box
                      display="flex"
                      width="100%"
                      justifyContent="center"
                      alignItems="center"
                      flexDirection="row"
                      mt="32px"
                    >
                      {/* <Typography variant="h6" m="0" color={colors.grey[100]}>
                    Fogot password?
                  </Typography> */}
                      <Box ml="10px" className="link">
                        <Link to="/">Reset Password</Link>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
