import { useState } from "react";
import { ProfileSelector } from "@/components/ProfileSelector";
import { TaskList } from "@/components/TaskList";
import { TaskProvider } from "@/contexts/TaskContext";

export default function Home() {
  const [selectedProfile, setSelectedProfile] = useState<number | null>(null);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>
        
        <ProfileSelector
          selectedProfile={selectedProfile}
          onSelectProfile={setSelectedProfile}
        />

        {selectedProfile && (
          <TaskProvider profileId={selectedProfile}>
            <TaskList />
          </TaskProvider>
        )}

        {!selectedProfile && (
          <div className="text-center text-muted-foreground">
            Please select or create a profile to manage tasks
          </div>
        )}
      </div>
    </div>
  );
}
