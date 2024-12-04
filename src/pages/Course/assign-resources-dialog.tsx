import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";
import { useResourceGroups } from "@/data/resourceGroup/useResourceGroups";
import { useCourseResourceGroupPools } from "@/data/rgPool/useCourseResourceGroupPools";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface AssignResourcesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  teamId: string;
  courseId: string;
}

interface Assignment {
  teamId: string;
  resourceGroups: string[];
  resourceGroupPools: string[];
}

const AssignResourcesDialog = ({ open, onOpenChange, teamId, courseId }: AssignResourcesDialogProps) => {
  const { resourceGroups } = useResourceGroups();
  const { courseResourceGroupPools } = useCourseResourceGroupPools(courseId);
  
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedPools, setSelectedPools] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      const stored = localStorage.getItem('teamResourceAssignments');
      if (stored) {
        const assignments: Assignment[] = JSON.parse(stored);
        const teamAssignment = assignments.find(a => a.teamId === teamId);
        if (teamAssignment) {
          setSelectedGroups(teamAssignment.resourceGroups);
          setSelectedPools(teamAssignment.resourceGroupPools);
        } else {
          setSelectedGroups([]);
          setSelectedPools([]);
        }
      } else {
        setSelectedGroups([]);
        setSelectedPools([]);
      }
    }
  }, [teamId, open]);

  const isResourceGroupAssignedToOtherTeam = (groupId: string): boolean => {
    const stored = localStorage.getItem('teamResourceAssignments');
    if (!stored) return false;

    const assignments: Assignment[] = JSON.parse(stored);
    const group = resourceGroups?.find(g => g.id === groupId);
    
    if (!group || group.stateless) return false;

    return assignments.some(assignment => 
      assignment.teamId !== teamId && 
      assignment.resourceGroups.includes(groupId)
    );
  };

  const handleGroupSelection = (groupId: string) => {
    const group = resourceGroups?.find(g => g.id === groupId);
    
    if (!group) return;

    if (!group.stateless && isResourceGroupAssignedToOtherTeam(groupId)) {
      toast.error("This resource group is already assigned to another team");
      return;
    }

    setSelectedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleSave = () => {
    const stored = localStorage.getItem('teamResourceAssignments');
    const assignments: Assignment[] = stored ? JSON.parse(stored) : [];
    
    const hasInvalidAssignment = selectedGroups.some(groupId => {
      const group = resourceGroups?.find(g => g.id === groupId);
      return !group?.stateless && isResourceGroupAssignedToOtherTeam(groupId);
    });

    if (hasInvalidAssignment) {
      toast.error("Some resources are already assigned to other teams");
      return;
    }

    const newAssignment: Assignment = {
      teamId,
      resourceGroups: selectedGroups,
      resourceGroupPools: selectedPools
    };

    const existingIndex = assignments.findIndex(a => a.teamId === teamId);
    if (existingIndex >= 0) {
      assignments[existingIndex] = newAssignment;
    } else {
      assignments.push(newAssignment);
    }

    localStorage.setItem('teamResourceAssignments', JSON.stringify(assignments));
    toast.success("Resources assigned successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign Resources to Team</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="mb-4 text-sm font-medium">Resource Groups</h3>
            <Command>
              <CommandInput placeholder="Search resource groups..." />
              <CommandList>
                <CommandEmpty>No resource groups found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-72">
                    {resourceGroups?.map((group) => (
                      <CommandItem
                        key={group.id}
                        onSelect={() => handleGroupSelection(group.id!)}
                        className={cn(
                          !group.stateless && isResourceGroupAssignedToOtherTeam(group.id!) 
                            ? "opacity-50 cursor-not-allowed" 
                            : ""
                        )}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedGroups.includes(group.id!) ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{group.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {group.stateless ? "Stateless" : "Stateful"}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-medium">Resource Group Pools</h3>
            <Command>
              <CommandInput placeholder="Search pools..." />
              <CommandList>
                <CommandEmpty>No pools found.</CommandEmpty>
                <CommandGroup>
                  <ScrollArea className="h-72">
                    {courseResourceGroupPools?.map((pool) => (
                      <CommandItem
                        key={pool.id}
                        onSelect={() => {
                          setSelectedPools(prev => 
                            prev.includes(pool.id!) 
                              ? prev.filter(id => id !== pool.id)
                              : [...prev, pool.id!]
                          )
                        }}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            selectedPools.includes(pool.id!) ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {pool.name}
                      </CommandItem>
                    ))}
                  </ScrollArea>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save assignments
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignResourcesDialog;