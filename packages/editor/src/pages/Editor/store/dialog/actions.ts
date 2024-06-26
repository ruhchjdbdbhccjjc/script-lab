import { createAction } from "typesafe-actions";
import { DialogType } from "office-ui-fabric-react/lib/Dialog";

interface IShowDialogProps {
  title: string;
  subText: string;
  buttons: Array<{
    key: string;
    text: string;
    action: { type: string; payload?: any };
    isPrimary: boolean;
  }>;
  style?: DialogType;
  isBlocking?: boolean;
}
export const show = createAction("DIALOG_SHOW", (resolve) => {
  return ({
    title,
    subText,
    buttons,
    style = DialogType.largeHeader,
    isBlocking = false,
  }: IShowDialogProps) => resolve({ title, subText, buttons, style, isBlocking });
});

export const dismiss = createAction("DIALOG_DISMISS");

// private usage for reducer to make it so the dialog disappears nicely then has it's info reset
export const hide = createAction("DIALOG_HIDE");
export const reset = createAction("DIALOG_RESET");
