import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {useTranslation} from "react-i18next"
import {X, Check} from "lucide-react"
import { useState } from "react"

interface MaxRentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (maxRent: number) => void
    defaultValue?: number
}

const MaxRentModal = ({open, onOpenChange, onSubmit, defaultValue = 1}: MaxRentModalProps) => {
    const {t} = useTranslation()
    const [maxRent, setMaxRent] = useState(defaultValue)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("statefulPodManagement.addMaxRentTimeModal.title")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="maxRent">{t("statefulPodManagement.addMaxRentTimeModal.maxRent")}</Label>
                        <Input
                            id="maxRent"
                            type="number"
                            min={1}
                            value={maxRent}
                            onChange={(e) => setMaxRent(Number(e.target.value))}
                        />
                        <p className="text-sm text-muted-foreground">
                            {t("statefulPodManagement.addMaxRentTimeModal.description")}
                        </p>
                    </div>
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            <X className="h-4 w-4"/>
                            {t("cancel")}
                        </Button>
                        <Button
                            onClick={() => {
                                onSubmit(maxRent)
                                onOpenChange(false)
                            }}
                        >
                            <Check className="h-4 w-4"/>
                            {t("save")}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default MaxRentModal
