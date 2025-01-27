const courseType = {
    solo: "Individual",
    soloLowerCase: "individual",
    teamBasedLowerCase: "team-based",
    teamBased: "Team-based",
    soloDescription: "In this type of course, students work individually - each student forms a separate single-person team.",
    teamBasedDescription: "In this type of course, students work in groups - teams created by teachers consist of multiple people.",
    cannotBeChanged: "Course type cannot be changed after creation.",
};

const podType = {
    stateful: "Stateful",
    stateless: "Stateless"
};

const activeStatus = {
    active: "Active",
    inactive: "Inactive",
};

const teamsList = {
    title: "Your teams",
    table: {
        columns: {
            status: "Status",
            name: "Name",
            course: "Course",
        },
        noTeams: "You are not currently a member of any team",
    },
    viewDetails: "View details",
    searchPlaceholder: "Search team...",
    clear: "Clear",
    searchType: {
        placeholder: "Search type",
        teamName: "Team name",
        studentName: "Student",
        studentEmail: "Student e-mail",
    },
    searchResults: "Student IDs"
};

const joinTeamModal = {
    button: "Join team",
    title: "Join team",
    keyLabel: "Key",
    keyDescription: "Enter the key provided by your teacher",
    validation: {
        keyMinLength: "Key cannot be shorter than 4 characters",
        keyMaxLength: "Key cannot be longer than 20 characters",
        keyRegex: "Key can only contain letters, numbers and special characters: _ -",
    },
    success: "Successfully joined team",
};

const teamDetails = {
    title: "Team",
    leaveTeam: {
        button: "Leave team",
        confirmHeader: "Leave team",
        confirmText: "Are you sure you want to leave this team? After leaving, you will lose the ability to make reservations for PODs assigned to this team.",
        success: "Successfully left the team",
    },
    detailsCard: {
        title: "Details",
        courseName: "Course",
        courseDescription: "Course description",
        courseStatus: "Team status",
        courseType: "Course type",
    },
    course: "Course:",
    status: "Status:",
    teamMembers: "Students",
    teamEmpty: "Team is empty",
    assignedPods: "Assigned PODs",
    noPods: "This team has no assigned PODs",
    error: {
        notInTeam: "You must be a team member to view team details",
        teamNotFound: "Team not found",
        leaveTeamError: "Failed to leave team",
    },
};

const podCard = {
    course: "Course",
    description: "Course Description",
    makeAReservation: "Make a reservation",
    maxRent: "Maximum number of reservations",
    availableRents: "Number of available reservations",
    noRentLimit: "No reservation limit"
};

const createCourseModalB = {
    teamBased: {
        title: "Course type",
        description: {
            solo: "In an individual course, teams are created automatically when students join. Each student works individually in a separate team.",
            teamBased: "In a team-based course, teams are created manually by teachers. Students work together in multi-person teams."
        }
    }
};

const coursePageB = {
    courseTypeCard: {
        title: "Course type",
    },
    courseAccessKeyCard: {
        title: "Access key",
        keyCopiedToast: "Course access key has been copied to clipboard",
        button: "Create access key",
    },
    teamsTable: {
        button: "Teams",
        title: "Course teams",
        back: "Return to course",
        noTeams: "No teams",
        students: "Add student",
        createTeam: "Create team",
        edit: "Edit",
        columns: {
            name: "Name",
            status: "Status",
            member: "Student",
            members: "Students",
            noMembers: "Team is empty",
            maxSize: "Max. number of students",
            operations: "Operations",
            accessKey: {
                label: "Access key",
                copy: "Copy",
                copied: "Team access key has been copied to clipboard",
            }
        },
        dropdownMenu: {
            editTeam: "Edit",
            manageUsers: "Students",
            manageStatefulPods: "Stateful PODs",
            manageStatelessPods: "Stateless PODs",
            reservations: "Reservations",
            deleteTeam: {
                button: "Delete team",
                confirmation: {
                    title: "Delete team",
                    description: "Are you sure you want to delete this team? After deletion, all students in this team will lose access to assigned resources",
                }
            },
            removeStudent: "Remove student from course",
        },
    },
    teachersCard: {
        title: "Teachers",
        noTeachers: "This course has no assigned teachers",
        manageTeachers: "Manage teachers",
    },
    courseTeamsPage: {
        searchByEmail: {
            button: "Search students by IDs",
            clear: "Clear search",
        },
        removeStudentFromCourseSuccess: "Student has been removed from course",
        removeStudentFromTeamSuccess: "Student has been removed from team",
        statistics: "Reservation statistics",
    }
};

