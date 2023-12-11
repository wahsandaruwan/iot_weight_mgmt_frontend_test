import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Battery5BarOutlinedIcon from "@mui/icons-material/Battery5BarOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

const ProgressCircle = ({
  progress = "0.75",
  subText = "5",
  size = "120",
  icon = "battery",
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;
  const percentage = Math.round(progress * 100);
  const color = `hsl(${progress * 120}, 100%, 50%)`; // Dynamic color based on percentage

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        // background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
        //     conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
        //     ${colors.greenAccent[500]}`,
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${color}`,
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {icon === "battery" ? (
        <>
          <Battery5BarOutlinedIcon sx={{ fontSize: "24px" }} />
          <Box display="flex" flexDirection="column">
            <Typography variant="h5" ml="5px" mt="5px">
              {percentage}%
            </Typography>
            <Typography variant="h6" ml="5px" color={colors.greenAccent[500]}>
              {subText}v
            </Typography>
          </Box>
        </>
      ) : (
        <>
          <CategoryOutlinedIcon sx={{ fontSize: "24px" }} />
          <Box display="flex" flexDirection="column">
            <Typography variant="h5" ml="5px" mt="5px">
              {percentage}
            </Typography>
            <Typography ml="5px" color={colors.greenAccent[500]}>
              {subText}g
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ProgressCircle;
