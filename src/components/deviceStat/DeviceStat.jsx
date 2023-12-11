import React from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../header";
import ProgressCircle from "../progressCircle/ProgressCircle";
import Device from "./device.jpg";
import styles from "./deviceStat.module.css";
import { useState, useEffect } from "react";
import LineChart from "../lineChartDevice";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const checkoutSchema = yup.object().shape({
  status: yup.string().required("Required"),
  weight: yup.string().required("Required"),
  assignedItem: yup.string().required("Required"),
});

const DeviceStat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [image, setImage] = useState([]);
  const [imageURL, setImageURL] = useState([]);
  const [isImage, setIsImage] = useState(false);
  const [device, setDevice] = useState([]);
  const [asignedItem, setAsignedItem] = useState([]);
  const [chartData, setChartData] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const accessToken = localStorage.getItem("accessToken");

  const fetchData = () => {
    const fetchDevice = {
      method: "GET",
      url: `http://137.184.13.207:3300/api/device/one/${id}`,
      headers: {
        "content-type": "application/json",
        token: `Bearer ${accessToken}`,
      },
      data: {},
    };
    axios(fetchDevice)
      .then((response) => {
        setDevice(response.data.weighingDeviceData[0]);
      })
      .catch((error) => {
        console.log(error);
      });

    const fetchAssignedItems = {
      method: "GET",
      url: `http://137.184.13.207:3300/api/device/item_details/one/${id}`,
      headers: {
        "content-type": "application/json",
        token: `Bearer ${accessToken}`,
      },
      data: {},
    };
    axios(fetchAssignedItems)
      .then((response) => {
        setAsignedItem(response.data.weighingDeviceData[0]);
      })
      .catch((error) => {
        console.log(error);
      });

    const fetchChartData = {
      method: "GET",
      url: `http://137.184.13.207:3300/api/device/all/${id}`,
      headers: {
        "content-type": "application/json",
        token: `Bearer ${accessToken}`,
      },
      data: {},
    };
    axios(fetchChartData)
      .then((response) => {
        const data = response.data.weighingDeviceData[0].deviceData?.map(
          (entry) => ({
            x: entry.timeCreated,
            y: parseFloat(entry.totalWeight),
          })
        );

        setChartData(data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();

    const intervalId = setInterval(fetchData, 3600000);
    return () => clearInterval(intervalId);
  }, [id, accessToken]);

  const chart = [
    {
      id: "Device",
      color: "hsl(268, 70%, 50%)",
      data: chartData,
    },
  ];

  useEffect(() => {
    if (image.length < 1) return;
    const newImageUrl = [];
    image.forEach((image) => newImageUrl.push(URL.createObjectURL(image)));
    setImageURL(newImageUrl);
  }, [image]);

  useEffect(() => {
    const MAX_FILE_SIZE = 2048;
    if (image.length < 1) return;
    const fileSize = image[0].size / 1024;
    if (fileSize > MAX_FILE_SIZE) {
      Swal.fire({
        title: "Error",
        text: "Maximum image size must be less than 2MB",
        icon: "error",
        background: colors.primary[400],
        color: colors.grey[100],
        confirmButtonColor: "#4cceac",
      }).then((result) => {
        if (result.isConfirmed) {
          setImage([]);
          setIsImage(!isImage);
        }
      });
    }
  }, [image]);

  function onImageChange(e) {
    setImage([...e.target.files]);
    setIsImage(!isImage);
  }

  const clearImage = () => {
    setImage([]);
    setIsImage(!isImage);
  };

  const handleFormSubmit = (values) => {
    console.log(values);
    // window.location.reload(false)
  };

  const convertItemDetails = (itemDetails) => {
    if (itemDetails && itemDetails.length > 0) {
      const { title, weight } = itemDetails[0];
      return `${title} - ${weight}kg`;
    }
    return "";
  };

  const initialValues = {
    status: "active",
    deviceId: device._id,
    dateCreated: device.dateCreated,
    lastUpdate: device.dateUpdated,
    assignedItem: "01",
  };

  console.log(device);

  return (
    <Box m="0 32px">
      <Header
        title={asignedItem.title}
        // subtitle={convertItemDetails(asignedItem.itemDetails)}
      />
      {/* <Box display="flex" justifyContent="end">
        <Button
          type="submit"
          size="large"
          color="secondary"
          variant="contained"
        >
          Get Report
        </Button>
      </Box> */}

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
        enableReinitialize={true}
      >
        {({
          values,
          errors,
          touched,
          dirty,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
          handleReset,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              width="100%"
              flexDirection="row"
              gap="32px"
              mt="32px"
            >
              <Box display="flex" mb="32px">
                <input
                  accept="image/*"
                  style={{ display: "none" }}
                  id="raised-button-file"
                  multiple
                  type="file"
                  onChange={onImageChange}
                />
                <label htmlFor="raised-button-file">
                  {image.length < 1 ? (
                    <Box
                      className={styles.imageContainer}
                      width="350px"
                      height="200px"
                      borderRadius="25px"
                      bgcolor={colors.primary[400]}
                      sx={{ cursor: "pointer" }}
                    >
                      <img src={Device} alt="offerImage" />
                      {/* 'https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500' */}
                    </Box>
                  ) : (
                    <Box
                      className={styles.imageContainer}
                      width="350px"
                      height="200px"
                      borderRadius="25px"
                      bgcolor={colors.primary[400]}
                      sx={{ cursor: "pointer" }}
                    >
                      {imageURL.map((imageSrc) => (
                        <img src={imageSrc} />
                      ))}
                    </Box>
                  )}
                </label>
              </Box>
              <Box
                display="grid"
                gap="30px"
                width="100%"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Device ID"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.deviceId || ""}
                  name="deviceId"
                  disabled={true}
                  error={!!touched.deviceId && !!errors.deviceId}
                  helperText={touched.deviceId && errors.deviceId}
                  sx={{ gridColumn: "span 2" }}
                />
                <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Date Created"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.dateCreated || ""}
                  name="dateCreated"
                  disabled={true}
                  error={!!touched.dateCreated && !!errors.dateCreated}
                  helperText={touched.dateCreated && errors.dateCreated}
                  sx={{ gridColumn: "span 2" }}
                />
                {/* <TextField
                  fullWidth
                  variant="filled"
                  type="text"
                  label="Last Updated On"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastUpdate || ''}
                  name="lastUpdate"
                  disabled={true}
                  error={!!touched.lastUpdate && !!errors.lastUpdate}
                  helperText={touched.lastUpdate && errors.lastUpdate}
                  sx={{ gridColumn: 'span 2' }}
                />
                <TextField
                  fullWidth
                  select
                  variant="filled"
                  type="text"
                  label="Status"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.status || ''}
                  name="status"
                  error={!!touched.status && !!errors.status}
                  helperText={touched.status && errors.status}
                  sx={{ gridColumn: 'span 2' }}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  select
                  variant="filled"
                  type="text"
                  label="Assigned Item"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.assignedItem || ''}
                  name="assignedItem"
                  error={!!touched.assignedItem && !!errors.assignedItem}
                  helperText={touched.assignedItem && errors.assignedItem}
                  sx={{ gridColumn: 'span 2' }}
                >
                  <MenuItem value="01">Cardboard - 5kg</MenuItem>
                  <MenuItem value="02">Cardboard - 10kg</MenuItem>
                  <MenuItem value="03">Cardboard - 15kg</MenuItem>
                  <MenuItem value="04">Cardboard - 20kg</MenuItem>
                  <MenuItem value="05">Cardboard - 25kg</MenuItem>
                </TextField> */}
              </Box>
            </Box>
            {/* <Box
              display="flex"
              flexDirection="row"
              justifyContent="end"
              gap="20px"
              mt="20px"
            >
              <Button
                type="submit"
                color="error"
                variant="contained"
                disabled={(!isImage && !dirty) || isSubmitting}
                onClick={(handleReset, clearImage)}
              >
                Reset
              </Button>
              <Button
                type="submit"
                color="secondary"
                variant="contained"
                disabled={!dirty || isSubmitting}
              >
                Update Status
              </Button>
            </Box> */}
          </form>
        )}
      </Formik>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        flexDirection="column"
        width="100%"
        backgroundColor={colors.primary[400]}
        mt="50px"
        p="15px 20px"
      >
        <Box width="100%" display="flex" height="100%" gap="10px">
          <Box
            display="flex"
            padding="10px"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap="10px"
            backgroundColor={"#dad3d3"}
          >
            <Typography variant="h4">Items</Typography>
            {device.deviceData ? (
              <ProgressCircle
                progress={device.deviceData?.itemCount / 100}
                icon="count"
                subText={parseInt(device.deviceData?.totalWeight)}
              />
            ) : null}
          </Box>
          <Box
            display="flex"
            padding="10px"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
            gap="10px"
            backgroundColor={"#dad3d3"}
          >
            <Typography variant="h4">Battery</Typography>
            {device.deviceData ? (
              <ProgressCircle
                progress={device.deviceData?.batteryPercentage / 100}
                icon="battery"
                subText={device.deviceData?.batteryVoltage}
              />
            ) : null}
          </Box>
        </Box>
        <Box height="50vh" width="100%" pb="20px" mt="30px">
          <Typography variant="h3">Daily Stat</Typography>
          <LineChart data={chart} />
        </Box>
      </Box>
    </Box>
  );
};

export default DeviceStat;