const createCourseKeyModal = {
    title: "Create course access key",
    keyLabel: "Access key",
    description: {
        title: "Requirements:",
        line1: "Access key cannot be modified",
        line2: "Access key must be unique across all courses",
        line3: "Access key must be between 4 and 20 characters long (letters, numbers, and special characters _ - only)",
    },
    validation: {
        keyMinLength: "Key cannot be shorter than 4 characters",
        keyMaxLength: "Key cannot be longer than 20 characters",
        keyRegex: "Key can only contain letters, numbers and special characters: _ -",
    },
    success: "Course access key has been created successfully",
};

const statefulPodManagementDrawer = {
    title: "Stateful PODs management - team",
    resourceGroups: "Course's resource groups",
    teamPods: "Team's stateful PODs",
    createPod: "Create POD",
    success: "Stateful POD has been created successfully",
    noPods: "Team has no assigned PODs",
    noResourceGroups: "This course has no stateful resource groups",
    resourceGroup: "Resource Group",
    maxRent: "Maximum number of POD reservations",
    alerts: {
        hasAssociatedPod: "This resource group is already assigned to a POD",
        noVMs: "This resource group has no virtual machines.",
    },
    delete: {
        button: "Delete",
        confirmHeader: "Delete stateful POD",
        confirmText: "Are you sure you want to delete this stateful POD? The team will lose the ability to make reservations for resources assigned to this POD.",
        success: "Stateful POD has been deleted successfully",
    },
    addMaxRentTimeModal: {
        title: "Complete stateful POD creation",
        description: "Set the maximum number of reservations that students can make within this POD. This value cannot be changed.",
        maxRent: "Maximum number of reservations",
        success: "Maximum number of reservations has been updated successfully",
    }
};

const statelessPodManagementDrawer = {
    title: "Stateless PODs management - team",
    resourceGroupPools: "Course's resource group pools",
    teamPods: "Team stateless PODs",
    createPod: "Create POD",
    success: "Stateless POD has been created successfully",
    noPods: "Team has no assigned PODs",
    noResourceGroupPools: "This course has no resource group pools",
    resourceGroupPool: "Resource group pool",
    alerts: {
        hasAssociatedPod: "This resource group pool is already assigned to a POD",
    },
    delete: {
        button: "Delete",
        confirmHeader: "Delete POD",
        confirmText: "Are you sure you want to delete this POD? The team will lose the ability to make reservations for resources assigned to this POD.",
        success: "Stateless POD has been deleted successfully",
    },
};

const soloTeamEditModal = {
    title: "Edit team",
    active: "Activity status",
    activeDescription: "When a team is deactivated, students cannot join the team or make a reservation on its assigned resources",
    success: "Team has been updated successfully",
};

const editTeamModal = {
    title: "Edit team",
    name: "Team name",
    nameDescription: "New team name must be unique within the course",
    maxSize: "Maximum number of students",
    maxSizeDescription: "Maximum number of students cannot be smaller than the current number of students",
    success: "Team has been updated successfully",
    validation: {
        teamNameMin: "Team name is required",
        teamNameMax: "Team name cannot exceed 50 characters",
        teamNameRegex: "Team name can only contain letters, numbers, spaces and special characters: - _",
        maxSizeMin: "Maximum number of students must be greater than or equal to 2",
        maxSizeMax: "Maximum number of students cannot exceed 10",
    }
};

const manageTeamUsersModal = {
    title: "Students in team",
    remove: "Remove",
    add: "Add",
    noUsers: "This team is empty",
    delete: {
        title: "Remove student",
        title2: "from team",
        description: "This action will prevent the student from making reservations for resources assigned to this team. Are you sure you want to remove this student from the team?",
        success: "Student has been removed from team successfully",
    },
    addUser: {
        email: "Email address",
        description: "Email address of the student to be added to the team",
        success: "Student has been added to the team successfully",
        validation: {
            email: "Invalid email format"
        }
    }
};

const manageCourseUsersModal = {
    title: "Add student to course",
    remove: "Remove",
    add: "Add",
    noUsers: "This course has no students",
    delete: {
        title: "Remove student",
        title2: "from course",
        description: "This action will prevent the student from making reservations for resources assigned to this student. Are you sure you want to remove this student from the course?",
        success: "Student has been removed from course successfully",
    },
    addUser: {
        email: "Email address",
        description: "Email address of the student to be added to the course",
        success: "Student has been added to the course successfully",
        validation: {
            email: "Invalid email format"
        }
    }
};

const manageTeachersModal = {
    title: "Teachers in course",
    current: "Remove",
    add: "Add",
    remove: "Remove",
    noTeachers: "This course has no teachers",
    addTeacher: {
        email: "Email address",
        description: "Enter the email address of the teacher you want to add to the course",
        success: "Teacher has been added to the course successfully",
        validation: {
            email: "Invalid email format"
        }
    },
    delete: {
        title: "Remove teacher from course",
        description: "This action will result in the teacher losing access to course management. Are you sure you want to remove this teacher from the course?",
        success: "Teacher has been removed from the course",
    },
    success: {
        add: "Teacher has been added to the course",
        remove: "Teacher has been removed from the course"
    },
    error: {
        add: "Failed to add teacher to the course",
        remove: "Failed to remove teacher from the course"
    }
};

