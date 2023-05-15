import { ReactElement, ReactNode } from "react";

export type ISidebar = {
  sideLinks: IGenericLink[];
};

export type IUtilbar = {
  utilLinks: IGenericLink[];
};

export type IDefaultPage = {
  name: string;
  children: ReactNode;
};

export type IGenericLink = {
  name: string;
  link: string;
  view?: string;
};

export type ISkill = {
  id: string;
  name: string;
  description: string;
};

export type IExercise = {
  name: string;
  description: string;
  skills: ISkill[];
};

export type IOptions = {
  optionContent: string;
};

export type IOverviewData = {
  instructor: string;
  exercises: IExercise[];
  assessments: IGenericLink[];
};

export type TableHeaders = {
  proportion: string | null;
  content: string | ReactNode;
};


export type ITrainingSession = {
  sessionid: string;
	sessionstarttime: Date;
	sessionendtime: Date;
	sessionlocation: string;
	sessioncapacity: number;
	instructorid: string;
	levelid: string
}

export type IUser = {
  id: string;
  isInstructor: boolean;
}

export type IAuthState = {
  token: string;
  isAuthenticated: boolean;
  loading: boolean;
  user: IUser;
}

