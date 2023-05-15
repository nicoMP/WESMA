create database WESMA;

create table Student(
	studentID uuid default gen_random_uuid() primary key,
	studentNumber varchar(10) not null unique,
	studentName text not null,
	studentProgram text not null,
	studentYear smallint not null,
	studentUserId text not null
);

create table Instructor(
	instructorID uuid default gen_random_uuid() primary key,
	instructorName text not null,
	instructorUserId text not null
);

create table Exercise(
	exerciseID uuid default gen_random_uuid() primary key,
	exerciseName text not null unique,
	exerciseDescription text not null
);

create table Skill(
	skillID uuid default gen_random_uuid() primary key,
	skillName text not null unique,
	skillDescription text not null
);

create table ExerciseSkill(
	exerciseID uuid not null references Exercise on delete cascade,
	skillID uuid not null references Skill on delete cascade,
	primary key (exerciseID, skillID)
);

create table TrainingLevel(
	levelID uuid default gen_random_uuid() primary key,
	levelName text not null unique,
	levelDescription text not null
);

create table StudentLevelCompletion(
	studentID uuid not null references Student on delete cascade,
	levelID uuid not null references TrainingLevel on delete cascade,
	completionDate timestamp not null,
	primary key (studentID, levelID)
);

create table LevelExercise(
	levelID uuid not null references TrainingLevel on delete cascade,
	exerciseID uuid not null references Exercise on delete cascade,
	primary key (levelID, exerciseID)
);

create table TrainingSession(
	sessionID uuid default gen_random_uuid() primary key,
	sessionStartTime timestamp not null,
	sessionEndTime timestamp not null,
	sessionLocation varchar(10) not null,
	sessionCapacity smallint not null,
	instructorID uuid not null references Instructor on delete cascade,
	levelID uuid not null references TrainingLevel on delete cascade,
	unique (sessionStartTime, sessionLocation)
);

create table TrainingSessionEnrolment(
	studentID uuid not null references Student on delete cascade,
	sessionID uuid not null references TrainingSession on delete cascade,
	attendance bool default false,
	primary key (studentID, sessionID)
);

create table OnlineModule(
	moduleID uuid default gen_random_uuid() primary key,
	moduleName text not null,
	moduleDescription text,
	modulePassingGrade int not null check(modulePassingGrade between 0 and 100),
	instructorID uuid not null references Instructor on delete cascade
);

create table ModuleContentQuiz(
	contentID uuid default gen_random_uuid() primary key,
	contentName text not null,
	quizContent jsonb not null,
	isGraded bool default false, -- This might be better inside the JSON instead of as a column
	moduleID uuid not null references OnlineModule on delete cascade
);

create table ModuleContentMultimedia(
	contentID uuid default gen_random_uuid() primary key,
	contentName text not null,
	contentLocation text not null, -- URL or file system path
	mediaType text not null, -- video, PDF, etc.
	moduleID uuid not null references OnlineModule on delete cascade
);

create table ModuleContentHTML(
	contentID uuid default gen_random_uuid() primary key,
	contentName text not null,
	html xml not null,
	isMainPage bool default false,
	canGoBack bool default true,
	moduleID uuid not null references OnlineModule on delete cascade
);

create table StudentModuleCompletion(
	studentID uuid not null references Student on delete cascade,
	moduleID uuid not null references OnlineModule on delete cascade,
	grade real,
	completionDate timestamp not null
);

create table QuizAttempt(
	studentID uuid not null references Student,
	quizID uuid not null references ModuleContentQuiz(contentID) on delete cascade,
	grade real,
	attemptDate timestamp not null
);

create table TrainingPrerequisiteModule(
	levelID uuid not null references TrainingLevel on delete cascade,
	moduleID uuid not null references OnlineModule on delete cascade,
	isOptional bool default false,
	timeBeforeSession interval default '00:00:00',
	validInterval interval default '1 year'
);

create table TrainingPrerequisiteLevel(
	levelID uuid not null references TrainingLevel,
	prereqLevelID uuid not null references TrainingLevel(levelID) on delete cascade,
	isOptional bool default false,
	timeBeforeSession interval default '00:00:00',
	validInterval interval default '1 year'
);

-- Table for machines and rooms for which card access depends on shop training
create table CardAccessMachine(
	machineID uuid default gen_random_uuid() primary key,
	machineName text not null
);

-- Table for individual card access entries linking a student to a machine
create table CardAccessEntry(
	entryID uuid default gen_random_uuid() primary key,
	studentID uuid not null references Student on delete cascade,
	machineID uuid not null references CardAccessMachine on delete cascade,
	expirationDate timestamp
);

-- Mock login table
create table MockLogin(
	username text not null primary key,
	hashedPasswd text not null,
	isInstructor bool default false
);

-- Function to delete expired card access entries
create function remove_expired() returns trigger
	language PLPGSQL
	as $$
	begin
		delete from CardAccessEntry where expirationDate < CURRENT_TIMESTAMP;
	end;
	$$;

-- Trigger to clean up expired card access entries whenever card access table is updated or deleted
create trigger Cleanup after insert or update on CardAccessEntry
	for each statement execute function remove_expired();
