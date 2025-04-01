"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ButtonUI from "./ui/ButtonUI";
import { useState } from "react";
import { Dayjs } from "dayjs";
import {
  LocalizationProvider,
  DateCalendar,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const ChangeDate = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  );
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullScreen={fullScreen}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Select Delivery Date
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className="grid md:grid-cols-2 gap-2">
            <div className="md:order-1 order-2 flex">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newDate) => {
                    setSelectedDate(newDate);
                    setDate(newDate?.format("MMM D, YYYY"));
                  }}
                  slots={{
                    day: (props) => (
                      <PickersDay
                        {...props}
                        sx={{
                          "&.Mui-selected": {
                            backgroundColor: "#4e0629 !important", 
                            color: "#fff !important",
                          },
                          "&.Mui-selected:hover": {
                            backgroundColor: "#3b041f !important",
                          },
                          "&.MuiPickersDay-root:hover": {
                            backgroundColor: "#4e0629 !important",
                            color: "#fff !important",
                          },
                          "&.Mui-focusVisible": {
                            backgroundColor: "#4e0629 !important",
                            color: "#fff !important",
                          },
                        }}
                      />
                    ),
                  }}
                  disablePast
                />
              </LocalizationProvider>
            </div>
            <div className="py-5 flex flex-col gap-5 order-1">
              <h3 className="text-(--Burgundy) font-bold text-2xl md:block hidden">
                Delivery Date
              </h3>
              <hr className="md:block hidden"/>
              <p>
                Please select a delivery date to obtain an accurate price. We
                suggest selecting delivery date 2-3 days before the event date.
              </p>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose} sx={{ color: "#4e0629" }}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <div className="bg-(--BabyPink) py-2 px-4 md:rounded-3xl md:w-fit w-full h-fit flex items-center gap-2 justify-between">
        <div>
          <span>{"Delivery Date: "}</span>
          <span className="font-bold">{date}</span>
        </div>
        <div className="rounded-3xl" onClick={handleClickOpen}>
          <ButtonUI
            text="Change"
            className="bg-(--Burgundy) text-(--BabyPink) text-xs font-bold"
          />
        </div>
      </div>
    </>
  );
};

export default ChangeDate;
