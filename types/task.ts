export interface Task {
  id: string;
  text: string;
  completed: boolean;
  profileId: string;
  date: string;
}

export interface Profile {
  id: string;
  name: string;
}
