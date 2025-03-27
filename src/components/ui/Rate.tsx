"use client"
import { Rating } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const Rate = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    const burgundy = rootStyles.getPropertyValue("--Burgundy").trim();
    
  return (
    <Rating
      value={2.7}
      readOnly
      precision={0.5}
      icon={<StarRoundedIcon sx={{ color: burgundy }} fontSize="medium" />}
      emptyIcon={<StarRoundedIcon fontSize="medium" />}
    />
  );
};

export default Rate;