const createTeamModal = {
    title: "Create team",
    singleTab: "Manual",
    bulkTab: "Automatic",
    name: "Name",
    key: "Access key",
    keyDescription: "Leaving this field empty will generate a random, unique team access key",
    maxSize: "Maximum number of students in team",
    prefix: "Team name prefix",
    prefixDescription: "Team names will be created with the given prefix and sequential number, e.g. 'GivenPrefix-1'",
    teamCount: "Number of teams to create",
    keyCreatedAutomatically: "A unique access key for each automatically created team will be generated automatically",
    validation: {
        teamNameMin: "Team name is required",
        teamNameMax: "Team name cannot exceed 50 characters",
        teamNameRegex: "Team name can only contain letters, numbers, spaces and special characters: - _",
        keyMinLength: "Key cannot be shorter than 4 characters",
        keyMaxLength: "Key cannot be longer than 20 characters",
        keyRegex: "Key can only contain letters and numbers",
        maxSizeMin: "Maximum number of students must be greater than or equal to 2",
        maxSizeMax: "Maximum number of students cannot exceed 10",
        teamCountMin: "Number of teams must be greater than 1",
        teamCountMax: "Number of teams cannot exceed 10",
        prefixMin: "Prefix is required",
        prefixMax: "Prefix cannot exceed 40 characters",
        prefixRegex: "Prefix can only contain letters and numbers",
    },
    success: "Team has been created successfully",
    batchSuccess: "Teams have been created successfully",
    deleteSuccess: "Team has been deleted successfully",
};

const searchByEmailModal = {
    title: "Search students by IDs",
    search: "Search",
    placeholder: "Enter student identifier...",
    description1: "To add a student ID to the search, type the value in the text field and press Enter or Space. Student ID can be removed by clicking the X symbol.",
    description2: "To enter multiple student IDs at once, separate them with a comma or space and paste from clipboard.",
};

const podManagement = {
    button: "Stateless PODs",
    title: "Stateless PODs management",
    resourcePools: "Resource group pools",
    search: "Search teams...",
    createPods: "Create PODs",
    deletePods: "Delete PODs",
    columns: {
        name: "Team name",
        members: "Student",
        status: "Has POD"
    },
    status: {
        hasPod: "Yes",
        noPod: "No"
    },
    noTeams: "No teams to display",
    loading: "Loading...",
    noResourceGroupPools: "This course has no resource group pools",
    searchPlaceholder: "Search by name, surname or email...",
    filterByPod: "Filter by status",
    filters: {
        all: "All teams",
        withPod: "Teams with POD",
        withoutPod: "Teams without POD"
    },
    selectPoolPrompt: "Select a resource group pool from the list on the left",
    confirmCreate: {
        description: "Are you sure you want to create stateless PODs for selected teams with the chosen resource group pool?",
        title: "Create stateless PODs"
    },
    confirmDelete: {
        description: "Are you sure you want to delete stateless PODs for selected teams?",
        title: "Delete stateless PODs"
    },
    createSuccess: "Stateless PODs have been created successfully",
    deleteSuccess: "Stateless PODs have been deleted successfully",
};

const reservationStatisticsModal = {
    button: "Reservation statistics",
    title: "Reservation statistics",
    teams: {
        modalTitle: "reservation statistics",
        noReservations: "No reservations found",
        noReservationsDescription: "This team has no historical reservation data to display",
        totalReservations: "Total reservations",
        totalHours: "Total hours",
        averageLength: "Average length",
        statefulCount: "Stateful resource reservations",
        poolCount: "Stateless resource reservations",
        dailyUsage: "Daily resource usage",
        dailyUsageDescription: "Chart shows the number of hours reserved per resource each day",
        noReservationsForDay: "This day had no reservations",
    },
    tabs: {
        overview: "Overview",
        teams: "Teams",
        resources: "Resources"
    }
};

export default {
    podType,
    activeStatus,
    courseType,
    teamDetails,
    podCard,
    teamsList,
    coursePageB,
    createCourseB: createCourseModalB,
    statefulPodManagement: statefulPodManagementDrawer,
    statelessPodManagement: statelessPodManagementDrawer,
    soloTeamEdit: soloTeamEditModal,
    joinTeam: joinTeamModal,
    editTeam: editTeamModal,
    createTeam: createTeamModal,
    createCourseKey: createCourseKeyModal,
    manageTeamUsers: manageTeamUsersModal,
    manageCourseUsers: manageCourseUsersModal,
    manageTeachers: manageTeachersModal,
    searchByEmail: searchByEmailModal,
    podManagement,
    statistics: reservationStatisticsModal
};
