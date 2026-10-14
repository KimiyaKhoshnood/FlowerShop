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
import ButtonUI from "./ButtonUI";
import { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import {
  LocalizationProvider,
  DateCalendar,
  PickersDay,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from '@mui/icons-material/Close';
import { useShoppingItemsContext } from "@/context/context";
import { useLanguage } from "@/providers/LanguageProvider";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

/** Shows the chosen delivery date and lets the customer pick a new one. */
const ChangeDate = () => {
  const { lang, dictionary } = useLanguage()
  const { deliveryDate, setDeliveryDate } = useShoppingItemsContext();
  const [draftDate, setDraftDate] = useState<Dayjs | null>(null);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setDraftDate(deliveryDate ? dayjs(deliveryDate) : null);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleSave = () => {
    setDeliveryDate(draftDate ? draftDate.format("YYYY-MM-DD") : null);
    setOpen(false);
  };

  const formattedDate = deliveryDate
    ? dayjs(deliveryDate).toDate().toLocaleDateString(lang == "fa" ? "fa-IR" : "en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
    : dictionary?.delivery?.notSelected;

  return (
    <>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="delivery-dialog-title"
        open={open}
        fullScreen={fullScreen}
        sx={{
          '.MuiDialog-paper': {
            borderRadius: 4,
          }
        }}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="delivery-dialog-title">
          {dictionary?.delivery?.dialogTitle}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            insetInlineEnd: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <div className="grid md:grid-cols-2 gap-2">
            <div className="md:order-1 order-2 flex" dir="ltr">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  value={draftDate}
                  onChange={(newDate) => setDraftDate(newDate)}
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
                {dictionary?.delivery?.label}
              </h3>
              <hr className="md:block hidden" />
              <p>{dictionary?.delivery?.hint}</p>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSave} disabled={!draftDate} sx={{ color: "#4e0629" }}>
            {dictionary?.delivery?.save}
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <div className="bg-(--BabyPink) py-2 px-4 md:rounded-3xl md:w-fit w-full h-fit flex items-center gap-2 justify-between">
        <div>
          <span>{dictionary?.delivery?.label}: </span>
          <span className="font-bold">{formattedDate}</span>
        </div>
        <ButtonUI
          onClick={handleClickOpen}
          text={dictionary?.delivery?.change}
          className="bg-(--Burgundy) text-(--BabyPink) text-xs font-bold"
        />
      </div>
    </>
  );
};

export default ChangeDate;
