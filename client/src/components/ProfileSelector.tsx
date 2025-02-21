import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { Profile } from "@shared/schema";

interface ProfileSelectorProps {
  selectedProfile: number | null;
  onSelectProfile: (id: number) => void;
}

export function ProfileSelector({ selectedProfile, onSelectProfile }: ProfileSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const { toast } = useToast();

  const { data: profiles = [], isLoading } = useQuery<Profile[]>({
    queryKey: ['/api/profiles'],
  });

  const createProfileMutation = useMutation({
    mutationFn: async (name: string) => {
      await apiRequest('POST', '/api/profiles', { name });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
      setIsOpen(false);
      setNewProfileName("");
      toast({
        title: "Profile created",
        description: "Your profile has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteProfileMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/profiles/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/profiles'] });
      if (profiles.length > 0) {
        onSelectProfile(profiles[0].id);
      }
      toast({
        title: "Profile deleted",
        description: "Your profile has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete profile: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading profiles...</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedProfile?.toString()}
        onValueChange={(value) => onSelectProfile(parseInt(value))}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a profile" />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id.toString()}>
              {profile.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create new profile</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <Input
              placeholder="Profile name"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
            />
            <Button
              onClick={() => createProfileMutation.mutate(newProfileName)}
              disabled={!newProfileName || createProfileMutation.isPending}
            >
              Create Profile
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedProfile && (
        <Button
          variant="destructive"
          size="icon"
          onClick={() => deleteProfileMutation.mutate(selectedProfile)}
          disabled={deleteProfileMutation.isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
