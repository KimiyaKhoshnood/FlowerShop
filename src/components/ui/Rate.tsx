"use client"
import { Rating } from "@mui/material";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const Rate = () => {
    
  return (
    <Rating
      value={2.7}
      readOnly
      precision={0.5}
      icon={<StarRoundedIcon className="text-(--Burgundy)" fontSize="medium" />}
      emptyIcon={<StarRoundedIcon fontSize="medium" />}
    />
  );
};

export default Rate;
