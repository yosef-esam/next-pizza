import { IFormField } from "@/types/app";
import { Label } from "../ui/label";
import { Checkbox as ShadcnCheckbox } from "../ui/checkbox";
import { ValidationErrors } from "@/validations/auth";

interface Props extends IFormField {
  error?: ValidationErrors;
  checked?: boolean;
  onClick?: () => void;
}

const Checkbox = ({ label, name, error, checked, onClick }: Props) => {
  return (
    <div className="text-accent flex items-center gap-2">
      <ShadcnCheckbox
        id={name}
        name={name}
        checked={checked}
        onClick={onClick}
      />
      <Label htmlFor={name} className="text-sm font-normal">
        {label}
      </Label>
      {error?.[name] && (
        <p className="text-sm text-destructive">{error[name]}</p>
      )}
    </div>
  );
};

export default Checkbox;
