"use client";
import { InputTypes, Routes } from "@/constants/enums";
import useFormFields from "@/hooks/useFormFields";
import { IFormField } from "@/types/app";
import { Translations } from "@/types/translations";
import { Session } from "next-auth";
import Image from "next/image";
import FormFields from "../form-fields/form-fields";
import { Button } from "../ui/button";
import { UserRole } from "@prisma/client";
import Checkbox from "../form-fields/checkbox";
import { useActionState, useEffect, useState } from "react";
import { ValidationErrors } from "@/validations/auth";
import { updateProfile } from "./_actions/profile";
import Loader from "../ui/loader";
import { CameraIcon } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks";
import { selectCartItems } from "@/redux/features/cart/cartSlice";
import { getTotalAmount } from "@/lib/cart";
import { formatCurrency } from "@/lib/formatters";

function EditUserForm({
  translations,
  user,
}: {
  translations?: Translations;
  user: Session["user"];
}) {
  const cart = useAppSelector(selectCartItems);
  const totalAmount = getTotalAmount(cart);
  const { locale } = useParams();
  const session = useSession();
  const formData = new FormData();
  const [imageFile, setImageFile] = useState<File | null>(null);

  Object.entries(user).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== "image") {
      formData.append(key, value.toString());
    }
  });
  if (imageFile) {
    formData.append("image", imageFile);
  }
  const pathname=usePathname()

  const initialState: {
    message?: string;
    error?: ValidationErrors;
    status?: number | null;
    formData?: FormData | null;
  } = {
    message: "",
    error: {},
    status: null,
    formData,
  };
  const [selectedImage, setSelectedImage] = useState(user? user.image : "");

  const [isAdmin, setIsAdmin] = useState(user.role === UserRole.ADMIN);

  const [state, action, pending] = useActionState(
    updateProfile.bind(null, isAdmin),
    initialState
  );
  const { getFormFields } = useFormFields({
    slug: Routes.PROFILE,
    translations: translations as Translations,
  });

  useEffect(() => {
    if (state.message && state.status && !pending) {
      toast({
        title: state.message,
        className: state.status === 200 ? "text-green-400" : "text-destructive",
      });
    }
    console.log(user)
  }, [pending, state.message, state.status]);

  useEffect(() => {
    setSelectedImage(user.image as string);
  }, [user.image]);

  return (
    <>
    {
      cart.length === 0 && pathname.includes("cart") ?(
       <div></div>
      
      ):(
    <form action={action} className="flex flex-col md:flex-row gap-10">
      <div className= {`group relative w-[200px] h-[200px] overflow-hidden rounded-full mx-auto ${pathname.includes("cart") ? "hidden" : ""}`}>
        {selectedImage && (
          <div>
          <Image
            src={selectedImage}
            alt={user.name}
            width={200}
            height={200}
            className="rounded-full object-cover"
          />
      <p className="text-xs text-gray-500">accept only jpg, jpeg </p>
      </div>


        )}

        <div
          className={`${
            selectedImage
              ? "group-hover:opacity-[1] opacity-0  transition-opacity duration-200"
              : ""
          } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
        >
        <UploadImage
          selectedImage={selectedImage as string}
          setSelectedImage={setSelectedImage as React.Dispatch<React.SetStateAction<string>>}
        />
        

        </div>
        
      </div>
      
      <div className="flex-1">
        {getFormFields().map((field: IFormField) => {
          const fieldValue =
            state?.formData?.get(field.name) ?? formData.get(field.name);
          return (
            <div key={field.name} className="mb-3">
              <FormFields
                {...field}
                defaultValue={fieldValue as string}
                error={state?.error}
                readOnly={field.type === InputTypes.EMAIL}
              />
            </div>
          );
        })}
        {session.data?.user.role === UserRole.ADMIN && (
          <div className="flex items-center gap-2 my-4">
            <Checkbox
              name="admin"
              type="checkbox"
              checked={isAdmin}
              onClick={() => setIsAdmin(!isAdmin)}
              label="Admin"
            />
          </div>
        )}
        {pathname.includes("cart") ? (
             <Link
             href={`/${locale}/${Routes.CHECKOUT}?amount=${totalAmount}`}
             className='h-10 bg-primary text-white rounded-md flex items-center justify-center'
           >
             Pay {formatCurrency(totalAmount)}
           </Link>
        ):
              <Button type="submit" className="w-full">
          {pending ? <Loader /> : translations?.save || "Save"}
        </Button>
        }
    
      </div>
    </form>
    )}
    </>
    );
}

export default EditUserForm;

const UploadImage = ({
  selectedImage,
  setSelectedImage,
}: {
  selectedImage: string;
  setSelectedImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Just set preview — browser will still submit the file via the input
      const previewUrl = URL.createObjectURL(file);
      setSelectedImage(previewUrl);
    }
  };

  return (
    <div className="group mx-auto md:mx-0 relative w-[200px] h-[200px] overflow-hidden rounded-full">
      {selectedImage && (
        <Image
          src={selectedImage}
          alt="User image preview"
          width={200}
          height={200}
          className="rounded-full object-cover"
        />
      )}

      <div
        className={`${
          selectedImage
            ? "group-hover:opacity-[1] opacity-0 transition-opacity duration-200"
            : ""
        } absolute top-0 left-0 w-full h-full bg-gray-50/40`}
      >
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          className="hidden"
          id="image-upload"
          onChange={handleImageChange}
          name="image" // 👈 This is essential for form submission
        />

        <label
          htmlFor="image-upload"
          className="border rounded-full w-[200px] h-[200px] flex items-center justify-center cursor-pointer"
        >
          <CameraIcon className="!w-8 !h-8 text-accent" />
        </label>
      </div>
    </div>
  );
};
