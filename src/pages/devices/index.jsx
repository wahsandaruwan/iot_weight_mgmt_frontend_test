import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Button,
  useTheme,
  Tooltip,
  IconButton,
} from '@mui/material'
import { DataGrid, GridToolbar } from '@mui/x-data-grid'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

import styles from './devices.module.css'
import Header from '../../components/header'

import { tokens } from '../../theme'
import { mockDataDevice } from '../../data/mockData'
import deviceImg from './device.jpg'

import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

const Devices = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [device, setDevice] = useState([])
  const [asignedItem, setAsignedItem] = useState([])
  const navigate = useNavigate()

  // GET with Axios
  const accessToken = localStorage.getItem('accessToken')
  // useEffect(() => {
  //   const AsignedItem = {
  //     method: 'GET',
  //     url: `http://137.184.13.207:3300/api/device/all`,
  //     // url: `http://137.184.13.207:3300/api/device/item_details/all`,
  //     headers: {
  //       'content-type': 'application/json',
  //       token: `Bearer ${accessToken}`,
  //     },
  //     data: {},
  //   }
  //   axios(AsignedItem)
  //     .then((response) => {
  //       // setAsignedItem(response.data)
  //       // console.log(response.data.WeighingDevice)
  //       console.log(response.data)
  //     })
  //     .catch((error) => {
  //       console.log(error)
  //     })
  // }, [])

  useEffect(() => {
    const getDevices = {
      method: 'GET',
      url: `http://137.184.13.207:3300/api/device/item_details/all`,
      headers: {
        'content-type': 'application/json',
        token: `Bearer ${accessToken}`,
      },
      data: {},
    }
    axios(getDevices)
      .then((response) => {
        setDevice(response.data.WeighingDevice)
        // setAsignedItem(response.data)
        // console.log(response.data.WeighingDevice.itemDetails)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const handleProceed = (rowId) => {
    // navigate(`/devices/devicestat`)
    navigate(`/devices/devicestat/${rowId}`)
  }

  const convertItemDetails = (itemDetails) => {
    if (itemDetails && itemDetails.length > 0) {
      const { title, weight } = itemDetails[0]
      return `${title} - ${weight}`
    }
    return ''
  }

  const columns = [
    { field: '_id', headerName: 'ID', flex: 1 },
    {
      field: 'img',
      headerName: 'Picture',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box className={styles.cellWithImg}>
            <img className={styles.cellImg} src={deviceImg} alt="device" />
          </Box>
        )
      },
    },
    {
      field: 'title',
      headerName: 'Name',
      cellClassName: 'name-column--cell',
      flex: 1,
    },
    // {
    //   field: 'itemDetails',
    //   headerName: 'Assigned Item',
    //   flex: 1,
    //   renderCell: (params) => convertItemDetails(params.value),
    // },
    // {
    //   field: 'weight',
    //   headerName: 'Weight',
    //   type: 'number',
    //   headerAlign: 'left',
    //   align: 'left',
    //   width: 200,
    // },
    // {
    //   field: 'battery',
    //   headerName: 'Battery Percentage',
    //   width: 200,
    // },
    // {
    //   field: 'status',
    //   headerName: 'Status',
    //   width: 200,
    //   renderCell: ({ row: { status } }) => {
    //     return (
    //       <Box>
    //         {status === 'Active' && (
    //           <Typography color={colors.greenAccent[400]} sx={{ ml: '5px' }}>
    //             {status}
    //           </Typography>
    //         )}
    //         {status === 'Inactive' && (
    //           <Typography color={colors.redAccent[400]} sx={{ ml: '5px' }}>
    //             {status}
    //           </Typography>
    //         )}
    //       </Box>
    //     )
    //   },
    // },

    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      cellClassName: 'actions',
      flex: 1,
      renderCell: (params) => {
        return (
          <Box p="5px" display="flex" justifyContent="center" gap="10px">
            <Tooltip title="View device" arrow>
              <IconButton onClick={() => handleProceed(params.row._id)}>
                <VisibilityOutlinedIcon fontSize="large" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Remove device" arrow>
              <IconButton color="error">
                <DeleteOutlineOutlinedIcon
                  fontSize="large"
                  sx={{ color: colors.redAccent[500] }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        )
      },
    },
  ]

  return (
    <Box m="0 32px">
      <Header title="DEVICES" subtitle="Status Reports of Linked Devices" />
      <Box display="flex" justifyContent="end">
        <Link to="/devices/adddevice">
          <Button
            type="submit"
            size="large"
            color="secondary"
            variant="contained"
          >
            Add Device
          </Button>
        </Link>
      </Box>
      <Box
        height="75vh"
        mt="10px"
        sx={{
          '& .MuiDataGrid-toolbarContainer': {
            backgroundColor: colors.blueAccent[700],
            borderTopLeftRadius: '5px',
            borderTopRightRadius: '5px',
          },
          '& .MuiButtonBase-root': {
            color: colors.grey[200],
          },
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: 'none',
          },
          '& .name-column--cell': {
            color: colors.greenAccent[300],
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
            borderRadius: 0,
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiCheckbox-root': {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid
          slots={{ toolbar: GridToolbar }}
          checkboxSelection
          rows={device}
          columns={columns}
          rowHeight={100}
          getRowId={(device) => device._id}
        />
      </Box>
    </Box>
  )
}

export default Devices
