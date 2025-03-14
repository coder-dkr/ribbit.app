import { useContext } from "react";
import { CameraContext } from "@/contexts/CameraContext";

export const useCamera = () => {
    const context = useContext(CameraContext)
    if(context === undefined) {
        throw new Error("useCamera must only be used within Camera Provider")
    }

    return context
}
