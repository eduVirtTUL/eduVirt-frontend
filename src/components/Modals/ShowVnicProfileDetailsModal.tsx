import React from "react";
import {useDialog} from "@/stores/dialogStore.ts";
import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {useVnicProfile} from "@/data/network/useVnicProfile.ts";

const ShowVnicProfileDetailsModal: React.FC = () => {
    const {isOpen, close} = useDialog();
    // TODO continue...
    const {vnicProfile} = useVnicProfile("");

    return (
        <Dialog
            open={isOpen("showVnicProfileDetails")}
            onOpenChange={() => {
                close();
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Vnic profile details</DialogTitle>
                </DialogHeader>
                <div>
                    <b>ID:</b>{vnicProfile?.id ?? "unknown"}
                    <br/>
                    <b>Name:</b>{vnicProfile?.name ?? null}
                    <br/>
                    <b>In use:</b>{vnicProfile?.inUse ?? null}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShowVnicProfileDetailsModal;
