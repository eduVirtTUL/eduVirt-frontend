import {Dialog, DialogContent, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useTranslation} from "react-i18next";
import {Badge} from "../ui/badge";
import {Plus, SearchIcon, XCircleIcon, XIcon} from "lucide-react";
import {Button} from "../ui/button";
import {Input} from "../ui/input";
import {useState} from "react";

interface SearchByEmailModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSearch: (emails: string[]) => void;
}

const isValidInput = (input: string) => /^[a-zA-Z0-9]*$/.test(input);

export function SearchStudentsInCourseModal({open, onOpenChange, onSearch}: SearchByEmailModalProps) {
    const {t} = useTranslation();
    const [emails, setEmails] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isValidInput(e.key) && 
          !['Enter', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', ' ', ','].includes(e.key)) {
          e.preventDefault();
          return;
      }

      if (e.key === 'Enter' || e.key === ',' || e.key === ' ') {
          e.preventDefault();
          const email = currentInput.trim();
          if (email && !emails.includes(email) && isValidInput(email)) {
              setEmails([...emails, email]);
              setCurrentInput("");
          }
      }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const newEmails = pastedText
        .split(/[,\s]+/)
        .map(email => email.trim())
        .filter(email => email && !emails.includes(email) && isValidInput(email));

    if (newEmails.length > 0) {
        setEmails(prev => [...prev, ...newEmails]);
    }
};

    const handleModalClose = (open: boolean) => {
        if (!open) {
            setEmails([]);
            setCurrentInput("");
        }
        onOpenChange(open);
    };

    const removeEmail = (emailToRemove: string) => {
        setEmails(emails.filter(email => email !== emailToRemove));
    };

    const handleSearch = () => {
        onSearch(emails);
        onOpenChange(false);
        setEmails([]);
    };

    return (
        <Dialog open={open} onOpenChange={handleModalClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("searchByEmail.title")}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {emails.map(email => (
                            <Badge key={email} variant="secondary">
                                {email}
                                <XIcon
                                    className="ml-2 h-3 w-3 cursor-pointer"
                                    onClick={() => removeEmail(email)}
                                />
                            </Badge>
                        ))}
                    </div>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <Input
                                value={currentInput}
                                onChange={(e) => {
                                    if (isValidInput(e.target.value)) {
                                        setCurrentInput(e.target.value);
                                    }
                                }}
                                onKeyDown={handleKeyDown}
                                onPaste={handlePaste}
                                className="flex-1"
                            />
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                    if (currentInput.trim() && !emails.includes(currentInput.trim())) {
                                        setEmails([...emails, currentInput.trim()]);
                                        setCurrentInput("");
                                    }
                                }}
                            >
                                <Plus className="h-4 w-4"/>
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            {t("searchByEmail.description1")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {t("searchByEmail.description2")}
                        </p>
                        <div className="flex flex-row justify-between mt-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    handleModalClose(false)
                                }}
                            >
                                <XCircleIcon/>
                                {t("cancel")}
                            </Button>
                            <Button onClick={handleSearch} disabled={emails.length === 0}>
                                <SearchIcon/>
                                {t("searchByEmail.search")}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}